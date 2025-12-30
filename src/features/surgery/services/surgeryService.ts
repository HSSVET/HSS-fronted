import { ApiResponse } from '../../../types/common';
import { apiClient } from '../../../services/api';
import { Surgery, CreateSurgeryRequest, SurgeryMedicationRequest } from '../types/surgery';

export class SurgeryService {

  async createSurgery(surgery: CreateSurgeryRequest): Promise<ApiResponse<Surgery>> {
    return await apiClient.post<Surgery>('/api/surgeries', surgery);
  }

  async getSurgery(id: number | string): Promise<ApiResponse<Surgery>> {
    return await apiClient.get<Surgery>(`/api/surgeries/${id}`);
  }

  async getSurgeriesByAnimal(animalId: number | string): Promise<ApiResponse<Surgery[]>> {
    return await apiClient.get<Surgery[]>(`/api/surgeries/animal/${animalId}`);
  }

  async updateStatus(id: number | string, status: string): Promise<ApiResponse<Surgery>> {
    return await apiClient.patch<Surgery>(`/api/surgeries/${id}/status?status=${status}`);
  }

  async updateDetails(id: number | string, details: Partial<Surgery>): Promise<ApiResponse<Surgery>> {
    return await apiClient.put<Surgery>(`/api/surgeries/${id}/details`, details);
  }

  async addMedication(id: number | string, medication: SurgeryMedicationRequest): Promise<ApiResponse<Surgery>> {
    return await apiClient.post<Surgery>(`/api/surgeries/${id}/medications`, medication);
  }
}

export const surgeryService = new SurgeryService();
