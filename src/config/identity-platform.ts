/**
 * Google Cloud Identity Platform Configuration
 * Direkt GCP Identity Platform REST API kullanımı için
 */

export interface IdentityPlatformConfig {
    apiKey: string;
    projectId: string;
    authDomain?: string;
}

// Environment variables'dan config al
const config: IdentityPlatformConfig = {
    apiKey: process.env.REACT_APP_GCP_IDENTITY_PLATFORM_API_KEY || '',
    projectId: process.env.REACT_APP_GCP_PROJECT_ID || '',
    authDomain: process.env.REACT_APP_GCP_AUTH_DOMAIN || `${process.env.REACT_APP_GCP_PROJECT_ID}.web.app`,
};

// Identity Platform REST API base URL
export const IDENTITY_PLATFORM_API_BASE = `https://identitytoolkit.googleapis.com/v1/projects/${config.projectId}`;

// Identity Platform endpoints
export const IDENTITY_PLATFORM_ENDPOINTS = {
    signUp: `${IDENTITY_PLATFORM_API_BASE}/accounts:signUp?key=${config.apiKey}`,
    signIn: `${IDENTITY_PLATFORM_API_BASE}/accounts:signInWithPassword?key=${config.apiKey}`,
    signOut: `${IDENTITY_PLATFORM_API_BASE}/accounts:signOut?key=${config.apiKey}`,
    refreshToken: `https://securetoken.google.com/${config.projectId}/token?key=${config.apiKey}`,
    getAccountInfo: `${IDENTITY_PLATFORM_API_BASE}/accounts:lookup?key=${config.apiKey}`,
    sendPasswordReset: `${IDENTITY_PLATFORM_API_BASE}/accounts:sendOobCode?key=${config.apiKey}`,
    verifyEmail: `${IDENTITY_PLATFORM_API_BASE}/accounts:sendOobCode?key=${config.apiKey}`,
};

export default config;


