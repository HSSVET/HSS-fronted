import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

// Permission mapping sistemi ProtectedRoute'tan alınmıştır
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
  'dashboard:read': ['ADMIN', 'VETERINER', 'SEKRETER', 'TEKNISYEN'], // Dashboard herkes erişebilir
  'inventory:read': ['ADMIN', 'VETERINER', 'SEKRETER'], // Envanter için eklendi
  'sms:read': ['ADMIN', 'VETERINER', 'SEKRETER'],
};

export const usePermissions = () => {
  const { user, roles, permissions } = useAuth();

  // Kullanıcının belirli bir yetkiye sahip olup olmadığını kontrol et
  const hasPermission = useMemo(() => {
    return (permission: string): boolean => {
      if (!user || !roles || roles.length === 0) {
        return false;
      }

      // ADMIN her şeye erişebilir
      if (roles.includes('ADMIN')) {
        return true;
      }

      // Permission mapping kontrolü
      const allowedRoles = PERMISSION_MAPPINGS[permission as keyof typeof PERMISSION_MAPPINGS];
      if (!allowedRoles) {
        return false;
      }

      // Kullanıcının rollerinden en az biri gerekli roller arasında var mı?
      return roles.some((role: string) => allowedRoles.includes(role));
    };
  }, [user, roles, permissions]);

  // Kullanıcının belirli bir role sahip olup olmadığını kontrol et
  const hasRole = useMemo(() => {
    return (role: string): boolean => {
      if (!user || !roles || roles.length === 0) {
        return false;
      }
      return roles.includes(role);
    };
  }, [user, roles]);

  // Kullanıcının birden fazla rolden en az birine sahip olup olmadığını kontrol et
  const hasAnyRole = useMemo(() => {
    return (roleList: string[]): boolean => {
      if (!user || !roles || roles.length === 0) {
        return false;
      }
      return roleList.some((role: string) => roles.includes(role));
    };
  }, [user, roles]);

  // Kullanıcının tüm rollere sahip olup olmadığını kontrol et
  const hasAllRoles = useMemo(() => {
    return (roleList: string[]): boolean => {
      if (!user || !roles || roles.length === 0) {
        return false;
      }
      return roleList.every((role: string) => roles.includes(role));
    };
  }, [user, roles]);

  return {
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    userRoles: roles || [],
    userPermissions: permissions || [],
    isAdmin: hasRole('ADMIN'),
    isVeterinarian: hasRole('VETERINER'),
    isSecretary: hasRole('SEKRETER'),
    isTechnician: hasRole('TEKNISYEN'),
  };
};

export default usePermissions; 