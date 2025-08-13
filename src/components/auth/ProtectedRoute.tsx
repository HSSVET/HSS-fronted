import React, { useEffect, useState, useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, CircularProgress, Backdrop } from '@mui/material';
import AccessDenied from '../common/AccessDenied';

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
  'sms:read': ['ADMIN', 'VETERINER', 'SEKRETER'],
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
    sessionValidation,
    customValidator,
    onAccessGranted,
    onAccessDenied
  } = props;

  const { state } = useAuth();
  const location = useLocation();

  const [accessResult, setAccessResult] = useState<AccessResult>({
    level: 'pending',
    reason: 'Checking access...'
  });

  // ============================================================================
  // Role Validation
  // ============================================================================

  const validateRoles = useMemo(() => {
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const userRoles = state.roles || [];

    if (requireAllRoles) {
      // User must have ALL required roles
      return requiredRoles.every(role => userRoles.includes(role));
    } else {
      // User must have AT LEAST ONE of the required roles
      return requiredRoles.some(role => userRoles.includes(role));
    }
  }, [requiredRoles, requireAllRoles, state.roles]);

  // ============================================================================
  // Permission Validation
  // ============================================================================

  const validatePermissions = useMemo(() => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;

    const userRoles = state.roles || [];

    if (requireAllPermissions) {
      // User must have ALL required permissions
      return requiredPermissions.every(permission => {
        const allowedRoles = PERMISSION_MAPPINGS[permission as keyof typeof PERMISSION_MAPPINGS] || [];
        return userRoles.some(userRole => allowedRoles.includes(userRole));
      });
    } else {
      // User must have AT LEAST ONE of the required permissions
      return requiredPermissions.some(permission => {
        const allowedRoles = PERMISSION_MAPPINGS[permission as keyof typeof PERMISSION_MAPPINGS] || [];
        return userRoles.some(userRole => allowedRoles.includes(userRole));
      });
    }
  }, [requiredPermissions, requireAllPermissions, state.roles]);

  // ============================================================================
  // Access Validation Effect
  // ============================================================================

  useEffect(() => {
    const validateAccess = async () => {
      try {
        // Step 0: Firebase Auth token check (if tokenValidation is enabled)
        if (props.tokenValidation !== false) {
          const token = localStorage.getItem('hss_id_token');
          if (!token && requireAuth !== false) {
            setAccessResult({
              level: 'denied',
              reason: 'Authentication token not found',
              redirect: '/login',
              showModal: true
            });
            return;
          }
        }

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

        // Step 4: Role Validation
        if (!validateRoles) {
          setAccessResult({
            level: 'denied',
            reason: `Required roles: ${requiredRoles?.join(', ')}. Your roles: ${state.roles?.join(', ') || 'None'}`,
            showModal: true
          });
          if (onAccessDenied) {
            onAccessDenied(`Missing required roles: ${requiredRoles?.join(', ')}`);
          }
          return;
        }

        // Step 5: Permission Validation
        if (!validatePermissions) {
          setAccessResult({
            level: 'denied',
            reason: `Required permissions: ${requiredPermissions?.join(', ')}. Your roles: ${state.roles?.join(', ') || 'None'}`,
            showModal: true
          });
          if (onAccessDenied) {
            onAccessDenied(`Missing required permissions: ${requiredPermissions?.join(', ')}`);
          }
          return;
        }

        // Step 6: Custom Validation
        if (customValidator) {
          const customResult = await customValidator(state.user);
          if (!customResult) {
            setAccessResult({
              level: 'denied',
              reason: 'Custom validation failed',
              showModal: true
            });
            if (onAccessDenied) {
              onAccessDenied('Custom validation failed');
            }
            return;
          }
        }

        // Step 7: All checks passed
        setAccessResult({
          level: 'granted',
          reason: 'Access granted'
        });

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
      }
    };

    validateAccess();
  }, [
    // Core auth state
    state.isAuthenticated,
    state.isInitialized,
    state.isLoading,

    // User roles
    state.roles,

    // Route requirements
    requiredRoles,
    requiredPermissions,

    // Validation flags
    validateRoles,
    validatePermissions,

    // Location
    location.pathname
  ]);

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
      // Determine required roles/permissions from context
      const requiredRoleText = props.requiredRoles?.join(', ') || 'Belirtilmemiş';
      const requiredPermissionText = props.requiredPermissions?.join(', ') || 'Belirtilmemiş';

      return (
        <AccessDenied
          message={accessResult.reason}
          requiredRole={props.requiredRoles?.length ? requiredRoleText : undefined}
          requiredPermission={props.requiredPermissions?.length ? requiredPermissionText : undefined}
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