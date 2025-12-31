import { apiClient } from '../../../services/api';
import { API_ENDPOINTS } from '../../../constants';
import type { ApiResponse } from '../../../types/common';

export type VaccinationScheduleStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'OVERDUE' | 'SKIPPED';
export type VaccinationSchedulePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface VaccinationSchedule {
  scheduleId: number;
  animalId: number;
  animalName: string;
  vaccineId: number;
  vaccineName: string;
  protocolId?: number;
  protocolName?: string;
  scheduledDate: string;
  doseNumber: number;
  status: VaccinationScheduleStatus;
  priority: VaccinationSchedulePriority;
  isOverdue: boolean;
  completedDate?: string;
  vaccinationRecordId?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export class VaccinationScheduleService {
  static async getSchedulesByAnimalId(animalId: number): Promise<ApiResponse<VaccinationSchedule[]>> {
    return apiClient.get<VaccinationSchedule[]>(`${API_ENDPOINTS.VACCINATION_SCHEDULES}/animal/${animalId}`);
  }

  static async getPendingSchedules(): Promise<ApiResponse<VaccinationSchedule[]>> {
    return apiClient.get<VaccinationSchedule[]>(`${API_ENDPOINTS.VACCINATION_SCHEDULES}/pending`);
  }

  static async getOverdueSchedules(): Promise<ApiResponse<VaccinationSchedule[]>> {
    return apiClient.get<VaccinationSchedule[]>(`${API_ENDPOINTS.VACCINATION_SCHEDULES}/overdue`);
  }

  static async getUpcomingSchedules(days: number = 30): Promise<ApiResponse<VaccinationSchedule[]>> {
    return apiClient.get<VaccinationSchedule[]>(`${API_ENDPOINTS.VACCINATION_SCHEDULES}/upcoming?days=${days}`);
  }

  static async generateScheduleForAnimal(animalId: number): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${API_ENDPOINTS.VACCINATION_SCHEDULES}/animal/${animalId}/generate`);
  }

  static async markScheduleAsCompleted(
    scheduleId: number,
    vaccinationRecordId?: number
  ): Promise<ApiResponse<void>> {
    const params = vaccinationRecordId ? `?vaccinationRecordId=${vaccinationRecordId}` : '';
    return apiClient.post<void>(`${API_ENDPOINTS.VACCINATION_SCHEDULES}/${scheduleId}/complete${params}`);
  }
}

export const vaccinationScheduleService = new VaccinationScheduleService();

