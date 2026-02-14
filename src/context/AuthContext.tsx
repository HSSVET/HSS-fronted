import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signOut, getIdTokenResult } from 'firebase/auth';
import { useIdleTimeout } from '../hooks/useIdleTimeout';
import { apiClient } from '../services/api';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface AuthUser {
  id: string;
  firebaseUid: string;
  email: string;
  username?: string;     // Added for compatibility
  firstName?: string;    // Added for compatibility
  lastName?: string;     // Added for compatibility
  userType?: 'STAFF' | 'OWNER';
  clinicId?: number;
  clinicSlug?: string; // Added for Semantic URLs
  ownerId?: number;      // Added
  staffId?: number;      // Added
  roles: string[];
  permissions: string[]; // Can be derived from roles
}

export interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  // Legacy properties relied upon by useAuthGuard
  roles: string[];
  permissions: string[];
  error: string | null;
  tokenTimeRemaining: number;
}

export type AuthAction =
  | { type: 'AUTH_INIT_START' }
  | { type: 'AUTH_INIT_SUCCESS'; payload: { user: AuthUser | null } }
  | { type: 'AUTH_INIT_FAILURE'; payload: { error: string } }
  | { type: 'Layout_LOGOUT' }
  | { type: 'UPDATE_TOKEN_TIME'; payload: { time: number } };

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  isLoading: true,
  user: null,
  roles: [],
  permissions: [],
  error: null,
  tokenTimeRemaining: 0,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_INIT_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_INIT_SUCCESS':
      return {
        ...state,
        isAuthenticated: !!action.payload.user,
        isInitialized: true,
        isLoading: false,
        user: action.payload.user,
        roles: action.payload.user?.roles || [],
        permissions: action.payload.user?.permissions || [],
        error: null,
      };
    case 'AUTH_INIT_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        isInitialized: true,
        isLoading: false,
        roles: [],
        permissions: [],
        error: action.payload.error,
      };
    case 'Layout_LOGOUT':
      return { ...initialState, isInitialized: true, isLoading: false };
    case 'UPDATE_TOKEN_TIME':
      return { ...state, tokenTimeRemaining: action.payload.time };
    default:
      return state;
  }
};

export interface AuthContextType {
  state: AuthState;

  // Direct access for compatibility
  user: AuthUser | null;
  roles: string[];
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (redirectUrl?: string) => void;
  logout: () => Promise<void>;
  syncUserWithBackend: (user: User) => Promise<AuthUser>;

  // Utils
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasAllRoles: (roles: string[]) => boolean;
  isTokenExpiringSoon: () => boolean;
  getTokenTimeRemaining: () => number;
  formatTokenTime: (seconds: number) => string;
  addAuditLog: (action: string, details: any) => void; // Placeholder
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const syncUserWithBackend = useCallback(async (firebaseUser: User): Promise<AuthUser> => {
    try {
      const token = await firebaseUser.getIdToken();

      const response = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        throw new Error(`Sync failed: ${response.statusText}`);
      }

      const data = await response.json();

      const idTokenResult = await firebaseUser.getIdTokenResult(true);
      const claims = idTokenResult.claims;

      const user: AuthUser = {
        id: data.userId || firebaseUser.uid,
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email || '',
        userType: (claims.user_type as 'STAFF' | 'OWNER') || data.userType,
        clinicId: Number(claims.clinic_id || data.clinicId),
        clinicSlug: (claims.clinic_slug as string) || data.clinicSlug, // Map slug
        ownerId: Number(claims.owner_id || data.ownerId),
        staffId: Number(claims.staff_id || data.staffId),
        roles: (claims.roles as string[]) || data.roles || [],
        permissions: (claims.permissions as string[]) || data.permissions || []
      };

      return user;

    } catch (error) {
      console.error('Failed to sync user with backend:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    dispatch({ type: 'AUTH_INIT_START' });
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const user = await syncUserWithBackend(firebaseUser);
          dispatch({ type: 'AUTH_INIT_SUCCESS', payload: { user } });
        } catch (error) {
          console.error("Auth sync error", error);
          dispatch({ type: 'AUTH_INIT_FAILURE', payload: { error: 'Backend sync failed' } });
          signOut(auth);
        }
      } else {
        dispatch({ type: 'AUTH_INIT_SUCCESS', payload: { user: null } });
      }
    });

    return () => unsubscribe();
  }, [syncUserWithBackend]);

  // API client'a clinic context ver (JWT'de clinic_id yoksa backend X-Clinic-Id/Slug header kullanır)
  useEffect(() => {
    const id = state.user?.clinicId;
    const slug = state.user?.clinicSlug;
    const validId = id != null && !Number.isNaN(Number(id)) ? Number(id) : undefined;
    if (validId != null || slug) {
      apiClient.setClinicContext(validId, slug);
    } else {
      apiClient.setClinicContext(undefined, undefined);
    }
  }, [state.user?.clinicId, state.user?.clinicSlug]);

  const login = useCallback((redirectUrl?: string) => {
    // Ideally use navigate here but we are in context
    if (redirectUrl) {
      localStorage.setItem('auth_redirect_url', redirectUrl);
    }
    window.location.href = '/login';
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      dispatch({ type: 'Layout_LOGOUT' });
    } catch (error) {
      console.error('Logout failed', error);
    }
  }, []);

  // Helper implementations
  const hasRole = useCallback((role: string) => {
    return state.user?.roles?.includes(role) || false;
  }, [state.user]);

  const hasPermission = useCallback((permission: string) => {
    // Simplified permission check: Admin has all permissions logic could go here
    if (state.user?.roles?.includes('ADMIN')) return true;
    return state.user?.permissions?.includes(permission) || false;
  }, [state.user]);

  const hasAnyRole = useCallback((roles: string[]) => {
    return roles.some(role => hasRole(role));
  }, [hasRole]);

  const hasAllRoles = useCallback((roles: string[]) => {
    return roles.every(role => hasRole(role));
  }, [hasRole]);

  const isTokenExpiringSoon = useCallback(() => false, []); // Placeholder
  const getTokenTimeRemaining = useCallback(() => 3600, []); // Placeholder
  const formatTokenTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);
  const addAuditLog = useCallback((action: string, details: any) => {
    console.log('Audit Log:', action, details);
  }, []);

  const contextValue: AuthContextType = useMemo(() => ({
    state,

    // Direct access
    user: state.user,
    roles: state.user?.roles || [],
    permissions: state.user?.permissions || [],
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,

    login,
    logout,
    syncUserWithBackend,

    hasRole,
    hasPermission,
    hasAnyRole,
    hasAllRoles,
    isTokenExpiringSoon,
    getTokenTimeRemaining,
    formatTokenTime,
    addAuditLog
  }), [state, login, logout, syncUserWithBackend, hasRole, hasPermission, hasAnyRole, hasAllRoles, isTokenExpiringSoon, getTokenTimeRemaining, formatTokenTime, addAuditLog]);

  // useIdleTimeout(state.isAuthenticated, logout); // 30 minutes default
  // Importing dynamically or assuming it's imported at top
  useIdleTimeout(state.isAuthenticated, logout);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};