/**
 * Subdomain utility functions for multi-tenant routing
 * Handles detection and validation of subdomains for admin vs customer portals
 */

export type SubdomainType = 'admin' | 'customer' | 'local';

export interface SubdomainInfo {
  type: SubdomainType;
  isAdmin: boolean;
  isCustomer: boolean;
  hostname: string;
  subdomain: string | null;
}

/**
 * Get the current subdomain from window.location
 */
export const getCurrentSubdomain = (): string | null => {
  if (typeof window === 'undefined') return null;

  const hostname = window.location.hostname;

  // Handle localhost development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return null;
  }

  // Handle admin.localhost for local development
  if (hostname === 'admin.localhost') {
    return 'admin';
  }

  // Handle app.localhost for local development
  if (hostname === 'app.localhost') {
    return 'app';
  }

  // Split hostname and get subdomain
  const parts = hostname.split('.');

  // If only domain.com (2 parts), no subdomain
  if (parts.length <= 2) {
    return null;
  }

  // Return the first part as subdomain (e.g., 'admin' from 'admin.hssvet.com')
  return parts[0];
};

/**
 * Determine the subdomain type and context
 */
export const getSubdomainInfo = (): SubdomainInfo => {
  const hostname = window.location.hostname;
  const subdomain = getCurrentSubdomain();

  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return {
      type: 'local',
      isAdmin: false,
      isCustomer: true,
      hostname,
      subdomain: null,
    };
  }

  // Admin subdomain (admin.hssvet.com or admin.localhost)
  if (subdomain === 'admin') {
    return {
      type: 'admin',
      isAdmin: true,
      isCustomer: false,
      hostname,
      subdomain: 'admin',
    };
  }

  // Customer portal (hssvet.com, app.hssvet.com, or app.localhost)
  return {
    type: 'customer',
    isAdmin: false,
    isCustomer: true,
    hostname,
    subdomain,
  };
};

/**
 * Check if current context is admin portal
 */
export const isAdminPortal = (): boolean => {
  return getSubdomainInfo().isAdmin;
};

/**
 * Check if current context is customer portal
 */
export const isCustomerPortal = (): boolean => {
  return getSubdomainInfo().isCustomer;
};

/**
 * Get the admin portal URL
 */
export const getAdminPortalUrl = (): string => {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  const port = window.location.port;

  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // TEMPORARY: Revert to normal localhost
    return `${protocol}//localhost${port ? `:${port}` : ''}`;
  }

  // Production
  const baseDomain = hostname.split('.').slice(-2).join('.');
  return `${protocol}//admin.${baseDomain}`;
};

/**
 * Get the customer portal URL
 */
export const getCustomerPortalUrl = (): string => {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  const port = window.location.port;

  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//localhost${port ? `:${port}` : ''}`;
  }

  // Production - use base domain without subdomain
  const parts = hostname.split('.');
  const baseDomain = parts.slice(-2).join('.');
  return `${protocol}//${baseDomain}`;
};

/**
 * Redirect to admin portal
 */
export const redirectToAdminPortal = (path: string = '/login'): void => {
  const adminUrl = getAdminPortalUrl();
  window.location.href = `${adminUrl}${path}`;
};

/**
 * Redirect to customer portal
 */
export const redirectToCustomerPortal = (path: string = '/login'): void => {
  const customerUrl = getCustomerPortalUrl();
  window.location.href = `${customerUrl}${path}`;
};

/**
 * Validate if user role matches current subdomain context
 */
export const validateUserSubdomainAccess = (userRoles: string[]): {
  isValid: boolean;
  shouldRedirect: boolean;
  redirectUrl?: string;
} => {
  const subdomainInfo = getSubdomainInfo();
  const isSuperAdmin = userRoles.includes('SUPER_ADMIN');

  // Super admin should only access admin portal
  if (isSuperAdmin) {
    // TEMPORARY: Allow access on localhost for development without subdomain
    if (subdomainInfo.isAdmin || subdomainInfo.type === 'local') {
      return { isValid: true, shouldRedirect: false };
    }
    return {
      isValid: false,
      shouldRedirect: true,
      redirectUrl: getAdminPortalUrl() + '/super-admin/clinics',
    };
  }

  // Regular users (OWNER, STAFF) should not access admin portal
  if (subdomainInfo.isAdmin) {
    return {
      isValid: false,
      shouldRedirect: true,
      redirectUrl: getCustomerPortalUrl() + '/login',
    };
  }

  // Regular users on customer portal is valid
  return { isValid: true, shouldRedirect: false };
};
