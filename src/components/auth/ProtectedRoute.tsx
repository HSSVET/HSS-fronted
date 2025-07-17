import React, { useEffect, useState, useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, CircularProgress, Alert, Fade, Backdrop } from '@mui/material';
import { Security, Block, VpnKey } from '@mui/icons-material';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface ProtectedRouteProps {
  children: React.ReactNode;
  
  // Role-based access control
  requiredRoles?: string[];
  requiredPermissions?: string[];
  requireAllRoles?: boolean;
  requireAllPermissions?: boolean;
  
  // Page-level settings
  requireAuth?: boolean;
  requireMFA?: boolean;
  
  // Fallback components
  fallback?: React.ReactNode;
  unauthorizedFallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
  
  // Redirection
  redirectTo?: string;
  preserveRedirectUrl?: boolean;
  
  // Security options
  sessionValidation?: boolean;
  tokenValidation?: boolean;
  auditAccess?: boolean;
  
  // UI options
  showAccessDenied?: boolean;
  showLoading?: boolean;
  
  // Advanced options
  customValidator?: (user: any) => Promise<boolean> | boolean;
  onAccessDenied?: (reason: string) => void;
  onAccessGranted?: (user: any) => void;
}

// ============================================================================
// Access Control Types
// ============================================================================

type AccessLevel = 'granted' | 'denied' | 'pending' | 'expired' | 'locked';

interface AccessResult {
  level: AccessLevel;
  reason: string;
  redirect?: string;
  showModal?: boolean;
}

// ============================================================================
// Default Role Hierarchy
// ============================================================================

const ROLE_HIERARCHY = {
  'ADMIN': ['ADMIN', 'VETERINER', 'SEKRETER', 'TEKNISYEN'],
  'VETERINER': ['VETERINER', 'TEKNISYEN'],
  'SEKRETER': ['SEKRETER'],
  'TEKNISYEN': ['TEKNISYEN']
};

// ============================================================================
// Permission Mappings
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
// Access Control Hook
// ============================================================================

const useAccessControl = (props: ProtectedRouteProps) => {
  const { 
    requiredRoles, 
    requiredPermissions, 
    requireAllRoles, 
    requireAllPermissions,
    requireAuth,
    requireMFA,
    sessionValidation,
    tokenValidation,
    customValidator,
    auditAccess,
    onAccessGranted,
    onAccessDenied
  } = props;
  
  const { state, hasPermission, hasAnyRole, hasAllRoles, addAuditLog, validateSession } = useAuth();
  const location = useLocation();
  
  const [accessResult, setAccessResult] = useState<AccessResult>({
    level: 'pending',
    reason: 'Checking access...'
  });

  // ============================================================================
  // Role & Permission Validation
  // ============================================================================

  const validateRoles = useMemo(() => {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    
    const hasRequiredRoles = requireAllRoles 
      ? hasAllRoles(requiredRoles)
      : hasAnyRole(requiredRoles);
    
    return hasRequiredRoles;
  }, [requiredRoles, requireAllRoles, hasAllRoles, hasAnyRole]);

  const validatePermissions = useMemo(() => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    
    const hasRequiredPermissions = requireAllPermissions
      ? requiredPermissions.every(permission => hasPermission(permission))
      : requiredPermissions.some(permission => hasPermission(permission));
    
    return hasRequiredPermissions;
  }, [requiredPermissions, requireAllPermissions, hasPermission]);

  // ============================================================================
  // Role Hierarchy Check
  // ============================================================================

  const validateRoleHierarchy = useMemo(() => {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    
    const userRoles = state.roles || [];
    
    return requiredRoles.some(requiredRole => {
      return userRoles.some(userRole => {
        const allowedRoles = ROLE_HIERARCHY[userRole as keyof typeof ROLE_HIERARCHY] || [];
        return allowedRoles.includes(requiredRole);
      });
    });
  }, [requiredRoles, state.roles]);

  // ============================================================================
  // Permission-Role Mapping Check
  // ============================================================================

  const validatePermissionRoleMapping = useMemo(() => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    
    const userRoles = state.roles || [];
    
    return requiredPermissions.some(permission => {
      const allowedRoles = PERMISSION_MAPPINGS[permission as keyof typeof PERMISSION_MAPPINGS] || [];
      return userRoles.some(userRole => allowedRoles.includes(userRole));
    });
  }, [requiredPermissions, state.roles]);

  // ============================================================================
  // Access Validation Effect
  // ============================================================================

  useEffect(() => {
    const validateAccess = async () => {
      try {
        // Step 1: Authentication Check
        if (requireAuth !== false && !state.isAuthenticated) {
          setAccessResult({
            level: 'denied',
            reason: 'Authentication required',
            redirect: '/login',
            showModal: true
          });
          return;
        }

        // Step 2: Initialization Check
        if (!state.isInitialized) {
          setAccessResult({
            level: 'pending',
            reason: 'Initializing authentication...'
          });
          return;
        }

        // Step 3: Loading Check
        if (state.isLoading) {
          setAccessResult({
            level: 'pending',
            reason: 'Loading user data...'
          });
          return;
        }

        // Step 4: Session Validation
        if (sessionValidation !== false && state.isAuthenticated) {
          const isSessionValid = await validateSession();
          if (!isSessionValid) {
            setAccessResult({
              level: 'expired',
              reason: 'Session expired',
              redirect: '/login',
              showModal: true
            });
            return;
          }
        }

        // Step 5: Token Validation (less frequent check)
        if (tokenValidation !== false && state.tokenTimeRemaining <= 0) {
          setAccessResult({
            level: 'expired',
            reason: 'Token expired',
            redirect: '/login',
            showModal: true
          });
          return;
        }

        // Step 6: MFA Check
        if (requireMFA && !state.security?.mfaEnabled) {
          setAccessResult({
            level: 'denied',
            reason: 'Multi-factor authentication required',
            showModal: true
          });
          return;
        }

        // Step 7: Account Lock Check
        if (state.security?.accountLocked) {
          setAccessResult({
            level: 'locked',
            reason: 'Account is locked',
            showModal: true
          });
          return;
        }

        // Step 8: Role Validation
        if (!validateRoles) {
          setAccessResult({
            level: 'denied',
            reason: `Required roles: ${requiredRoles?.join(', ')}`,
            showModal: true
          });
          return;
        }

        // Step 9: Permission Validation
        if (!validatePermissions) {
          setAccessResult({
            level: 'denied',
            reason: `Required permissions: ${requiredPermissions?.join(', ')}`,
            showModal: true
          });
          return;
        }

        // Step 10: Role Hierarchy Validation
        if (!validateRoleHierarchy) {
          setAccessResult({
            level: 'denied',
            reason: 'Insufficient role hierarchy',
            showModal: true
          });
          return;
        }

        // Step 11: Permission-Role Mapping Validation
        if (!validatePermissionRoleMapping) {
          setAccessResult({
            level: 'denied',
            reason: 'Role does not have required permissions',
            showModal: true
          });
          return;
        }

        // Step 12: Custom Validation
        if (customValidator) {
          const customResult = await customValidator(state.user);
          if (!customResult) {
            setAccessResult({
              level: 'denied',
              reason: 'Custom validation failed',
              showModal: true
            });
            return;
          }
        }

        // Step 13: All checks passed
        setAccessResult({
          level: 'granted',
          reason: 'Access granted'
        });

        // Audit logging
        if (auditAccess !== false) {
          addAuditLog('permission_check', {
            path: location.pathname,
            requiredRoles: requiredRoles,
            requiredPermissions: requiredPermissions,
            userRoles: state.roles,
            userPermissions: state.permissions,
            result: 'granted'
          });
        }

        // Success callback
        if (onAccessGranted) {
          onAccessGranted(state.user);
        }

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Access validation failed';
        setAccessResult({
          level: 'denied',
          reason: errorMessage,
          showModal: true
        });

        // Audit logging for error
        if (auditAccess !== false) {
          addAuditLog('error', {
            path: location.pathname,
            error: errorMessage,
            action: 'access_validation'
          });
        }
      }
    };

    validateAccess();
  }, [
    // Core auth state - only update when these change
    state.isAuthenticated,
    state.isInitialized,
    state.isLoading,
    
    // User roles and permissions
    state.roles,
    state.permissions,
    
    // Security state
    state.security?.mfaEnabled,
    state.security?.accountLocked,
    
    // Route-specific requirements
    requiredRoles,
    requiredPermissions,
    
    // Location
    location.pathname
  ]);

  // ============================================================================
  // Access Denied Callback
  // ============================================================================

  useEffect(() => {
    if (accessResult.level === 'denied' && onAccessDenied) {
      onAccessDenied(accessResult.reason);
    }
  }, [accessResult.level, accessResult.reason, onAccessDenied]);

  return accessResult;
};

// ============================================================================
// Loading Component
// ============================================================================

const LoadingComponent: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <CircularProgress color="inherit" />
      <Box sx={{ fontSize: '14px', opacity: 0.8 }}>{message}</Box>
    </Box>
  </Backdrop>
);

// ============================================================================
// Access Denied Component
// ============================================================================

const AccessDeniedComponent: React.FC<{ 
  reason: string; 
  level: AccessLevel;
  onRetry?: () => void;
}> = ({ reason, level, onRetry }) => {
  const getIcon = () => {
    switch (level) {
      case 'locked': return <Block color="error" sx={{ fontSize: 48 }} />;
      case 'expired': return <VpnKey color="warning" sx={{ fontSize: 48 }} />;
      default: return <Security color="error" sx={{ fontSize: 48 }} />;
    }
  };

  const getTitle = () => {
    switch (level) {
      case 'locked': return 'Account Locked';
      case 'expired': return 'Session Expired';
      default: return 'Access Denied';
    }
  };

  const getSeverity = () => {
    switch (level) {
      case 'locked': return 'error';
      case 'expired': return 'warning';
      default: return 'error';
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="50vh"
      textAlign="center"
      p={4}
    >
      <Fade in={true} timeout={800}>
        <Box>
          {getIcon()}
          <Box sx={{ mt: 2, mb: 3 }}>
            <Box sx={{ fontSize: '24px', fontWeight: 'bold', mb: 1 }}>
              {getTitle()}
            </Box>
            <Box sx={{ fontSize: '16px', color: 'text.secondary', mb: 3 }}>
              {reason}
            </Box>
          </Box>
          <Alert severity={getSeverity() as any} sx={{ mb: 2 }}>
            <Box sx={{ fontSize: '14px' }}>
              Contact your administrator if you believe this is an error.
            </Box>
          </Alert>
          {onRetry && (
            <Box sx={{ mt: 2 }}>
              <button
                onClick={onRetry}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Retry
              </button>
            </Box>
          )}
        </Box>
      </Fade>
    </Box>
  );
};

// ============================================================================
// Main Protected Route Component
// ============================================================================

const ProtectedRoute = (props: ProtectedRouteProps): React.ReactElement | null => {
  const { children, redirectTo = '/login', preserveRedirectUrl = true } = props;
  const location = useLocation();
  const accessResult = useAccessControl(props);

  // ============================================================================
  // Render Logic
  // ============================================================================

  // Show loading state
  if (accessResult.level === 'pending') {
    if (props.loadingFallback) {
      return <>{props.loadingFallback}</>;
    }
    
    if (props.showLoading !== false) {
      return <LoadingComponent message={accessResult.reason} />;
    }
    
    return null;
  }

  // Handle redirection
  if (accessResult.level === 'denied' || accessResult.level === 'expired') {
    if (accessResult.redirect) {
      const redirectUrl = preserveRedirectUrl 
        ? `${accessResult.redirect}?redirect=${encodeURIComponent(location.pathname + location.search)}`
        : accessResult.redirect;
      
      return <Navigate to={redirectUrl} replace />;
    }
    
    if (redirectTo) {
      const redirectUrl = preserveRedirectUrl 
        ? `${redirectTo}?redirect=${encodeURIComponent(location.pathname + location.search)}`
        : redirectTo;
      
      return <Navigate to={redirectUrl} replace />;
    }
  }

  // Show access denied
  if (accessResult.level === 'denied' || accessResult.level === 'expired' || accessResult.level === 'locked') {
    if (props.unauthorizedFallback) {
      return <>{props.unauthorizedFallback}</>;
    }
    
    if (props.showAccessDenied !== false) {
      return (
        <AccessDeniedComponent 
          reason={accessResult.reason} 
          level={accessResult.level}
          onRetry={() => window.location.reload()}
        />
      );
    }
    
    return null;
  }

  // Access granted - render children
  if (accessResult.level === 'granted') {
    return <>{children}</>;
  }

  // Fallback
  return props.fallback ? <>{props.fallback}</> : null;
};

// ============================================================================
// Role-Based Route Component
// ============================================================================

export const RoleBasedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}> = ({ children, allowedRoles, requireAll = false, fallback }) => {
  return (
    <ProtectedRoute
      requiredRoles={allowedRoles}
      requireAllRoles={requireAll}
      fallback={fallback}
    >
      {children}
    </ProtectedRoute>
  );
};

// ============================================================================
// Permission-Based Route Component
// ============================================================================

export const PermissionBasedRoute: React.FC<{
  children: React.ReactNode;
  allowedPermissions: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}> = ({ children, allowedPermissions, requireAll = false, fallback }) => {
  return (
    <ProtectedRoute
      requiredPermissions={allowedPermissions}
      requireAllPermissions={requireAll}
      fallback={fallback}
    >
      {children}
    </ProtectedRoute>
  );
};

// ============================================================================
// Admin Route Component
// ============================================================================

export const AdminRoute: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => {
  return (
    <ProtectedRoute
      requiredRoles={['ADMIN']}
      fallback={fallback}
    >
      {children}
    </ProtectedRoute>
  );
};

// ============================================================================
// Veterinarian Route Component
// ============================================================================

export const VeterinarianRoute: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => {
  return (
    <ProtectedRoute
      requiredRoles={['ADMIN', 'VETERINER']}
      fallback={fallback}
    >
      {children}
    </ProtectedRoute>
  );
};

export default ProtectedRoute; 