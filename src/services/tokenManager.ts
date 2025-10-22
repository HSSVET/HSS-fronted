interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  tokenType: string;
}

interface UserInfo {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

class TokenManager {
  private static instance: TokenManager;
  private readonly ACCESS_TOKEN_KEY = 'hss_access_token';
  private readonly REFRESH_TOKEN_KEY = 'hss_refresh_token';
  private readonly TOKEN_EXPIRY_KEY = 'hss_token_expiry';
  private readonly USER_INFO_KEY = 'hss_user_info';

  private constructor() {}

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  // Token Storage Methods
  setTokens(tokenData: TokenData): void {
    try {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, tokenData.accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, tokenData.refreshToken);
      localStorage.setItem(this.TOKEN_EXPIRY_KEY, tokenData.expiresAt.toString());
    } catch (error) {
      console.error('Failed to store tokens:', error);
    }
  }

  getAccessToken(): string | null {
    try {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to get access token:', error);
      return null;
    }
  }

  getRefreshToken(): string | null {
    try {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to get refresh token:', error);
      return null;
    }
  }

  getTokenExpiry(): number | null {
    try {
      const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
      return expiry ? parseInt(expiry, 10) : null;
    } catch (error) {
      console.error('Failed to get token expiry:', error);
      return null;
    }
  }

  isTokenExpired(): boolean {
    const expiry = this.getTokenExpiry();
    if (!expiry) return true;
    
    // Add 5 minute buffer before actual expiry
    const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    return Date.now() >= (expiry - bufferTime);
  }

  isTokenValid(): boolean {
    const token = this.getAccessToken();
    return token !== null && !this.isTokenExpired();
  }

  // User Info Methods
  setUserInfo(userInfo: UserInfo): void {
    try {
      localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(userInfo));
    } catch (error) {
      console.error('Failed to store user info:', error);
    }
  }

  getUserInfo(): UserInfo | null {
    try {
      const userInfo = localStorage.getItem(this.USER_INFO_KEY);
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error('Failed to get user info:', error);
      return null;
    }
  }

  // Clear Methods
  clearTokens(): void {
    try {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }

  clearUserInfo(): void {
    try {
      localStorage.removeItem(this.USER_INFO_KEY);
    } catch (error) {
      console.error('Failed to clear user info:', error);
    }
  }

  clearAll(): void {
    this.clearTokens();
    this.clearUserInfo();
  }

  // Token Refresh Logic
  async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      console.warn('No refresh token available');
      return null;
    }

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error(`Refresh failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.accessToken) {
        const tokenData: TokenData = {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken || refreshToken,
          expiresAt: data.expiresAt || (Date.now() + 3600000), // Default 1 hour
          tokenType: data.tokenType || 'Bearer',
        };
        
        this.setTokens(tokenData);
        return data.accessToken;
      }

      return null;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokens();
      return null;
    }
  }

  // Get Authorization Header
  getAuthHeader(): string | null {
    const token = this.getAccessToken();
    const tokenType = 'Bearer'; // Default token type
    
    if (!token) return null;
    
    return `${tokenType} ${token}`;
  }
}

export default TokenManager;
export type { TokenData, UserInfo };