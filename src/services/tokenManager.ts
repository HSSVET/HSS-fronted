// @ts-ignore
import Keycloak from 'keycloak-js';

export class TokenManager {
  private keycloak: any;
  private refreshTimer: NodeJS.Timeout | null = null;
  private onTokenExpired?: () => void;
  private isRefreshing: boolean = false; // Token yenileme durumunu takip et

  constructor(keycloak: any) {
    this.keycloak = keycloak;
    this.setupTokenRefresh();
  }

  /**
   * Token yenileme sistemini başlat
   */
  private setupTokenRefresh() {
    if (!this.keycloak || !this.keycloak.authenticated) {
      return;
    }

    // Token süresini kontrol et
    this.scheduleTokenRefresh();

    // Keycloak olaylarını dinle
    this.keycloak.onTokenExpired = () => {
      if (!this.isRefreshing) {
        console.log('Token expired, attempting to refresh...');
        this.refreshToken();
      }
    };

    this.keycloak.onAuthRefreshSuccess = () => {
      console.log('Token refreshed successfully');
      this.isRefreshing = false;
      this.scheduleTokenRefresh();
    };

    this.keycloak.onAuthRefreshError = () => {
      console.error('Token refresh failed');
      this.isRefreshing = false;
      if (this.onTokenExpired) {
        this.onTokenExpired();
      }
    };
  }

  /**
   * Token yenileme zamanlaması
   */
  private scheduleTokenRefresh() {
    if (!this.keycloak?.tokenParsed?.exp) {
      return;
    }

    // Clear existing timer
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }

    // Token'ın son kullanma süresi
    const tokenExpiration = this.keycloak.tokenParsed.exp * 1000;
    const now = Date.now();
    const timeUntilExpiry = tokenExpiration - now;

    // Token'ı 60 saniye önceden yenile (daha güvenli)
    const refreshTime = Math.max(timeUntilExpiry - 60000, 10000);

    // Sadece debug modunda log yaz
    if (process.env.NODE_ENV === 'development') {
      console.log(`Token will be refreshed in ${Math.round(refreshTime / 1000)} seconds`);
    }

    this.refreshTimer = setTimeout(() => {
      this.refreshToken();
    }, refreshTime);
  }

  /**
   * Token'ı manuel olarak yenile
   */
  public async refreshToken(): Promise<boolean> {
    if (this.isRefreshing) {
      return false; // Zaten yenileme devam ediyor
    }

    this.isRefreshing = true;
    
    try {
      const refreshed = await this.keycloak.updateToken(60); // 60 saniye threshold
      if (refreshed) {
        console.log('Token was successfully refreshed');
        this.scheduleTokenRefresh();
        return true;
      } else {
        console.log('Token is still valid');
        this.isRefreshing = false;
        return true;
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      this.isRefreshing = false;
      if (this.onTokenExpired) {
        this.onTokenExpired();
      }
      return false;
    }
  }

  /**
   * Token süresini kontrol et
   */
  public isTokenExpired(): boolean {
    if (!this.keycloak?.tokenParsed?.exp) {
      return true;
    }

    const tokenExpiration = this.keycloak.tokenParsed.exp * 1000;
    const now = Date.now();
    return now >= tokenExpiration;
  }

  /**
   * Token süresini al (saniye cinsinden)
   */
  public getTokenTimeRemaining(): number {
    if (!this.keycloak?.tokenParsed?.exp) {
      return 0;
    }

    const tokenExpiration = this.keycloak.tokenParsed.exp * 1000;
    const now = Date.now();
    return Math.max(0, Math.floor((tokenExpiration - now) / 1000));
  }

  /**
   * Token süresinin dolması durumunda çağrılacak callback
   */
  public onTokenExpiration(callback: () => void) {
    this.onTokenExpired = callback;
  }

  /**
   * Token bilgilerini al
   */
  public getTokenInfo() {
    if (!this.keycloak?.tokenParsed) {
      return null;
    }

    return {
      username: this.keycloak.tokenParsed.preferred_username,
      email: this.keycloak.tokenParsed.email,
      firstName: this.keycloak.tokenParsed.given_name,
      lastName: this.keycloak.tokenParsed.family_name,
      roles: this.keycloak.tokenParsed.realm_access?.roles || [],
      exp: this.keycloak.tokenParsed.exp,
      iat: this.keycloak.tokenParsed.iat,
      timeRemaining: this.getTokenTimeRemaining()
    };
  }

  /**
   * Temizleme işlemi
   */
  public cleanup() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /**
   * Güvenli token alma - kullanmadan önce geçerliliğini kontrol et
   */
  public async getValidToken(): Promise<string | null> {
    if (!this.keycloak || !this.keycloak.authenticated) {
      return null;
    }

    // Token geçerli mi kontrol et, gerekirse yenile
    try {
      await this.keycloak.updateToken(30);
      return this.keycloak.token;
    } catch (error) {
      console.error('Failed to get valid token:', error);
      return null;
    }
  }
}

export default TokenManager; 