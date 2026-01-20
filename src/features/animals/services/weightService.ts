import type { ApiResponse } from '../../../types/common';

export interface WeightRecord {
  id: number;
  animalId: number;
  weight: number;
  measuredAt: string;
  note?: string;
  createdBy?: string;
}

export interface CreateWeightRequest {
  weight: number;
  measuredAt: string;
  note?: string;
}

export class WeightService {
  async getWeightHistory(animalId: string): Promise<ApiResponse<WeightRecord[]>> {
    const { apiClient } = await import('../../../services/api');
    return apiClient.get<WeightRecord[]>(`/api/animals/${animalId}/weight-history`);
  }

  async addWeightRecord(animalId: string, data: CreateWeightRequest): Promise<ApiResponse<WeightRecord>> {
    const { apiClient } = await import('../../../services/api');
    return apiClient.post<WeightRecord>(`/api/animals/${animalId}/weight-history`, data);
  }

  async updateWeightRecord(id: number, data: CreateWeightRequest): Promise<ApiResponse<WeightRecord>> {
    const { apiClient } = await import('../../../services/api');
    return apiClient.put<WeightRecord>(`/api/animals/weight-history/${id}`, data);
  }

  async deleteWeightRecord(id: number): Promise<ApiResponse<void>> {
    const { apiClient } = await import('../../../services/api');
    return apiClient.delete<void>(`/api/animals/weight-history/${id}`);
  }
}

export const weightService = new WeightService();
export default weightService;
