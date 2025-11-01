/**
 * Google Cloud Identity Platform REST API Service
 * Firebase SDK kullanmadan direkt GCP Identity Platform API çağrıları
 */

import { IDENTITY_PLATFORM_ENDPOINTS } from '../config/identity-platform';

export interface SignInRequest {
    email: string;
    password: string;
    returnSecureToken: boolean;
}

export interface SignInResponse {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    displayName?: string;
    registered?: boolean;
}

export interface SignUpRequest {
    email: string;
    password: string;
    returnSecureToken: boolean;
}

export interface RefreshTokenRequest {
    grant_type: string;
    refresh_token: string;
}

export interface RefreshTokenResponse {
    id_token: string;
    refresh_token: string;
    expires_in: string;
    token_type: string;
    user_id: string;
    project_id: string;
}

export interface AccountInfo {
    localId: string;
    email: string;
    emailVerified: boolean;
    displayName?: string;
    photoUrl?: string;
    passwordHash?: string;
    providerUserInfo?: Array<{
        providerId: string;
        federatedId?: string;
        email?: string;
        rawId?: string;
    }>;
    validSince?: string;
    disabled?: boolean;
    lastLoginAt?: string;
    createdAt?: string;
    customAttributes?: string;
}

export interface AccountInfoResponse {
    users: AccountInfo[];
}

class IdentityPlatformService {
    /**
     * Email/password ile giriş
     */
    async signInWithPassword(email: string, password: string): Promise<SignInResponse> {
        const response = await fetch(IDENTITY_PLATFORM_ENDPOINTS.signIn, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
                returnSecureToken: true,
            } as SignInRequest),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Sign in failed');
        }

        return response.json();
    }

    /**
     * Yeni kullanıcı kaydı
     */
    async signUp(email: string, password: string): Promise<SignInResponse> {
        const response = await fetch(IDENTITY_PLATFORM_ENDPOINTS.signUp, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
                returnSecureToken: true,
            } as SignUpRequest),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Sign up failed');
        }

        return response.json();
    }

    /**
     * ID token'ı yenile
     */
    async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
        const response = await fetch(IDENTITY_PLATFORM_ENDPOINTS.refreshToken, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error_description || 'Token refresh failed');
        }

        return response.json();
    }

    /**
     * Kullanıcı bilgilerini al (ID token ile)
     */
    async getAccountInfo(idToken: string): Promise<AccountInfoResponse> {
        const response = await fetch(IDENTITY_PLATFORM_ENDPOINTS.getAccountInfo, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idToken,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to get account info');
        }

        return response.json();
    }

    /**
     * ID token'dan custom claims'i decode et
     */
    decodeIdToken(idToken: string): {
        uid: string;
        email?: string;
        email_verified?: boolean;
        name?: string;
        picture?: string;
        role?: string;
        exp?: number;
        iat?: number;
        [key: string]: any;
    } {
        try {
            const payload = JSON.parse(atob(idToken.split('.')[1]));
            return payload;
        } catch (error) {
            throw new Error('Invalid ID token');
        }
    }

    /**
     * Token'ın geçerliliğini kontrol et
     */
    isTokenExpired(idToken: string): boolean {
        try {
            const payload = this.decodeIdToken(idToken);
            if (!payload.exp) return true;
            // 5 dakika buffer
            const bufferTime = 5 * 60 * 1000;
            return Date.now() >= (payload.exp * 1000 - bufferTime);
        } catch {
            return true;
        }
    }

    /**
     * Token'ın kalan süresini saniye olarak döndür
     */
    getTokenTimeRemaining(idToken: string): number {
        try {
            const payload = this.decodeIdToken(idToken);
            if (!payload.exp) return 0;
            return Math.max(0, Math.floor((payload.exp * 1000 - Date.now()) / 1000));
        } catch {
            return 0;
        }
    }
}

export const identityPlatformService = new IdentityPlatformService();
export default identityPlatformService;


