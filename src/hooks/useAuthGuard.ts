import { useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

// ============================================================================
// Types
// ============================================================================

export interface AuthGuardOptions {
  requireAuth?: boolean;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  requireAllRoles?: boolean;
  requireAllPermissions?: boolean;
  onAccessDenied?: (reason: string) => void;
  redirectTo?: string;
  showAlert?: boolean;
}

export interface AuthGuardResult {
  // Access control
  isAuthenticated: boolean;
  hasAccess: boolean;
  isLoading: boolean;
  
  // Role & Permission checks
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasAllRoles: (roles: string[]) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  
  // User info
  user: any;
  roles: string[];
  permissions: string[];
  
  // Actions
  login: (redirectUrl?: string) => void;
  logout: () => void;
  
  // Utilities
  requireAuth: (redirectUrl?: string) => boolean;
  requireRole: (role: string) => boolean;
  requirePermission: (permission: string) => boolean;
  requireAnyRole: (roles: string[]) => boolean;
  requireAllRoles: (roles: string[]) => boolean;
  requireAnyPermission: (permissions: string[]) => boolean;
  requireAllPermissions: (permissions: string[]) => boolean;
  
  // Token info
  tokenTimeRemaining: number;
  isTokenExpiringSoon: boolean;
  formatTokenTime: (seconds: number) => string;
  
  // Error handling
  error: string | null;
  clearError: () => void;
}

// ============================================================================
// Role Hierarchy for easy access
// ============================================================================

const ROLE_HIERARCHY = {
  'ADMIN': ['ADMIN', 'VETERINER', 'SEKRETER', 'TEKNISYEN'],
  'VETERINER': ['VETERINER', 'TEKNISYEN'],
  'SEKRETER': ['SEKRETER'],
  'TEKNISYEN': ['TEKNISYEN']
};

// ============================================================================
// Permission Mappings for easy access
// ============================================================================

const PERMISSION_MAPPINGS = {
  'animals:read': ['ADMIN', 'VETERINER', 'SEKRETER', 'TEKNISYEN'],
  'animals:write': ['ADMIN', 'VETERINER', 'SEKRETER'],
  'animals:delete': ['ADMIN', 'VETERINER'],
  'appointments:read': ['ADMIN', 'VETERINER', 'SEKRETER'],
  'appointments:write': ['ADMIN', 'VETERINER', 'SEKRETER'],
  'appointments:delete': ['ADMIN', 'VETERINER'],
  'laboratory:read': ['ADMIN', 'VETERINER', 'TEKNISYEN'],
  'laboratory:write': ['ADMIN', 'VETERINER', 'TEKNISYEN'],
  'laboratory:delete': ['ADMIN', 'VETERINER'],
  'billing:read': ['ADMIN', 'VETERINER', 'SEKRETER'],
  'billing:write': ['ADMIN', 'SEKRETER'],
  'billing:delete': ['ADMIN'],
  'reports:read': ['ADMIN', 'VETERINER'],
  'reports:write': ['ADMIN'],
  'settings:read': ['ADMIN'],
  'settings:write': ['ADMIN'],
  'users:read': ['ADMIN'],
  'users:write': ['ADMIN'],
  'audit:read': ['ADMIN'],
};

// ============================================================================
// Main Hook
// ============================================================================

export const useAuthGuard = (options: AuthGuardOptions = {}): AuthGuardResult => {
  const {
    requireAuth = true,
    requiredRoles = [],
    requiredPermissions = [],
    requireAllRoles = false,
    requireAllPermissions = false,
    onAccessDenied,
    redirectTo = '/login',
    showAlert = true
  } = options;

  const {
    state,
    login,
    logout,
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAllRoles,
    isTokenExpiringSoon,
    getTokenTimeRemaining,
    formatTokenTime,
    addAuditLog
  } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  // ============================================================================
  // Role & Permission Validations
  // ============================================================================

  const validateRoles = useMemo(() => {
    if (requiredRoles.length === 0) return true;
    
    return requireAllRoles 
      ? hasAllRoles(requiredRoles)
      : hasAnyRole(requiredRoles);
  }, [requiredRoles, requireAllRoles, hasAllRoles, hasAnyRole]);

  const validatePermissions = useMemo(() => {
    if (requiredPermissions.length === 0) return true;
    
    return requireAllPermissions
      ? requiredPermissions.every(permission => hasPermission(permission))
      : requiredPermissions.some(permission => hasPermission(permission));
  }, [requiredPermissions, requireAllPermissions, hasPermission]);

  // ============================================================================
  // Access Control
  // ============================================================================

  const hasAccess = useMemo(() => {
    if (requireAuth && !state.isAuthenticated) return false;
    if (!validateRoles) return false;
    if (!validatePermissions) return false;
    return true;
  }, [requireAuth, state.isAuthenticated, validateRoles, validatePermissions]);

  // ============================================================================
  // Enhanced Permission Checks
  // ============================================================================

  const hasAnyPermission = useCallback((permissions: string[]) => {
    return permissions.some(permission => hasPermission(permission));
  }, [hasPermission]);

  const hasAllPermissions = useCallback((permissions: string[]) => {
    return permissions.every(permission => hasPermission(permission));
  }, [hasPermission]);

  // ============================================================================
  // Enhanced Role Checks with Hierarchy
  // ============================================================================

  const hasRoleWithHierarchy = useCallback((role: string) => {
    const userRoles = state.roles || [];
    return userRoles.some(userRole => {
      const allowedRoles = ROLE_HIERARCHY[userRole as keyof typeof ROLE_HIERARCHY] || [];
      return allowedRoles.includes(role);
    });
  }, [state.roles]);

  const hasAnyRoleWithHierarchy = useCallback((roles: string[]) => {
    return roles.some(role => hasRoleWithHierarchy(role));
  }, [hasRoleWithHierarchy]);

  const hasAllRolesWithHierarchy = useCallback((roles: string[]) => {
    return roles.every(role => hasRoleWithHierarchy(role));
  }, [hasRoleWithHierarchy]);

  // ============================================================================
  // Permission-Role Mapping Checks
  // ============================================================================

  const hasPermissionByRole = useCallback((permission: string) => {
    const userRoles = state.roles || [];
    const allowedRoles = PERMISSION_MAPPINGS[permission as keyof typeof PERMISSION_MAPPINGS] || [];
    return userRoles.some(userRole => allowedRoles.includes(userRole));
  }, [state.roles]);

  // ============================================================================
  // Requirement Functions
  // ============================================================================

  const requireAuthFn = useCallback((redirectUrl?: string) => {
    if (!state.isAuthenticated) {
      if (onAccessDenied) {
        onAccessDenied('Authentication required');
      }
      
      const finalRedirectUrl = redirectUrl || redirectTo;
      if (finalRedirectUrl) {
        const url = `${finalRedirectUrl}?redirect=${encodeURIComponent(location.pathname + location.search)}`;
        navigate(url);
      }
      
      addAuditLog('permission_check', {
        action: 'requireAuth',
        result: 'denied',
        reason: 'Not authenticated',
        path: location.pathname
      });
      
      return false;
    }
    return true;
  }, [state.isAuthenticated, onAccessDenied, redirectTo, location, navigate, addAuditLog]);

  const requireRoleFn = useCallback((role: string) => {
    if (!hasRole(role)) {
      if (onAccessDenied) {
        onAccessDenied(`Role required: ${role}`);
      }
      
      addAuditLog('permission_check', {
        action: 'requireRole',
        result: 'denied',
        reason: `Role required: ${role}`,
        userRoles: state.roles,
        path: location.pathname
      });
      
      return false;
    }
    return true;
  }, [hasRole, onAccessDenied, state.roles, location, addAuditLog]);

  const requirePermissionFn = useCallback((permission: string) => {
    if (!hasPermission(permission)) {
      if (onAccessDenied) {
        onAccessDenied(`Permission required: ${permission}`);
      }
      
      addAuditLog('permission_check', {
        action: 'requirePermission',
        result: 'denied',
        reason: `Permission required: ${permission}`,
        userPermissions: state.permissions,
        path: location.pathname
      });
      
      return false;
    }
    return true;
  }, [hasPermission, onAccessDenied, state.permissions, location, addAuditLog]);

  const requireAnyRoleFn = useCallback((roles: string[]) => {
    if (!hasAnyRole(roles)) {
      if (onAccessDenied) {
        onAccessDenied(`One of these roles required: ${roles.join(', ')}`);
      }
      
      addAuditLog('permission_check', {
        action: 'requireAnyRole',
        result: 'denied',
        reason: `One of these roles required: ${roles.join(', ')}`,
        userRoles: state.roles,
        path: location.pathname
      });
      
      return false;
    }
    return true;
  }, [hasAnyRole, onAccessDenied, state.roles, location, addAuditLog]);

  const requireAllRolesFn = useCallback((roles: string[]) => {
    if (!hasAllRoles(roles)) {
      if (onAccessDenied) {
        onAccessDenied(`All of these roles required: ${roles.join(', ')}`);
      }
      
      addAuditLog('permission_check', {
        action: 'requireAllRoles',
        result: 'denied',
        reason: `All of these roles required: ${roles.join(', ')}`,
        userRoles: state.roles,
        path: location.pathname
      });
      
      return false;
    }
    return true;
  }, [hasAllRoles, onAccessDenied, state.roles, location, addAuditLog]);

  const requireAnyPermissionFn = useCallback((permissions: string[]) => {
    if (!hasAnyPermission(permissions)) {
      if (onAccessDenied) {
        onAccessDenied(`One of these permissions required: ${permissions.join(', ')}`);
      }
      
      addAuditLog('permission_check', {
        action: 'requireAnyPermission',
        result: 'denied',
        reason: `One of these permissions required: ${permissions.join(', ')}`,
        userPermissions: state.permissions,
        path: location.pathname
      });
      
      return false;
    }
    return true;
  }, [hasAnyPermission, onAccessDenied, state.permissions, location, addAuditLog]);

  const requireAllPermissionsFn = useCallback((permissions: string[]) => {
    if (!hasAllPermissions(permissions)) {
      if (onAccessDenied) {
        onAccessDenied(`All of these permissions required: ${permissions.join(', ')}`);
      }
      
      addAuditLog('permission_check', {
        action: 'requireAllPermissions',
        result: 'denied',
        reason: `All of these permissions required: ${permissions.join(', ')}`,
        userPermissions: state.permissions,
        path: location.pathname
      });
      
      return false;
    }
    return true;
  }, [hasAllPermissions, onAccessDenied, state.permissions, location, addAuditLog]);

  // ============================================================================
  // Error Handling
  // ============================================================================

  const clearError = useCallback(() => {
    // Implementation depends on how errors are managed in AuthContext
    // For now, this is a placeholder
  }, []);

  // ============================================================================
  // Return Object
  // ============================================================================

  return {
    // Access control
    isAuthenticated: state.isAuthenticated,
    hasAccess,
    isLoading: state.isLoading,
    
    // Role & Permission checks
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAllRoles,
    hasAnyPermission,
    hasAllPermissions,
    
    // User info
    user: state.user,
    roles: state.roles,
    permissions: state.permissions,
    
    // Actions
    login,
    logout,
    
    // Utilities
    requireAuth: requireAuthFn,
    requireRole: requireRoleFn,
    requirePermission: requirePermissionFn,
    requireAnyRole: requireAnyRoleFn,
    requireAllRoles: requireAllRolesFn,
    requireAnyPermission: requireAnyPermissionFn,
    requireAllPermissions: requireAllPermissionsFn,
    
    // Token info
    tokenTimeRemaining: state.tokenTimeRemaining,
    isTokenExpiringSoon: isTokenExpiringSoon(),
    formatTokenTime,
    
    // Error handling
    error: state.error,
    clearError
  };
};

// ============================================================================
// Specialized Hooks
// ============================================================================

export const useAdminGuard = (options: Omit<AuthGuardOptions, 'requiredRoles'> = {}) => {
  return useAuthGuard({
    ...options,
    requiredRoles: ['ADMIN']
  });
};

export const useVeterinarianGuard = (options: Omit<AuthGuardOptions, 'requiredRoles'> = {}) => {
  return useAuthGuard({
    ...options,
    requiredRoles: ['ADMIN', 'VETERINER'],
    requireAllRoles: false
  });
};

export const useSecretaryGuard = (options: Omit<AuthGuardOptions, 'requiredRoles'> = {}) => {
  return useAuthGuard({
    ...options,
    requiredRoles: ['ADMIN', 'VETERINER', 'SEKRETER'],
    requireAllRoles: false
  });
};

export const useTechnicianGuard = (options: Omit<AuthGuardOptions, 'requiredRoles'> = {}) => {
  return useAuthGuard({
    ...options,
    requiredRoles: ['ADMIN', 'VETERINER', 'TEKNISYEN'],
    requireAllRoles: false
  });
};

// ============================================================================
// Permission-based Hooks
// ============================================================================

export const useAnimalsGuard = (action: 'read' | 'write' | 'delete' = 'read') => {
  return useAuthGuard({
    requiredPermissions: [`animals:${action}`]
  });
};

export const useAppointmentsGuard = (action: 'read' | 'write' | 'delete' = 'read') => {
  return useAuthGuard({
    requiredPermissions: [`appointments:${action}`]
  });
};

export const useLaboratoryGuard = (action: 'read' | 'write' | 'delete' = 'read') => {
  return useAuthGuard({
    requiredPermissions: [`laboratory:${action}`]
  });
};

export const useBillingGuard = (action: 'read' | 'write' | 'delete' = 'read') => {
  return useAuthGuard({
    requiredPermissions: [`billing:${action}`]
  });
};

export const useReportsGuard = (action: 'read' | 'write' = 'read') => {
  return useAuthGuard({
    requiredPermissions: [`reports:${action}`]
  });
};

export const useSettingsGuard = (action: 'read' | 'write' = 'read') => {
  return useAuthGuard({
    requiredPermissions: [`settings:${action}`]
  });
};

export const useUsersGuard = (action: 'read' | 'write' = 'read') => {
  return useAuthGuard({
    requiredPermissions: [`users:${action}`]
  });
};

export const useAuditGuard = () => {
  return useAuthGuard({
    requiredPermissions: ['audit:read']
  });
};

export default useAuthGuard; 