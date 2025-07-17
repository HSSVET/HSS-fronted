// @ts-ignore
import Keycloak from 'keycloak-js';

// Base API URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8090/api';

// API client with Keycloak token support
export class ApiClient {
  private keycloak: any | null = null;

  constructor(keycloak?: any) {
    this.keycloak = keycloak || null;
  }

  setKeycloak(keycloak: any) {
    this.keycloak = keycloak;
  }

  private async getHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.keycloak?.authenticated) {
      try {
        // Token'ı yenile (gerekirse)
        await this.keycloak.updateToken(30);
        headers['Authorization'] = `Bearer ${this.keycloak.token}`;
      } catch (error) {
        console.error('Failed to update token for API call:', error);
        throw new Error('Authentication required');
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        if (this.keycloak) {
          try {
            await this.keycloak.updateToken(30);
            // Retry the request with new token would be here
          } catch (error) {
            this.keycloak.login();
            throw new Error('Authentication required');
          }
        }
        throw new Error('Unauthorized');
      }
      
      if (response.status === 403) {
        throw new Error('Forbidden - Insufficient permissions');
      }

      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      return response.text() as any;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
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