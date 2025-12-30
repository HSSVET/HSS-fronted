import { ApiResponse } from '../../../types/common';
import { apiClient } from '../../../services/api';
import { Hospitalization, AdmitPatientRequest, AddLogRequest } from '../types/hospitalization';

export class HospitalizationService {

  async admitPatient(request: AdmitPatientRequest): Promise<ApiResponse<Hospitalization>> {
    return await apiClient.post<Hospitalization>('/api/hospitalizations', request);
  }

  async getHospitalization(id: number | string): Promise<ApiResponse<Hospitalization>> {
    return await apiClient.get<Hospitalization>(`/api/hospitalizations/${id}`);
  }

  async getHospitalizationsByAnimal(animalId: number | string): Promise<ApiResponse<Hospitalization[]>> {
    return await apiClient.get<Hospitalization[]>(`/api/hospitalizations/animal/${animalId}`);
  }

  async dischargePatient(id: number | string): Promise<ApiResponse<Hospitalization>> {
    return await apiClient.post<Hospitalization>(`/api/hospitalizations/${id}/discharge`);
  }

  async addLog(id: number | string, log: AddLogRequest): Promise<ApiResponse<Hospitalization>> {
    return await apiClient.post<Hospitalization>(`/api/hospitalizations/${id}/logs`, log);
  }
}

export const hospitalizationService = new HospitalizationService();
