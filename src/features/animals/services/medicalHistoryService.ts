import { ApiResponse } from '../../../types/common';

export interface MedicalHistory {
  historyId: number;
  animalId: number;
  animalName?: string;
  diagnosis: string;
  date: string;
  treatment?: string;
  createdAt?: string;
  updatedAt?: string;
}

export class MedicalHistoryService {
  async getMedicalHistoriesByAnimalId(animalId: number): Promise<ApiResponse<MedicalHistory[]>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<MedicalHistory[]>(`/api/animals/${animalId}/medical-history`);
    return response;
  }

  async getMedicalHistoryById(animalId: number, historyId: number): Promise<ApiResponse<MedicalHistory>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<MedicalHistory>(`/api/animals/${animalId}/medical-history/${historyId}`);
    return response;
  }
}

export const medicalHistoryService = new MedicalHistoryService();
export default medicalHistoryService;
