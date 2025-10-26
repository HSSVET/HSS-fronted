import { OFFLINE_MODE } from '../config/offline';
import type { ApiResponse } from '../types/common';
import TokenManager from './tokenManager';

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

  constructor() {
    this.tokenManager = TokenManager.getInstance();
    this.setupDefaultInterceptors();
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
        const authHeader = this.tokenManager.getAuthHeader();
        if (authHeader) {
          config.headers = {
            ...config.headers,
            'Authorization': authHeader,
          };
        }
        return config;
      },
    });

    // Response interceptor for token refresh
    this.addResponseInterceptor({
      onFulfilled: (response) => response,
      onRejected: async (error) => {
        if (error.status === 401 && !this.isRefreshing) {
          return this.handleTokenRefresh(error);
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
        // Refresh failed, redirect to login
        this.handleAuthFailure();
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
        return await requestFn();
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
    window.location.href = '/login';
  }

  private async getHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

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

    return config.headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    // Apply response interceptors
    let processedResponse = response;
    for (const interceptor of this.responseInterceptors) {
      if (interceptor.onFulfilled) {
        processedResponse = await interceptor.onFulfilled(processedResponse);
      }
    }

    if (!processedResponse.ok) {
      // Apply error interceptors
      for (const interceptor of this.responseInterceptors) {
        if (interceptor.onRejected) {
          try {
            return await interceptor.onRejected(processedResponse);
          } catch (error) {
            // If interceptor handles the error, continue with normal flow
            if (error !== processedResponse) {
              throw error;
            }
          }
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

  async get<T>(endpoint: string, retries?: number): Promise<ApiResponse<T>> {
    if (OFFLINE_MODE) {
      console.log('API GET çağrısı OFFLINE_MODE nedeniyle atlandı:', endpoint);
      return Promise.resolve({
        success: false,
        data: {} as T,
        error: 'OFFLINE_MODE enabled',
        status: 0,
      });
    }
    
    try {
      console.log('API GET çağrısı:', `${API_BASE_URL}${endpoint}`);
      const headers = await this.getHeaders();
      
      const response = await this.executeWithRetry(
        () => fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'GET',
          headers,
        }),
        retries
      );
      
      console.log('API GET response:', response.status, response.statusText);
      return await this.handleResponse<T>(response);
    } catch (error) {
      console.error('API GET error:', error);
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
    const response = await this.executeWithRetry(
      () => fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: data ? JSON.stringify(data) : undefined,
      }),
      retries
    );
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
