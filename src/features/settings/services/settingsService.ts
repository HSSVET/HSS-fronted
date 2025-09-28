import { apiClient } from '../../../services/api';
import { API_ENDPOINTS } from '../../../constants';
import type { ApiResponse } from '../../../types/common';

export class SettingsService {
  static async getClinicSettings(): Promise<ApiResponse<any>> {
    return apiClient.get(`${API_ENDPOINTS.USERS}/settings/clinic`);
  }

  static async updateClinicSettings(settings: any): Promise<ApiResponse<any>> {
    return apiClient.put(`${API_ENDPOINTS.USERS}/settings/clinic`, settings);
  }

  static async getUserSettings(): Promise<ApiResponse<any>> {
    return apiClient.get(`${API_ENDPOINTS.USERS}/settings/profile`);
  }

  static async updateUserSettings(settings: any): Promise<ApiResponse<any>> {
    return apiClient.put(`${API_ENDPOINTS.USERS}/settings/profile`, settings);
  }

  static async getSystemSettings(): Promise<ApiResponse<any>> {
    return apiClient.get(`${API_ENDPOINTS.USERS}/settings/system`);
  }

  static async updateSystemSettings(settings: any): Promise<ApiResponse<any>> {
    return apiClient.put(`${API_ENDPOINTS.USERS}/settings/system`, settings);
  }
}