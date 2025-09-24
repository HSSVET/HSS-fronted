import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { OFFLINE_MODE } from '../config/offline';
import { User } from '../types/common';

// Mock data for offline mode
const mockUser = {
  id: 'mock-user',
  sub: 'mock-user',
  username: 'demo_user',
  email: 'demo@vetklinik.com',
  firstName: 'Demo',
  lastName: 'User',
  roles: ['ADMIN', 'VETERINER'],
  permissions: [
    'dashboard:read', 'animals:read', 'animals:write', 'appointments:read', 'appointments:write',
    'laboratory:read', 'laboratory:write', 'billing:read', 'billing:write', 'inventory:read',
    'inventory:write', 'reports:read', 'settings:read', 'settings:write', 'vaccinations:read',
    'vaccinations:write'
  ],
  lastLogin: new Date(),
  sessionId: 'mock-session',
  department: 'Veterinary',
  title: 'Demo Veteriner'
};

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface AuthUser extends User {
  sub: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
  lastLogin: Date;
  sessionId: string;
  department?: string;
  title?: string;
  profilePicture?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'tr' | 'en';
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
  };
  dashboard: {
    layout: 'classic' | 'modern';
    widgets: string[];
  };
}

export interface AuthSession {
  sessionId: string;
  isActive: boolean;
  createdAt: Date;
  lastActivity: Date;
  expiresAt: Date;
  device: string;
  ip: string;
  userAgent: string;
}

export interface SecuritySettings {
  mfaEnabled: boolean;
  mfaMethod: 'sms' | 'email' | 'authenticator';
  passwordLastChanged: Date;
  loginAttempts: number;
  accountLocked: boolean;
  lockoutUntil?: Date;
}

export interface AuthState {
  // Authentication Status
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;

  // User Information
  user: AuthUser | null;
  permissions: string[];
  roles: string[];

  // Session Management
  session: AuthSession | null;
  tokenTimeRemaining: number;

  // Security
  security: SecuritySettings | null;

  // Error & Status
  error: string | null;
  lastError: Error | null;

  // UI State
  showLoginModal: boolean;
  showMfaModal: boolean;
  loginRedirectUrl: string | null;

  // Audit & Logging
  auditLog: AuditEntry[];
}

export interface AuditEntry {
  id: string;
  action: 'login' | 'logout' | 'token_refresh' | 'permission_check' | 'error';
  timestamp: Date;
  details: Record<string, any>;
  severity: 'info' | 'warning' | 'error';
}

// ============================================================================
// Actions
// ============================================================================

export type AuthAction =
  | { type: 'AUTH_INITIALIZE_START' }
  | { type: 'AUTH_INITIALIZE_SUCCESS'; payload: { user: AuthUser; session: AuthSession } }
  | { type: 'AUTH_INITIALIZE_FAILURE'; payload: { error: string } }
  | { type: 'AUTH_LOGIN_START' }
  | { type: 'AUTH_LOGIN_SUCCESS'; payload: { user: AuthUser; session: AuthSession } }
  | { type: 'AUTH_LOGIN_FAILURE'; payload: { error: string } }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_TOKEN_REFRESH'; payload: { tokenTimeRemaining: number } }
  | { type: 'AUTH_UPDATE_USER'; payload: { user: Partial<AuthUser> } }
  | { type: 'AUTH_UPDATE_PERMISSIONS'; payload: { permissions: string[] } }
  | { type: 'AUTH_SET_ERROR'; payload: { error: string | null } }
  | { type: 'AUTH_SET_LOADING'; payload: { isLoading: boolean } }
  | { type: 'AUTH_SET_SESSION'; payload: { session: AuthSession } }
  | { type: 'AUTH_SET_SECURITY'; payload: { security: SecuritySettings } }
  | { type: 'AUTH_SHOW_LOGIN_MODAL'; payload: { show: boolean; redirectUrl?: string } }
  | { type: 'AUTH_SHOW_MFA_MODAL'; payload: { show: boolean } }
  | { type: 'AUTH_ADD_AUDIT_LOG'; payload: { entry: AuditEntry } }
  | { type: 'AUTH_CLEAR_AUDIT_LOG' };

// ============================================================================
// Initial State
// ============================================================================

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  isLoading: false,
  user: null,
  permissions: [],
  roles: [],
  session: null,
  tokenTimeRemaining: 0,
  security: null,
  error: null,
  lastError: null,
  showLoginModal: false,
  showMfaModal: false,
  loginRedirectUrl: null,
  auditLog: []
};

// ============================================================================
// Reducer
// ============================================================================

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_INITIALIZE_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case 'AUTH_INITIALIZE_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        isInitialized: true,
        isLoading: false,
        user: action.payload.user,
        session: action.payload.session,
        roles: action.payload.user.roles,
        permissions: action.payload.user.permissions,
        error: null
      };

    case 'AUTH_INITIALIZE_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        isInitialized: true,
        isLoading: false,
        error: action.payload.error
      };

    case 'AUTH_LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case 'AUTH_LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload.user,
        session: action.payload.session,
        roles: action.payload.user.roles,
        permissions: action.payload.user.permissions,
        error: null,
        showLoginModal: false
      };

    case 'AUTH_LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error
      };

    case 'AUTH_LOGOUT':
      return {
        ...initialState,
        isInitialized: true
      };

    case 'AUTH_TOKEN_REFRESH':
      return {
        ...state,
        tokenTimeRemaining: action.payload.tokenTimeRemaining
      };

    case 'AUTH_UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload.user } : null
      };

    case 'AUTH_UPDATE_PERMISSIONS':
      return {
        ...state,
        permissions: action.payload.permissions
      };

    case 'AUTH_SET_ERROR':
      return {
        ...state,
        error: action.payload.error
      };

    case 'AUTH_SET_LOADING':
      return {
        ...state,
        isLoading: action.payload.isLoading
      };

    case 'AUTH_SET_SESSION':
      return {
        ...state,
        session: action.payload.session
      };

    case 'AUTH_SET_SECURITY':
      return {
        ...state,
        security: action.payload.security
      };

    case 'AUTH_SHOW_LOGIN_MODAL':
      return {
        ...state,
        showLoginModal: action.payload.show,
        loginRedirectUrl: action.payload.redirectUrl || null
      };

    case 'AUTH_SHOW_MFA_MODAL':
      return {
        ...state,
        showMfaModal: action.payload.show
      };

    case 'AUTH_ADD_AUDIT_LOG':
      return {
        ...state,
        auditLog: [action.payload.entry, ...state.auditLog.slice(0, 99)] // Keep last 100 entries
      };

    case 'AUTH_CLEAR_AUDIT_LOG':
      return {
        ...state,
        auditLog: []
      };

    default:
      return state;
  }
};

// ============================================================================
// Context
// ============================================================================

export interface AuthContextType {
  state: AuthState;

  // Direct access to state properties (for convenience)
  user: AuthUser | null;
  roles: string[];
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Auth Actions
  login: (redirectUrl?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;

  // User Actions
  updateUser: (userData: Partial<AuthUser>) => Promise<void>;
  updatePreferences: (preferences: UserPreferences) => Promise<void>;

  // Permission & Role Checks
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasAllRoles: (roles: string[]) => boolean;

  // Session Management
  validateSession: () => Promise<boolean>;
  extendSession: () => Promise<void>;
  getSessions: () => Promise<AuthSession[]>;
  terminateSession: (sessionId: string) => Promise<void>;

  // Security
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  enableMFA: (method: 'sms' | 'email' | 'authenticator') => Promise<void>;
  disableMFA: () => Promise<void>;

  // Audit
  addAuditLog: (action: AuditEntry['action'], details: Record<string, any>) => void;
  clearAuditLog: () => void;

  // UI Actions
  showLoginModal: (redirectUrl?: string) => void;
  hideLoginModal: () => void;
  showMfaModal: () => void;
  hideMfaModal: () => void;

  // Utils
  isTokenExpiringSoon: () => boolean;
  getTokenTimeRemaining: () => number;
  formatTokenTime: (seconds: number) => string;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ============================================================================
// Provider Component
// ============================================================================

export interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProviderOnline: React.FC<AuthProviderProps> = ({ children }) => {
  // Disabled for offline-only mode
  console.warn('AuthProviderOnline is disabled - using offline mode only');
  return <AuthProviderOffline>{children}</AuthProviderOffline>;
  /*
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { keycloak, initialized } = useKeycloak();
  const tokenManager = useMemo(() => {
    if (!keycloak || !keycloak.authenticated) return null;
    return new TokenManager(keycloak);
  }, [keycloak?.authenticated, keycloak?.token]);

  // ============================================================================
  // Helper Functions
  // ============================================================================

  const addAuditLog = useCallback((action: AuditEntry['action'], details: Record<string, any>) => {
    const entry: AuditEntry = {
      id: crypto.randomUUID(),
      action,
      timestamp: new Date(),
      details,
      severity: action === 'error' ? 'error' : 'info'
    };
    dispatch({ type: 'AUTH_ADD_AUDIT_LOG', payload: { entry } });
  }, []);

  const createAuthUser = useCallback((keycloakUser: any): AuthUser => {
    // Get roles from Keycloak
    const roles = keycloakUser.realm_access?.roles || [];

    // Map roles to permissions
    const permissions: string[] = [];

    // Add permissions based on roles
    if (roles.includes('ADMIN')) {
      permissions.push(
        'animals:read', 'animals:write', 'animals:delete',
        'appointments:read', 'appointments:write', 'appointments:delete',
        'laboratory:read', 'laboratory:write', 'laboratory:delete',
        'billing:read', 'billing:write', 'billing:delete',
        'reports:read', 'reports:write',
        'settings:read', 'settings:write',
        'users:read', 'users:write',
        'audit:read'
      );
    } else if (roles.includes('VETERINER')) {
      permissions.push(
        'animals:read', 'animals:write', 'animals:delete',
        'appointments:read', 'appointments:write', 'appointments:delete',
        'laboratory:read', 'laboratory:write', 'laboratory:delete',
        'billing:read',
        'reports:read'
      );
    } else if (roles.includes('SEKRETER')) {
      permissions.push(
        'animals:read', 'animals:write',
        'appointments:read', 'appointments:write',
        'billing:read', 'billing:write'
      );
    } else if (roles.includes('TEKNISYEN')) {
      permissions.push(
        'animals:read',
        'laboratory:read', 'laboratory:write'
      );
    }

    // Determine primary role (highest in hierarchy)
    let primaryRole: 'admin' | 'veterinarian' | 'assistant' = 'assistant';
    if (roles.includes('ADMIN')) primaryRole = 'admin';
    else if (roles.includes('VETERINER')) primaryRole = 'veterinarian';
    else if (roles.includes('SEKRETER')) primaryRole = 'assistant'; // Secretary maps to assistant
    else if (roles.includes('TEKNISYEN')) primaryRole = 'assistant'; // Technician maps to assistant

    return {
      id: keycloakUser.sub || crypto.randomUUID(),
      sub: keycloakUser.sub,
      username: keycloakUser.preferred_username || '',
      email: keycloakUser.email || '',
      name: `${keycloakUser.given_name || ''} ${keycloakUser.family_name || ''}`.trim(),
      firstName: keycloakUser.given_name || '',
      lastName: keycloakUser.family_name || '',
      roles: roles,
      permissions: permissions,
      lastLogin: new Date(),
      sessionId: keycloakUser.session_state || crypto.randomUUID(),
      role: primaryRole,
      createdAt: new Date(),
      updatedAt: new Date(),
      department: keycloakUser.department,
      title: keycloakUser.title,
      profilePicture: keycloakUser.picture,
      preferences: {
        theme: 'light',
        language: 'tr',
        notifications: {
          email: true,
          push: true,
          desktop: true
        },
        dashboard: {
          layout: 'modern',
          widgets: ['dashboard', 'appointments', 'animals']
        }
      }
    };
  }, []);

  const createAuthSession = useCallback((keycloakUser: any): AuthSession => {
    return {
      sessionId: keycloakUser.session_state || crypto.randomUUID(),
      isActive: true,
      createdAt: new Date(),
      lastActivity: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      device: navigator.userAgent,
      ip: 'unknown', // Would be populated by backend
      userAgent: navigator.userAgent
    };
  }, []);

  // ============================================================================
  // Auth Actions
  // ============================================================================

  const login = useCallback(async (redirectUrl?: string) => {
    try {
      if (OFFLINE_MODE) {
        dispatch({ type: 'AUTH_LOGIN_START' });
        dispatch({ type: 'AUTH_LOGIN_SUCCESS', payload: { user: state.user as AuthUser, session: state.session as AuthSession } });
        return;
      }
      console.log('🎯 AuthContext login called with:', redirectUrl);
      console.log('🔐 Keycloak instance:', keycloak);
      console.log('🌐 Current location:', window.location.href);

      dispatch({ type: 'AUTH_LOGIN_START' });
      addAuditLog('login', { redirectUrl });

      // Store the intended redirect URL in localStorage for after login
      if (redirectUrl && redirectUrl !== window.location.origin) {
        localStorage.setItem('auth_redirect_url', redirectUrl);
        console.log('💾 Stored redirect URL in localStorage:', redirectUrl);
      }

      const loginOptions = { redirectUri: window.location.origin };
      console.log('🚀 Calling keycloak.login with options:', loginOptions);

      // Always redirect to the application origin, not the target path
      try {
        await keycloak.login(loginOptions);
        console.log('✅ Keycloak login call completed');
      } catch (keycloakError) {
        console.warn('⚠️ Keycloak.login failed, trying manual redirect:', keycloakError);

        // Manual redirect as fallback
        const loginUrl = `${keycloak.authServerUrl}/realms/${keycloak.realm}/protocol/openid-connect/auth?client_id=${keycloak.clientId}&redirect_uri=${encodeURIComponent(window.location.origin)}&response_type=code&scope=openid`;
        console.log('🔗 Manual redirect URL:', loginUrl);
        window.location.href = loginUrl;
      }
    } catch (error) {
      console.error('❌ AuthContext login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'AUTH_LOGIN_FAILURE', payload: { error: errorMessage } });
      addAuditLog('error', { action: 'login', error: errorMessage });
    }
  }, [keycloak, addAuditLog, state.user, state.session]);

  const logout = useCallback(async () => {
    try {
      if (OFFLINE_MODE) {
        dispatch({ type: 'AUTH_LOGOUT' });
        return;
      }
      addAuditLog('logout', { sessionId: state.session?.sessionId });

      // Cleanup token manager
      if (tokenManager) {
        tokenManager.cleanup();
      }
      
      // Clear API client - setKeycloak method removed
      
      dispatch({ type: 'AUTH_LOGOUT' });

      await keycloak.logout({ redirectUri: window.location.origin });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      addAuditLog('error', { action: 'logout', error: errorMessage });
    }
  }, [keycloak, tokenManager, state.session, addAuditLog]);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      if (OFFLINE_MODE) {
        return true;
      }
      if (!tokenManager) return false;

      const success = await tokenManager.refreshToken();
      if (success) {
        const timeRemaining = tokenManager.getTokenTimeRemaining();
        dispatch({ type: 'AUTH_TOKEN_REFRESH', payload: { tokenTimeRemaining: timeRemaining } });
        addAuditLog('token_refresh', { success: true, timeRemaining });
      }
      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Token refresh failed';
      addAuditLog('error', { action: 'token_refresh', error: errorMessage });
      return false;
    }
  }, [tokenManager, addAuditLog]);

  // ============================================================================
  // Permission & Role Checks
  // ============================================================================

  const hasPermission = useCallback((permission: string): boolean => {
    const result = state.permissions.includes(permission);
    addAuditLog('permission_check', { permission, result });
    return result;
  }, [state.permissions, addAuditLog]);

  const hasRole = useCallback((role: string): boolean => {
    return state.roles.includes(role);
  }, [state.roles]);

  const hasAnyRole = useCallback((roles: string[]): boolean => {
    return roles.some(role => state.roles.includes(role));
  }, [state.roles]);

  const hasAllRoles = useCallback((roles: string[]): boolean => {
    return roles.every(role => state.roles.includes(role));
  }, [state.roles]);

  // ============================================================================
  // Utility Functions
  // ============================================================================

  const isTokenExpiringSoon = useCallback((): boolean => {
    return state.tokenTimeRemaining < 300; // 5 minutes
  }, [state.tokenTimeRemaining]);

  const getTokenTimeRemaining = useCallback((): number => {
    return tokenManager?.getTokenTimeRemaining() || 0;
  }, [tokenManager]);

  const formatTokenTime = useCallback((seconds: number): string => {
    if (seconds <= 0) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  // ============================================================================
  // Session Management
  // ============================================================================

  const validateSession = useCallback(async (): Promise<boolean> => {
    try {
      if (OFFLINE_MODE) return true;
      if (!keycloak.authenticated) return false;

      const valid = await keycloak.updateToken(5);
      return valid;
    } catch (error) {
      return false;
    }
  }, [keycloak]);

  // ============================================================================
  // UI Actions
  // ============================================================================

  const showLoginModal = useCallback((redirectUrl?: string) => {
    dispatch({ type: 'AUTH_SHOW_LOGIN_MODAL', payload: { show: true, redirectUrl } });
  }, []);

  const hideLoginModal = useCallback(() => {
    dispatch({ type: 'AUTH_SHOW_LOGIN_MODAL', payload: { show: false } });
  }, []);

  const showMfaModal = useCallback(() => {
    dispatch({ type: 'AUTH_SHOW_MFA_MODAL', payload: { show: true } });
  }, []);

  const hideMfaModal = useCallback(() => {
    dispatch({ type: 'AUTH_SHOW_MFA_MODAL', payload: { show: false } });
  }, []);

  // ============================================================================
  // Initialization Effect
  // ============================================================================

  useEffect(() => {
    if (OFFLINE_MODE) {
      dispatch({ type: 'AUTH_INITIALIZE_START' });
      const mockUser: AuthUser = {
        id: 'offline-user',
        sub: 'offline-user',
        username: 'offline',
        email: 'offline@example.com',
        name: 'Offline Kullanıcı',
        firstName: 'Offline',
        lastName: 'User',
        roles: ['ADMIN'],
        permissions: [
          'animals:read','animals:write','animals:delete',
          'appointments:read','appointments:write','appointments:delete',
          'laboratory:read','laboratory:write','laboratory:delete',
          'billing:read','billing:write','billing:delete',
          'reports:read','reports:write',
          'settings:read','settings:write',
          'users:read','users:write','audit:read'
        ],
        lastLogin: new Date(),
        sessionId: 'offline-session',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      } as AuthUser;

      const mockSession: AuthSession = {
        sessionId: 'offline-session',
        isActive: true,
        createdAt: new Date(),
        lastActivity: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        device: 'offline-device',
        ip: '127.0.0.1',
        userAgent: 'offline'
      };
      dispatch({ type: 'AUTH_INITIALIZE_SUCCESS', payload: { user: mockUser, session: mockSession } });
      return;
    }
    console.log('🔄 AuthContext: useEffect called with:', {
      initialized,
      authenticated: keycloak.authenticated,
      tokenExists: !!keycloak.token,
      tokenParsedExists: !!keycloak.tokenParsed,
      isInitialized: state.isInitialized
    });

    if (!initialized) {
      console.log('⏳ AuthContext: Waiting for keycloak initialization...');
      return;
    }

    if (state.isInitialized) {
      console.log('✅ AuthContext: Already initialized, skipping...');
      return;
    }

    const initializeAuth = async () => {
      try {
        console.log('🔄 AuthContext: Starting authentication initialization');
        console.log('🔐 Keycloak authenticated:', keycloak.authenticated);
        console.log('🔐 Keycloak token:', keycloak.token ? 'EXISTS' : 'MISSING');
        console.log('🔐 Keycloak tokenParsed:', keycloak.tokenParsed);

        dispatch({ type: 'AUTH_INITIALIZE_START' });

        if (keycloak.authenticated && keycloak.tokenParsed) {
          console.log('✅ User is authenticated, creating auth user');

          // Create user and session
          const user = createAuthUser(keycloak.tokenParsed);
          const session = createAuthSession(keycloak.tokenParsed);

          console.log('👤 Created auth user:', user);
          console.log('🔗 Created auth session:', session);
          console.log('🎯 User roles:', user.roles);
          console.log('🔑 User permissions:', user.permissions);
          console.log('👨‍💼 Primary role:', user.role);

          // Setup API client
          apiClient.setKeycloak(keycloak);

          // Setup token manager
          if (tokenManager) {
            tokenManager.onTokenExpiration(() => {
              dispatch({ type: 'AUTH_SET_ERROR', payload: { error: 'Session expired. Please login again.' } });
            });
          }

          console.log('✅ Dispatching AUTH_INITIALIZE_SUCCESS');
          dispatch({
            type: 'AUTH_INITIALIZE_SUCCESS',
            payload: { user, session }
          });

          addAuditLog('login', {
            method: 'sso',
            sessionId: session.sessionId,
            userAgent: navigator.userAgent
          });

          // Handle post-login redirect
          const savedRedirectUrl = localStorage.getItem('auth_redirect_url');
          console.log('🔗 Saved redirect URL:', savedRedirectUrl);
          if (savedRedirectUrl && savedRedirectUrl !== window.location.pathname) {
            localStorage.removeItem('auth_redirect_url');
            // Don't use window.location.href here, let LoginPage handle navigation
            // The LoginPage component will handle the redirect with React Router
            console.log('✅ Post-login redirect URL ready:', savedRedirectUrl);
          }
        } else {
          console.log('❌ User is not authenticated');
          dispatch({
            type: 'AUTH_INITIALIZE_FAILURE',
            payload: { error: 'Not authenticated' }
          });
        }
      } catch (error) {
        console.error('❌ AuthContext initialization error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Initialization failed';
        dispatch({ type: 'AUTH_INITIALIZE_FAILURE', payload: { error: errorMessage } });
        addAuditLog('error', { action: 'initialization', error: errorMessage });
      }
    };

    initializeAuth();
  }, [initialized, keycloak.authenticated, keycloak.tokenParsed, state.isInitialized]);

  // ============================================================================
  // Token Time Update Effect
  // ============================================================================

  useEffect(() => {
    if (OFFLINE_MODE) return;
    if (!keycloak.authenticated || !tokenManager) return;

    const updateTokenTime = () => {
      const timeRemaining = tokenManager.getTokenTimeRemaining();
      // Only update if time remaining has changed significantly (more than 5 seconds)
      if (Math.abs(timeRemaining - state.tokenTimeRemaining) > 5) {
        dispatch({ type: 'AUTH_TOKEN_REFRESH', payload: { tokenTimeRemaining: timeRemaining } });
      }
    };

    updateTokenTime();
    // Update less frequently to reduce re-renders
    const interval = setInterval(updateTokenTime, 10000); // Changed from 1000ms to 10000ms

    return () => clearInterval(interval);
  }, [keycloak.authenticated, tokenManager, state.tokenTimeRemaining]);

  // ============================================================================
  // Debug: Add auth state to window for debugging
  // ============================================================================

  useEffect(() => {
    (window as any).authContextState = state;
    (window as any).authDebugFull = {
      ...state,
      keycloakInitialized: initialized,
      keycloakAuthenticated: keycloak.authenticated,
      keycloakToken: keycloak.token ? 'EXISTS' : 'MISSING',
      keycloakTokenParsed: keycloak.tokenParsed ? 'EXISTS' : 'MISSING'
    };
  }, [state, initialized, keycloak.authenticated, keycloak.token, keycloak.tokenParsed]);

  // ============================================================================
  // Context Value
  // ============================================================================

  const contextValue: AuthContextType = {
    state,

    // Direct access to state properties
    user: state.user,
    roles: state.roles,
    permissions: state.permissions,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,

    // Auth Actions
    login,
    logout,
    refreshToken,

    // User Actions
    updateUser: async (userData: Partial<AuthUser>) => {
      dispatch({ type: 'AUTH_UPDATE_USER', payload: { user: userData } });
    },
    updatePreferences: async (preferences: UserPreferences) => {
      dispatch({ type: 'AUTH_UPDATE_USER', payload: { user: { preferences } } });
    },

    // Permission & Role Checks
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAllRoles,

    // Session Management
    validateSession,
    extendSession: async () => {
      await refreshToken();
    },
    getSessions: async () => {
      // Would be implemented with backend API
      return [];
    },
    terminateSession: async (sessionId: string) => {
      // Would be implemented with backend API
      console.log('Terminating session:', sessionId);
    },

    // Security
    changePassword: async (currentPassword: string, newPassword: string) => {
      // Would be implemented with Keycloak API
      console.log('Changing password');
    },
    enableMFA: async (method: 'sms' | 'email' | 'authenticator') => {
      // Would be implemented with Keycloak API
      console.log('Enabling MFA:', method);
    },
    disableMFA: async () => {
      // Would be implemented with Keycloak API
      console.log('Disabling MFA');
    },

    // Audit
    addAuditLog,
    clearAuditLog: () => dispatch({ type: 'AUTH_CLEAR_AUDIT_LOG' }),

    // UI Actions
    showLoginModal,
    hideLoginModal,
    showMfaModal,
    hideMfaModal,

    // Utils
    isTokenExpiringSoon,
    getTokenTimeRemaining,
    formatTokenTime
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
  */
};

// Google Cloud Identity Platform Auth Provider (Firebase Client SDK kullanarak)
const AuthProviderIdentityPlatform: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [idToken, setIdToken] = React.useState<string | null>(null);
  const [firebaseUser, setFirebaseUser] = React.useState<any>(null);

  // Import Firebase Auth
  const auth = React.useMemo(() => {
    try {
      return require('../config/firebase').auth;
    } catch (error) {
      console.error('Failed to import Firebase auth:', error);
      return null;
    }
  }, []);

  const mapRoleToPermissions = useCallback((role: string): string[] => {
    const permissions: string[] = [];
    switch (role) {
      case 'ADMIN':
        permissions.push(
          'animals:read', 'animals:write', 'animals:delete',
          'appointments:read', 'appointments:write', 'appointments:delete',
          'laboratory:read', 'laboratory:write', 'laboratory:delete',
          'billing:read', 'billing:write', 'billing:delete',
          'reports:read', 'reports:write',
          'settings:read', 'settings:write',
          'users:read', 'users:write',
          'audit:read'
        );
        break;
      case 'VET':
      case 'VETERINER':
      case 'VETERINARIAN':
        permissions.push(
          'animals:read', 'animals:write', 'animals:delete',
          'appointments:read', 'appointments:write', 'appointments:delete',
          'laboratory:read', 'laboratory:write', 'laboratory:delete',
          'billing:read',
          'reports:read'
        );
        break;
      case 'CLINIC_STAFF':
      case 'STAFF':
        permissions.push(
          'animals:read', 'animals:write',
          'appointments:read', 'appointments:write',
          'billing:read', 'billing:write'
        );
        break;
      case 'OWNER':
        permissions.push(
          'animals:read',
          'appointments:read'
        );
        break;
    }
    return permissions;
  }, []);

  // Create AuthUser from Firebase User and ID Token
  const createAuthUser = useCallback(async (user: any, token: string): Promise<AuthUser> => {
    try {
      // Decode ID token to get custom claims (role)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = (payload.role as string) || '';
      const nameParts = user.displayName?.split(' ') || [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      return {
        id: user.uid,
        sub: user.uid,
        username: user.email?.split('@')[0] || '',
        email: user.email || '',
        name: user.displayName || user.email || '',
        firstName,
        lastName,
        roles: role ? [role] : [],
        permissions: mapRoleToPermissions(role),
        lastLogin: new Date(),
        sessionId: user.uid,
        role: role.toLowerCase() as 'admin' | 'veterinarian' | 'assistant',
        createdAt: user.metadata?.creationTime ? new Date(user.metadata.creationTime) : new Date(),
        updatedAt: user.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime) : new Date(),
        profilePicture: user.photoURL || undefined,
      };
    } catch (error) {
      console.error('Error creating auth user:', error);
      throw error;
    }
  }, [mapRoleToPermissions]);

  // Create AuthSession from Firebase User and ID Token
  const createAuthSession = useCallback((user: any, token: string): AuthSession => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp ? new Date(payload.exp * 1000) : new Date(Date.now() + 3600000);

      return {
        sessionId: user.uid,
        isActive: true,
        createdAt: user.metadata?.creationTime ? new Date(user.metadata.creationTime) : new Date(),
        lastActivity: new Date(),
        expiresAt: exp,
        device: navigator.userAgent,
        ip: 'unknown',
        userAgent: navigator.userAgent
      };
    } catch (error) {
      console.error('Error creating auth session:', error);
      return {
        sessionId: user.uid,
        isActive: true,
        createdAt: new Date(),
        lastActivity: new Date(),
        expiresAt: new Date(Date.now() + 3600000),
        device: navigator.userAgent,
        ip: 'unknown',
        userAgent: navigator.userAgent
      };
    }
  }, []);

  // Initialize - Firebase Auth state listener
  useEffect(() => {
    if (!auth) {
      dispatch({ type: 'AUTH_INITIALIZE_FAILURE', payload: { error: 'Firebase Auth not available' } });
      return;
    }

    dispatch({ type: 'AUTH_INITIALIZE_START' });

    // Firebase Auth state listener
    const { onAuthStateChanged, User } = require('firebase/auth');
    const unsubscribe = onAuthStateChanged(auth, async (user: typeof User | null) => {
      try {
        if (user) {
          // User is signed in
          setFirebaseUser(user);

          // Get ID token
          const token = await user.getIdToken(true); // Force refresh to get latest custom claims
          setIdToken(token);

          // Create auth user and session
          const authUser = await createAuthUser(user, token);
          const session = createAuthSession(user, token);

          dispatch({
            type: 'AUTH_INITIALIZE_SUCCESS',
            payload: { user: authUser, session }
          });

          // Store token in localStorage for API calls
          localStorage.setItem('hss_id_token', token);
        } else {
          // User is signed out
          setFirebaseUser(null);
          setIdToken(null);
          localStorage.removeItem('hss_id_token');
          localStorage.removeItem('hss_refresh_token');
          localStorage.removeItem('hss_token_expiry');
          dispatch({ type: 'AUTH_INITIALIZE_FAILURE', payload: { error: 'Not authenticated' } });
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        dispatch({ type: 'AUTH_INITIALIZE_FAILURE', payload: { error: 'Failed to initialize authentication' } });
      }
    });

    return () => unsubscribe();
  }, [auth, createAuthUser, createAuthSession]);

  // Token refresh on interval
  useEffect(() => {
    if (!state.isAuthenticated || !firebaseUser || !auth) return;

    const interval = setInterval(async () => {
      try {
        // Firebase automatically handles token refresh
        // Just update the stored token
        const token = await firebaseUser.getIdToken(true);
        setIdToken(token);
        localStorage.setItem('hss_id_token', token);
      } catch (error) {
        console.error('Token refresh error:', error);
        // Token refresh failed, logout
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    }, 55 * 60 * 1000); // Refresh every 55 minutes (tokens expire in 1 hour)

    return () => clearInterval(interval);
  }, [state.isAuthenticated, firebaseUser, auth]);

  const login = useCallback(async (redirectUrl?: string) => {
    try {
      dispatch({ type: 'AUTH_LOGIN_START' });
      // Login handled by LoginForm component via Firebase SDK
      // This is just a placeholder - actual login is done in LoginForm
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'AUTH_LOGIN_FAILURE', payload: { error: errorMessage } });
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (!auth) return;
      const { signOut } = require('firebase/auth');
      await signOut(auth);

      // Cleanup
      localStorage.removeItem('hss_id_token');
      localStorage.removeItem('hss_refresh_token');
      localStorage.removeItem('hss_token_expiry');
      localStorage.removeItem('hss_user_info');
      setIdToken(null);
      setFirebaseUser(null);
      dispatch({ type: 'AUTH_LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      // Even if signOut fails, clear local state
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  }, [auth]);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      if (!firebaseUser || !auth) return false;
      const token = await firebaseUser.getIdToken(true);
      setIdToken(token);
      localStorage.setItem('hss_id_token', token);
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }, [firebaseUser, auth]);

  const getTokenTimeRemainingFromToken = useCallback((token: string): number => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.exp) return 0;
      return Math.max(0, Math.floor((payload.exp * 1000 - Date.now()) / 1000));
    } catch {
      return 0;
    }
  }, []);

  const contextValue: AuthContextType = {
    state,
    user: state.user,
    roles: state.roles,
    permissions: state.permissions,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    logout,
    refreshToken,
    updateUser: async (userData: Partial<AuthUser>) => {
      dispatch({ type: 'AUTH_UPDATE_USER', payload: { user: userData } });
    },
    updatePreferences: async (preferences: UserPreferences) => {
      dispatch({ type: 'AUTH_UPDATE_USER', payload: { user: { preferences } } });
    },
    hasPermission: useCallback((permission: string) => {
      return state.permissions.includes(permission);
    }, [state.permissions]),
    hasRole: useCallback((role: string) => state.roles.includes(role), [state.roles]),
    hasAnyRole: useCallback((roles: string[]) => roles.some(role => state.roles.includes(role)), [state.roles]),
    hasAllRoles: useCallback((roles: string[]) => roles.every(role => state.roles.includes(role)), [state.roles]),
    validateSession: async () => {
      if (!firebaseUser || !auth) return false;
      try {
        // Firebase automatically validates tokens
        await firebaseUser.getIdToken(true);
        return true;
      } catch {
        return false;
      }
    },
    extendSession: async () => {
      await refreshToken();
    },
    getSessions: async () => [],
    terminateSession: async () => { },
    changePassword: async () => { },
    enableMFA: async () => { },
    disableMFA: async () => { },
    addAuditLog: () => { },
    clearAuditLog: () => { },
    showLoginModal: () => { },
    hideLoginModal: () => { },
    showMfaModal: () => { },
    hideMfaModal: () => { },
    isTokenExpiringSoon: () => {
      if (!idToken) return true;
      try {
        const payload = JSON.parse(atob(idToken.split('.')[1]));
        const exp = payload.exp * 1000;
        return Date.now() >= exp - 5 * 60 * 1000; // 5 minutes buffer
      } catch {
        return true;
      }
    },
    getTokenTimeRemaining: () => {
      if (!idToken) return 0;
      return getTokenTimeRemainingFromToken(idToken);
    },
    formatTokenTime: (seconds: number) => {
      if (seconds <= 0) return '00:00';
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

const AuthProviderOffline: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Offline mod: doğrudan mock kullanıcı ile initialize
    const mockUser: AuthUser = {
      id: 'offline-user',
      sub: 'offline-user',
      username: 'offline',
      email: 'offline@example.com',
      name: 'Offline Kullanıcı',
      firstName: 'Offline',
      lastName: 'User',
      roles: ['ADMIN'],
      permissions: [
        'animals:read', 'animals:write', 'animals:delete',
        'appointments:read', 'appointments:write', 'appointments:delete',
        'laboratory:read', 'laboratory:write', 'laboratory:delete',
        'billing:read', 'billing:write', 'billing:delete',
        'reports:read', 'reports:write',
        'settings:read', 'settings:write',
        'users:read', 'users:write', 'audit:read'
      ],
      lastLogin: new Date(),
      sessionId: 'offline-session',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    } as AuthUser;

    const mockSession: AuthSession = {
      sessionId: 'offline-session',
      isActive: true,
      createdAt: new Date(),
      lastActivity: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      device: 'offline-device',
      ip: '127.0.0.1',
      userAgent: 'offline'
    };

    dispatch({ type: 'AUTH_INITIALIZE_START' });
    dispatch({ type: 'AUTH_INITIALIZE_SUCCESS', payload: { user: mockUser, session: mockSession } });
  }, []);

  const contextValue: AuthContextType = {
    state,
    user: state.user,
    roles: state.roles,
    permissions: state.permissions,
    isAuthenticated: true,
    isLoading: false,
    error: null,
    login: async () => { },
    logout: async () => { dispatch({ type: 'AUTH_LOGOUT' }); },
    refreshToken: async () => true,
    updateUser: async (userData: Partial<AuthUser>) => {
      dispatch({ type: 'AUTH_UPDATE_USER', payload: { user: userData } });
    },
    updatePreferences: async (preferences: UserPreferences) => {
      dispatch({ type: 'AUTH_UPDATE_USER', payload: { user: { preferences } } });
    },
    hasPermission: (permission: string) => {
      const result = state.permissions.includes(permission);
      console.log(`🔑 Permission check: ${permission} = ${result}`);
      return result;
    },
    hasRole: (role: string) => state.roles.includes(role),
    hasAnyRole: (roles: string[]) => roles.some(role => state.roles.includes(role)),
    hasAllRoles: (roles: string[]) => roles.every(role => state.roles.includes(role)),
    validateSession: async () => true,
    extendSession: async () => { },
    getSessions: async () => [],
    terminateSession: async () => { },
    changePassword: async () => { },
    enableMFA: async () => { },
    disableMFA: async () => { },
    addAuditLog: () => { },
    clearAuditLog: () => { },
    showLoginModal: () => { },
    hideLoginModal: () => { },
    showMfaModal: () => { },
    hideMfaModal: () => { },
    isTokenExpiringSoon: () => false,
    getTokenTimeRemaining: () => 9999,
    formatTokenTime: () => '99:59'
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Use Google Cloud Identity Platform (Firebase Client SDK)
  const { OFFLINE_MODE } = require('../config/offline');

  if (OFFLINE_MODE) {
    console.log('🔐 Using AuthProviderOffline (mock auth, real API calls)');
    return <AuthProviderOffline>{children}</AuthProviderOffline>;
  }

  console.log('🔐 Using AuthProviderIdentityPlatform (GCP Identity Platform Firebase Client SDK)');
  return <AuthProviderIdentityPlatform>{children}</AuthProviderIdentityPlatform>;
};

// ============================================================================
// Custom Hook
// ============================================================================

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 