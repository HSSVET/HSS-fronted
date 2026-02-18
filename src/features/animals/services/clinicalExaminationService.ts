import { ApiResponse } from '../../../types/common';

export interface ClinicalExamination {
  examinationId: number;
  animalId: number;
  animalName?: string;
  date: string;
  findings: string;
  veterinarianName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClinicalExaminationCreateRequest {
  animalId: number;
  date: string;
  findings: string;
  veterinarianName?: string;
}

export class ClinicalExaminationService {
  async getClinicalExaminationsByAnimalId(animalId: number): Promise<ApiResponse<ClinicalExamination[]>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<ClinicalExamination[]>(`/api/animals/${animalId}/examinations`);
    return response;
  }

  async getClinicalExaminationById(animalId: number, examinationId: number): Promise<ApiResponse<ClinicalExamination>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<ClinicalExamination>(`/api/animals/${animalId}/examinations/${examinationId}`);
    return response;
  }

  async createClinicalExamination(request: ClinicalExaminationCreateRequest): Promise<ApiResponse<ClinicalExamination>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.post<ClinicalExamination>(`/api/animals/${request.animalId}/examinations`, request);
    return response;
  }

  async deleteClinicalExamination(animalId: number, examinationId: number): Promise<ApiResponse<void>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.delete<void>(`/api/animals/${animalId}/examinations/${examinationId}`);
    return response;
  }
}

export const clinicalExaminationService = new ClinicalExaminationService();
export default clinicalExaminationService;
