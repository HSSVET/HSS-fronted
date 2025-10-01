import { apiClient } from '../../../services/api';
import { API_ENDPOINTS } from '../../../constants';
import type { ApiResponse } from '../../../types/common';

export interface VeterinarianRecord {
  id: number;
  fullName: string;
  phone?: string;
  email?: string;
}

export class VeterinarianService {
  static async getActiveVeterinarians(): Promise<ApiResponse<VeterinarianRecord[]>> {
    return apiClient.get(API_ENDPOINTS.VETERINARIANS_BASIC);
  }
}

export default VeterinarianService;
