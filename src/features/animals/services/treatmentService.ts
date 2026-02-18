import { ApiResponse } from '../../../types/common';

export interface Treatment {
  treatmentId: number;
  animalId: number;
  animalName?: string;
  clinicId: number;
  treatmentType: 'MEDICATION' | 'SURGERY' | 'THERAPY' | 'PROCEDURE' | 'OTHER';
  title: string;
  description?: string;
  diagnosis?: string;
  startDate: string;
  endDate?: string;
  status: 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  veterinarianName?: string;
  notes?: string;
  cost?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TreatmentCreateRequest {
  animalId: number;
  treatmentType: Treatment['treatmentType'];
  title: string;
  description?: string;
  diagnosis?: string;
  startDate: string;
  endDate?: string;
  status?: Treatment['status'];
  veterinarianName?: string;
  notes?: string;
  cost?: number;
}

export interface TreatmentUpdateRequest {
  treatmentType?: Treatment['treatmentType'];
  title?: string;
  description?: string;
  diagnosis?: string;
  startDate?: string;
  endDate?: string;
  status?: Treatment['status'];
  veterinarianName?: string;
  notes?: string;
  cost?: number;
}

export class TreatmentService {
  async getTreatmentsByAnimalId(animalId: number): Promise<ApiResponse<Treatment[]>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<Treatment[]>(`/api/animals/${animalId}/treatments`);
    return response;
  }

  async getTreatmentById(animalId: number, treatmentId: number): Promise<ApiResponse<Treatment>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<Treatment>(`/api/animals/${animalId}/treatments/${treatmentId}`);
    return response;
  }

  async createTreatment(request: TreatmentCreateRequest): Promise<ApiResponse<Treatment>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.post<Treatment>(`/api/animals/${request.animalId}/treatments`, request);
    return response;
  }

  async updateTreatment(animalId: number, treatmentId: number, request: TreatmentUpdateRequest): Promise<ApiResponse<Treatment>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.put<Treatment>(`/api/animals/${animalId}/treatments/${treatmentId}`, request);
    return response;
  }

  async deleteTreatment(animalId: number, treatmentId: number): Promise<ApiResponse<void>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.delete<void>(`/api/animals/${animalId}/treatments/${treatmentId}`);
    return response;
  }
}

export const treatmentService = new TreatmentService();
export default treatmentService;
