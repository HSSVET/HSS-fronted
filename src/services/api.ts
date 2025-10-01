import { OFFLINE_MODE } from '../config/offline';
import type { ApiResponse } from '../types/common';

// Base API URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8090';
console.log('API Base URL:', API_BASE_URL);
console.log('OFFLINE_MODE:', OFFLINE_MODE);

// API client without authentication
export class ApiClient {

  private async getHeaders(): Promise<HeadersInit> {
    return {
      'Content-Type': 'application/json',
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      if (response.status === 401) {
        console.warn('401 Unauthorized - Backend authentication gerekebilir');
        throw new Error('Unauthorized - Backend authentication required');
      }

      if (response.status === 403) {
        console.warn('403 Forbidden - İzin yok');
        throw new Error('Forbidden - Insufficient permissions');
      }

      const contentType = response.headers.get('content-type');
      let errorPayload: any = null;

      if (contentType && contentType.includes('application/json')) {
        try {
          errorPayload = await response.json();
        } catch (err) {
          console.error('JSON parse error for error response:', err);
        }
      } else {
        errorPayload = await response.text();
      }

      const errorMessage = typeof errorPayload === 'string'
        ? errorPayload
        : errorPayload?.message || errorPayload?.error || response.statusText;

      console.error(`HTTP ${response.status}: ${errorMessage}`);
      const error = new Error(`HTTP ${response.status}: ${errorMessage}`);
      (error as any).status = response.status;
      (error as any).payload = errorPayload;
      throw error;
    }

    const contentType = response.headers.get('content-type');
    let parsedBody: any = null;

    if (response.status !== 204) {
      if (contentType && contentType.includes('application/json')) {
        parsedBody = await response.json();
      } else if (contentType && contentType.includes('text/')) {
        parsedBody = await response.text();
      } else {
        parsedBody = await response.blob();
      }
    }

    return {
      success: true,
      data: parsedBody as T,
      status: response.status,
    };
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    if (OFFLINE_MODE) {
      console.log('API GET çağrısı OFFLINE_MODE nedeniyle atlandı:', endpoint);
      return Promise.resolve({
        success: false,
        data: {} as T,
        error: 'OFFLINE_MODE enabled',
        status: 0,
      });
    }
    console.log('API GET çağrısı:', `${API_BASE_URL}${endpoint}`);
    const headers = await this.getHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });
    console.log('API GET response:', response.status, response.statusText);
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    if (OFFLINE_MODE) {
      return Promise.resolve({
        success: false,
        data: {} as T,
        error: 'OFFLINE_MODE enabled',
        status: 0,
      });
    }
    const headers = await this.getHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    if (OFFLINE_MODE) {
      return Promise.resolve({
        success: false,
        data: {} as T,
        error: 'OFFLINE_MODE enabled',
        status: 0,
      });
    }
    const headers = await this.getHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    if (OFFLINE_MODE) {
      return Promise.resolve({
        success: false,
        data: {} as T,
        error: 'OFFLINE_MODE enabled',
        status: 0,
      });
    }
    const headers = await this.getHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    if (OFFLINE_MODE) {
      return Promise.resolve({
        success: false,
        data: {} as T,
        error: 'OFFLINE_MODE enabled',
        status: 0,
      });
    }
    const headers = await this.getHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
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
