import { useAuth } from '../context/MockAuthContext';

// Mock permissions hook that always returns true for offline mode
export const usePermissions = () => {
  const { permissions, roles } = useAuth();

  const hasPermission = (permission: string): boolean => {
    // In offline mode, allow all permissions
    return permissions.includes(permission);
  };

  const hasRole = (role: string): boolean => {
    return roles.includes(role);
  };

  const hasAnyRole = (requiredRoles: string[]): boolean => {
    return requiredRoles.some(role => roles.includes(role));
  };

  const hasAllRoles = (requiredRoles: string[]): boolean => {
    return requiredRoles.every(role => roles.includes(role));
  };

  const hasAnyPermission = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.some(permission => permissions.includes(permission));
  };

  const hasAllPermissions = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.every(permission => permissions.includes(permission));
  };

  return {
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    hasAnyPermission,
    hasAllPermissions,
    permissions,
    roles
  };
};

export default usePermissions;