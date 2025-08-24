import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

// Permission mapping sistemi ProtectedRoute'tan alınmıştır
// Keycloak'tan gelen rollerle eşleşecek şekilde düzenlendi
const PERMISSION_MAPPINGS = {
  'animals:read': ['ADMIN', 'ADMİN', 'VETERINER', 'veteriner', 'SEKRETER', 'sekreter', 'TEKNISYEN', 'Teknisyen'],
  'animals:write': ['ADMIN', 'ADMİN', 'VETERINER', 'veteriner', 'SEKRETER', 'sekreter'],
  'animals:delete': ['ADMIN', 'ADMİN', 'VETERINER', 'veteriner'],
  'appointments:read': ['ADMIN', 'ADMİN', 'VETERINER', 'veteriner', 'SEKRETER', 'sekreter'],
  'appointments:write': ['ADMIN', 'ADMİN', 'VETERINER', 'veteriner', 'SEKRETER', 'sekreter'],
  'appointments:delete': ['ADMIN', 'ADMİN', 'VETERINER', 'veteriner'],
  'laboratory:read': ['ADMIN', 'ADMİN', 'VETERINER', 'veteriner', 'TEKNISYEN', 'Teknisyen'],
  'laboratory:write': ['ADMIN', 'ADMİN', 'VETERINER', 'veteriner', 'TEKNISYEN', 'Teknisyen'],
  'laboratory:delete': ['ADMIN', 'ADMİN', 'VETERINER', 'veteriner'],
  'billing:read': ['ADMIN', 'ADMİN', 'VETERINER', 'veteriner', 'SEKRETER', 'sekreter'],
  'billing:write': ['ADMIN', 'ADMİN', 'SEKRETER', 'sekreter'],
  'billing:delete': ['ADMIN', 'ADMİN'],
  'reports:read': ['ADMIN', 'ADMİN', 'VETERINER', 'veteriner'],
  'reports:write': ['ADMIN', 'ADMİN'],
  'settings:read': ['ADMIN', 'ADMİN'],
  'settings:write': ['ADMIN', 'ADMİN'],
  'users:read': ['ADMIN', 'ADMİN'],
  'users:write': ['ADMIN', 'ADMİN'],
  'audit:read': ['ADMIN', 'ADMİN'],
  'dashboard:read': ['ADMIN', 'ADMİN', 'VETERINER', 'veteriner', 'SEKRETER', 'sekreter', 'TEKNISYEN', 'Teknisyen'], // Dashboard herkes erişebilir
  'inventory:read': ['ADMIN', 'ADMİN', 'VETERINER', 'veteriner', 'SEKRETER', 'sekreter'], // Envanter için eklendi
};

export const usePermissions = () => {
  const { user, roles, permissions } = useAuth();

  // Kullanıcının belirli bir yetkiye sahip olup olmadığını kontrol et
  const hasPermission = useMemo(() => {
    return (permission: string): boolean => {
      if (!user || !roles || roles.length === 0) {
        return false;
      }

      // ADMIN her şeye erişebilir (hem İngilizce hem Türkçe)
      if (roles.includes('ADMIN') || roles.includes('ADMİN')) {
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

      // ADMIN/ADMİN için özel kontrol
      if (role === 'ADMİN') {
        return roles.includes('ADMIN') || roles.includes('ADMİN');
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
    isVeterinarian: hasRole('VETERINER') || hasRole('veteriner'),
    isSecretary: hasRole('SEKRETER') || hasRole('sekreter'),
    isTechnician: hasRole('TEKNISYEN') || hasRole('Teknisyen'),
  };
};

export default usePermissions; 