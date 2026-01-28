import { OFFLINE_MODE } from '../config/offline';
import type { ApiResponse } from '../types/common';
import TokenManager from './tokenManager';
import { apiCache } from './apiCache';

// Base API URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8090';
console.log('API Base URL:', API_BASE_URL);
console.log('OFFLINE_MODE:', OFFLINE_MODE);

// Request/Response Interceptor Types
export interface RequestInterceptor {
  onFulfilled?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
  onRejected?: (error: any) => any;
}

export interface ResponseInterceptor {
  onFulfilled?: (response: Response) => Response | Promise<Response>;
  onRejected?: (error: any) => any;
}

export interface RequestConfig {
  url: string;
  method: string;
  headers: HeadersInit;
  body?: any;
  timeout?: number;
}

// Enhanced API client with authentication and interceptors
export class ApiClient {
  private tokenManager: TokenManager;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private isRefreshing = false;
  private refreshPromise: Promise<string | null> | null = null;
  private defaultMaxRetries = 3;
  private defaultRetryDelay = 1000;
  private tokenFetchPromise: Promise<void> | null = null;
  private useCache: boolean = true;

  constructor(useCache: boolean = true) {
    this.tokenManager = TokenManager.getInstance();
    this.useCache = useCache;
    this.setupDefaultInterceptors();

    // Cleanup expired cache entries every 5 minutes
    setInterval(() => {
      apiCache.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Enable or disable caching
   */
  setCacheEnabled(enabled: boolean): void {
    this.useCache = enabled;
  }

  /**
   * Clear cache for specific endpoint
   */
  clearCache(endpoint: string): void {
    apiCache.clearPattern(endpoint);
  }

  /**
   * Clear all cache
   */
  clearAllCache(): void {
    apiCache.clearAll();
  }

  // Interceptor Management
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  private setupDefaultInterceptors(): void {
    // Request interceptor for authentication
    this.addRequestInterceptor({
      onFulfilled: async (config) => {
        // Try to get Identity Platform ID token first (async)
        try {
          const idToken = await this.tokenManager.getIdentityPlatformIdToken();
          if (idToken) {
            config.headers = {
              ...config.headers,
              'Authorization': `Bearer ${idToken}`,
            };
            return config;
          }
        } catch (error) {
          // Fallback to regular token
        }

        // Token geçersizse veya yoksa yeniden al
        if (!this.tokenManager.isTokenValid()) {
          try {
            await this.ensureToken();
          } catch (error) {
            console.warn('⚠️ Token yenileme başarısız:', error);
          }
        }

        // Fallback to stored token
        const authHeader = this.tokenManager.getAuthHeader();
        if (authHeader) {
          config.headers = {
            ...config.headers,
            'Authorization': authHeader,
          };
        } else {
          console.warn('⚠️ Authorization header eklenemedi - token yok');
        }
        return config;
      },
    });

    // Response interceptor for token refresh
    this.addResponseInterceptor({
      onFulfilled: (response) => response,
      onRejected: async (error) => {
        // error bir Response objesi, status kontrolü yapabiliriz
        if (error && typeof error === 'object' && 'status' in error && (error as any).status === 401 && !this.isRefreshing) {
          // Refresh token varsa token yenilemeyi dene
          const refreshToken = this.tokenManager.getRefreshToken();
          if (refreshToken) {
            try {
              return await this.handleTokenRefresh(error);
            } catch (refreshError) {
              // Refresh başarısız oldu, hatayı döndür
              return error;
            }
          }
          // Refresh token yoksa, hatayı normal şekilde döndür (yönlendirme yapma)
          return error;
        }
        throw error;
      },
    });
  }

  private async handleTokenRefresh(originalError: any): Promise<any> {
    if (this.isRefreshing && this.refreshPromise) {
      await this.refreshPromise;
      // Retry original request
      return this.retryRequest(originalError);
    }

    this.isRefreshing = true;
    this.refreshPromise = this.tokenManager.refreshAccessToken();

    try {
      const newToken = await this.refreshPromise;
      if (newToken) {
        // Retry original request with new token
        return this.retryRequest(originalError);
      } else {
        // Refresh failed, redirect to login only if we have a refresh token attempt
        // Eğer refresh token yoksa, sadece hatayı döndür (yönlendirme yapma)
        const refreshToken = this.tokenManager.getRefreshToken();
        if (refreshToken) {
          // Refresh token var ama refresh başarısız, o zaman yönlendir
          this.handleAuthFailure();
        }
        // Refresh token yoksa sadece hatayı fırlat, yönlendirme yapma
        throw originalError;
      }
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async retryRequest(originalError: any): Promise<any> {
    // This would need to be implemented based on your specific retry logic
    // For now, we'll just rethrow the original error
    throw originalError;
  }

  private async executeWithRetry<T>(
    requestFn: () => Promise<Response>,
    retries: number = this.defaultMaxRetries,
    delay: number = this.defaultRetryDelay
  ): Promise<Response> {
    let lastError: any;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await requestFn();
        // 401 hatası için retry yapma
        if (response.status === 401) {
          const refreshToken = this.tokenManager.getRefreshToken();
          if (!refreshToken) {
            // Refresh token yoksa direkt response'u döndür, retry yapma
            return response;
          }
        }
        return response;
      } catch (error: any) {
        lastError = error;

        // Don't retry on 4xx errors (client errors)
        if (error.status >= 400 && error.status < 500) {
          throw error;
        }

        // Don't retry on last attempt
        if (attempt === retries) {
          throw error;
        }

        // Exponential backoff
        const waitTime = delay * Math.pow(2, attempt);
        console.log(`Retrying request (attempt ${attempt + 1}/${retries + 1}) after ${waitTime}ms`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    throw lastError;
  }

  private handleAuthFailure(): void {
    this.tokenManager.clearAll();
    // Redirect to login page or trigger auth context logout
    // Sadece login sayfasında değilsek yönlendir
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }

  private async ensureToken(): Promise<void> {
    // Token yoksa veya geçersizse test token al
    const token = this.tokenManager.getAccessToken();
    const isTokenValid = this.tokenManager.isTokenValid();

    if (!token || !isTokenValid) {
      // Eğer zaten token alınıyorsa, o promise'i bekle
      if (this.tokenFetchPromise) {
        await this.tokenFetchPromise;
        // Token alındıktan sonra tekrar kontrol et
        const newToken = this.tokenManager.getAccessToken();
        if (!newToken) {
          throw new Error('Token alınamadı. Lütfen tekrar deneyin.');
        }
        return;
      }

      // Yeni token alımı başlat
      this.tokenFetchPromise = (async () => {
        try {
          console.log('🔑 Token bulunamadı veya geçersiz, test token alınıyor...');
          const response = await fetch(`${API_BASE_URL}/api/public/test-token`);

          if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Test token alınamadı:', response.status, errorText);
            throw new Error(`Test token alınamadı: ${response.status} ${response.statusText}`);
          }

          const data = await response.json();
          if (data.token) {
            const tokenData = {
              accessToken: data.token,
              refreshToken: data.token, // Test için refresh token = access token
              expiresAt: Date.now() + (data.expiresIn || 3600) * 1000,
              tokenType: data.tokenType || 'Bearer',
            };
            this.tokenManager.setTokens(tokenData);
            console.log('✅ Test token alındı ve kaydedildi');
          } else {
            console.error('❌ Test token response\'da token bulunamadı:', data);
            throw new Error('Test token response\'da token bulunamadı');
          }
        } catch (error) {
          console.error('❌ Test token alınamadı:', error);
          this.tokenFetchPromise = null;
          throw error;
        } finally {
          if (this.tokenFetchPromise) {
            this.tokenFetchPromise = null;
          }
        }
      })();

      await this.tokenFetchPromise;

      // Token alındıktan sonra tekrar kontrol et
      const finalToken = this.tokenManager.getAccessToken();
      if (!finalToken) {
        throw new Error('Token alındı ama kaydedilemedi. Lütfen tekrar deneyin.');
      }
    }
  }

  private async getHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Token yoksa veya geçersizse test token al
    try {
      await this.ensureToken();
    } catch (error) {
      console.error('❌ Token alınamadı:', error);
      // Token alınamazsa da devam et, bazı endpoint'ler public olabilir
      // Ama request interceptor token'ı ekleyemeyecek
    }

    // Apply request interceptors
    let config: RequestConfig = {
      url: '',
      method: 'GET',
      headers,
    };

    for (const interceptor of this.requestInterceptors) {
      if (interceptor.onFulfilled) {
        config = await interceptor.onFulfilled(config);
      }
    }

    // Token yoksa uyarı ver
    const authHeader = this.tokenManager.getAuthHeader();
    if (!authHeader) {
      console.warn('⚠️ Authorization header eklenemedi - token bulunamadı');
    }

    return config.headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    // 401 hatası için özel işlem - refresh token yoksa test token almayı dene
    if (!response.ok && response.status === 401) {
      const refreshToken = this.tokenManager.getRefreshToken();
      if (!refreshToken) {
        // Refresh token yoksa, test token almayı dene
        try {
          console.log('🔑 401 hatası - test token alınmaya çalışılıyor...');
          await this.ensureToken();
          // Token alındıysa, isteği tekrar dene (bu durumda sadece hata döndür)
          const error = await this.createErrorFromResponse(response);
          return {
            success: false,
            data: {} as T,
            error: error.message || 'Unauthorized - Token yenilendi, lütfen tekrar deneyin',
            status: 401,
          };
        } catch (tokenError) {
          // Token alınamazsa, hatayı normal şekilde döndür
          const error = await this.createErrorFromResponse(response);
          return {
            success: false,
            data: {} as T,
            error: error.message || 'Unauthorized',
            status: 401,
          };
        }
      }
    }

    // Apply response interceptors
    let processedResponse = response;
    for (const interceptor of this.responseInterceptors) {
      if (interceptor.onFulfilled) {
        processedResponse = await interceptor.onFulfilled(processedResponse);
      }
    }

    if (!processedResponse.ok) {
      // 401 hatası için tekrar kontrol (interceptor sonrası)
      if (processedResponse.status === 401) {
        const refreshToken = this.tokenManager.getRefreshToken();
        if (!refreshToken) {
          const error = await this.createErrorFromResponse(processedResponse);
          return {
            success: false,
            data: {} as T,
            error: error.message || 'Unauthorized',
            status: 401,
          };
        }
      }

      // Apply error interceptors
      for (const interceptor of this.responseInterceptors) {
        if (interceptor.onRejected) {
          try {
            const result = await interceptor.onRejected(processedResponse);
            // Eğer interceptor bir ApiResponse döndürdüyse, onu kullan
            if (result && typeof result === 'object' && 'success' in result) {
              return result as ApiResponse<T>;
            }
            // Eğer interceptor Response objesi döndürdüyse (refresh token yoksa), onu ApiResponse'a çevir
            if (result && result instanceof Response) {
              const error = await this.createErrorFromResponse(result);
              return {
                success: false,
                data: {} as T,
                error: error.message || 'Request failed',
                status: result.status,
              };
            }
            // Eğer interceptor Response döndürdüyse ve 401 ise, özel işlem yap
            if (result === processedResponse && processedResponse.status === 401) {
              const refreshToken = this.tokenManager.getRefreshToken();
              if (!refreshToken) {
                const error = await this.createErrorFromResponse(processedResponse);
                return {
                  success: false,
                  data: {} as T,
                  error: error.message || 'Unauthorized',
                  status: 401,
                };
              }
            }
          } catch (error) {
            // If interceptor handles the error, continue with normal flow
            if (error !== processedResponse) {
              throw error;
            }
          }
        }
      }

      // 401 hatası için son kontrol - hala throw edilmediyse
      if (processedResponse.status === 401) {
        const refreshToken = this.tokenManager.getRefreshToken();
        if (!refreshToken) {
          const error = await this.createErrorFromResponse(processedResponse);
          return {
            success: false,
            data: {} as T,
            error: error.message || 'Unauthorized',
            status: 401,
          };
        }
      }

      // 400 validation hatası için özel işlem - detaylı hata mesajı göster
      if (processedResponse.status === 400) {
        try {
          const errorData = await processedResponse.clone().json();
          if (errorData.validationErrors) {
            // Validation hatalarını formatla
            const validationMessages = Object.entries(errorData.validationErrors)
              .map(([field, message]) => `${field}: ${message}`)
              .join(', ');
            const error = new Error(`Validation Failed: ${validationMessages}`);
            (error as any).status = 400;
            (error as any).payload = errorData;
            throw error;
          }
        } catch (parseError) {
          // JSON parse edilemezse normal hata olarak işle
        }
      }

      const error = await this.createErrorFromResponse(processedResponse);
      throw error;
    }

    const contentType = processedResponse.headers.get('content-type');
    let parsedBody: any = null;

    if (processedResponse.status !== 204) {
      if (contentType && contentType.includes('application/json')) {
        parsedBody = await processedResponse.json();
      } else if (contentType && contentType.includes('text/')) {
        parsedBody = await processedResponse.text();
      } else {
        parsedBody = await processedResponse.blob();
      }
    }

    return {
      success: true,
      data: parsedBody as T,
      status: processedResponse.status,
    };
  }

  private async createErrorFromResponse(response: Response): Promise<Error> {
    const contentType = response.headers.get('content-type');
    let errorPayload: any = null;

    try {
      if (contentType && contentType.includes('application/json')) {
        errorPayload = await response.json();
      } else {
        errorPayload = await response.text();
      }
    } catch (err) {
      console.error('Failed to parse error response:', err);
      errorPayload = { message: 'Failed to parse error response' };
    }

    const errorMessage = typeof errorPayload === 'string'
      ? errorPayload
      : errorPayload?.message || errorPayload?.error || response.statusText;

    const error = new Error(`HTTP ${response.status}: ${errorMessage}`);
    (error as any).status = response.status;
    (error as any).payload = errorPayload;
    (error as any).response = response;

    return error;
  }

  async get<T>(endpoint: string, retries?: number, useCache: boolean = true): Promise<ApiResponse<T>> {
    if (OFFLINE_MODE) {
      console.log('API GET çağrısı OFFLINE_MODE nedeniyle atlandı:', endpoint);
      return Promise.resolve({
        success: false,
        data: {} as T,
        error: 'OFFLINE_MODE enabled',
        status: 0,
      });
    }

    // Check cache first
    if (useCache && this.useCache) {
      const cachedData = apiCache.get<T>(endpoint);
      if (cachedData !== null) {
        console.log('✅ Cache hit:', endpoint);
        return {
          success: true,
          data: cachedData,
          status: 200,
        };
      }
    }

    try {
      console.log('API GET çağrısı:', `${API_BASE_URL}${endpoint}`);

      // Token'ın geçerli olduğundan emin ol
      if (!this.tokenManager.isTokenValid()) {
        try {
          await this.ensureToken();
        } catch (tokenError) {
          console.warn('⚠️ Token alınamadı, istek token olmadan gönderiliyor:', tokenError);
        }
      }

      const headers = await this.getHeaders();

      const response = await this.executeWithRetry(
        () => fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'GET',
          headers,
        }),
        retries
      );

      // 401 hatası için console.log'u gizle (sessiz hata)
      if (response.status !== 401) {
        console.log('API GET response:', response.status, response.statusText);
      }

      // handleResponse'ı çağır - 401 için özel işlem yapılacak
      const apiResponse = await this.handleResponse<T>(response);

      // Cache successful responses
      if (useCache && this.useCache && apiResponse.success && apiResponse.data) {
        apiCache.set(endpoint, apiResponse.data);
      }

      // handleResponse her zaman ApiResponse döndürmeli (throw etmemeli)
      // Eğer 401 ve refresh token yoksa, success: false olan bir ApiResponse döndürmeli
      return apiResponse;
    } catch (error: any) {
      console.error('API GET error:', error);

      // 401 hatası için özel işlem - refresh token yoksa sadece hata döndür
      if (error?.status === 401) {
        const refreshToken = this.tokenManager.getRefreshToken();
        if (!refreshToken) {
          return {
            success: false,
            data: {} as T,
            error: error.message || 'Unauthorized',
            status: 401,
          };
        }
      }

      throw error;
    }
  }

  async post<T>(endpoint: string, data?: any, retries?: number): Promise<ApiResponse<T>> {
    if (OFFLINE_MODE) {
      return Promise.resolve({
        success: false,
        data: {} as T,
        error: 'OFFLINE_MODE enabled',
        status: 0,
      });
    }
    const headers = await this.getHeaders();

    // Log request data for debugging
    if (data && !(data instanceof FormData)) {
      console.log('API POST request to:', `${API_BASE_URL}${endpoint}`, 'Data:', JSON.stringify(data, null, 2));
    }

    const fetchOptions: RequestInit = {
      method: 'POST',
      headers,
    };

    if (data instanceof FormData) {
      // Remove Content-Type to let browser set it with boundary
      const h = headers as Record<string, string>;
      if (h['Content-Type']) {
        delete h['Content-Type'];
      }
      fetchOptions.body = data;
    } else if (data) {
      fetchOptions.body = JSON.stringify(data);
    }

    const response = await this.executeWithRetry(
      () => fetch(`${API_BASE_URL}${endpoint}`, fetchOptions),
      retries
    );

    // 400 hatası için daha detaylı hata mesajı göster
    if (response.status === 400) {
      try {
        const errorData = await response.clone().json();
        console.error('Validation error details:', errorData);
      } catch (e) {
        // JSON parse edilemezse text olarak oku
        const errorText = await response.clone().text();
        console.error('Validation error text:', errorText);
      }
    }

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: any, retries?: number): Promise<ApiResponse<T>> {
    if (OFFLINE_MODE) {
      return Promise.resolve({
        success: false,
        data: {} as T,
        error: 'OFFLINE_MODE enabled',
        status: 0,
      });
    }
    const headers = await this.getHeaders();
    const response = await this.executeWithRetry(
      () => fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: data ? JSON.stringify(data) : undefined,
      }),
      retries
    );
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string, retries?: number): Promise<ApiResponse<T>> {
    if (OFFLINE_MODE) {
      return Promise.resolve({
        success: false,
        data: {} as T,
        error: 'OFFLINE_MODE enabled',
        status: 0,
      });
    }
    const headers = await this.getHeaders();
    const response = await this.executeWithRetry(
      () => fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers,
      }),
      retries
    );
    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, data?: any, retries?: number): Promise<ApiResponse<T>> {
    if (OFFLINE_MODE) {
      return Promise.resolve({
        success: false,
        data: {} as T,
        error: 'OFFLINE_MODE enabled',
        status: 0,
      });
    }
    const headers = await this.getHeaders();
    const response = await this.executeWithRetry(
      () => fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers,
        body: data ? JSON.stringify(data) : undefined,
      }),
      retries
    );
    return this.handleResponse<T>(response);
  }
}

// Global API client instance
export const apiClient = new ApiClient();

// Test API endpoints
export const testApi = {
  getPublic: () => apiClient.get('/test/public'),
  getProtected: () => apiClient.get('/test/protected'),
  getAdmin: () => apiClient.get('/test/admin'),
  getVeteriner: () => apiClient.get('/test/veteriner'),
  getUserInfo: () => apiClient.get('/test/userinfo'),
};

export default apiClient; 
