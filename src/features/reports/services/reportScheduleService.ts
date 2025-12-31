import { apiClient } from '../../../services/api';
import { API_ENDPOINTS } from '../../../constants';
import type { ApiResponse } from '../../../types/common';

export type ReportFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'CUSTOM';
export type ReportType = 'GENERAL' | 'FINANCIAL' | 'MEDICAL' | 'INVENTORY' | 'APPOINTMENT';

export interface ReportSchedule {
  reportId: number;
  name: string;
  description?: string;
  frequency: ReportFrequency;
  cronExpression?: string;
  lastRun?: string;
  nextRun?: string;
  isActive: boolean;
  reportType: ReportType;
  parameters?: string; // JSON string
  emailRecipients?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ReportScheduleCreateRequest {
  name: string;
  description?: string;
  frequency: ReportFrequency;
  cronExpression?: string;
  reportType: ReportType;
  parameters?: string;
  emailRecipients?: string[];
  isActive?: boolean;
}

export interface ReportScheduleUpdateRequest {
  name?: string;
  description?: string;
  frequency?: ReportFrequency;
  cronExpression?: string;
  reportType?: ReportType;
  parameters?: string;
  emailRecipients?: string[];
  isActive?: boolean;
}

export interface ReportData {
  reportId: string;
  reportName: string;
  reportType: string;
  generatedAt: string;
  data: Record<string, any>;
  format: string;
  downloadUrl?: string;
}

export class ReportScheduleService {
  static async createSchedule(request: ReportScheduleCreateRequest): Promise<ApiResponse<ReportSchedule>> {
    return apiClient.post<ReportSchedule>(API_ENDPOINTS.REPORT_SCHEDULES, request);
  }

  static async getAllSchedules(): Promise<ApiResponse<ReportSchedule[]>> {
    return apiClient.get<ReportSchedule[]>(API_ENDPOINTS.REPORT_SCHEDULES);
  }

  static async getActiveSchedules(): Promise<ApiResponse<ReportSchedule[]>> {
    return apiClient.get<ReportSchedule[]>(`${API_ENDPOINTS.REPORT_SCHEDULES}/active`);
  }

  static async getScheduleById(id: number): Promise<ApiResponse<ReportSchedule>> {
    return apiClient.get<ReportSchedule>(`${API_ENDPOINTS.REPORT_SCHEDULES}/${id}`);
  }

  static async updateSchedule(id: number, request: ReportScheduleUpdateRequest): Promise<ApiResponse<ReportSchedule>> {
    return apiClient.put<ReportSchedule>(`${API_ENDPOINTS.REPORT_SCHEDULES}/${id}`, request);
  }

  static async deleteSchedule(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${API_ENDPOINTS.REPORT_SCHEDULES}/${id}`);
  }

  static async executeSchedule(id: number): Promise<ApiResponse<ReportData>> {
    return apiClient.post<ReportData>(`${API_ENDPOINTS.REPORT_SCHEDULES}/${id}/execute`);
  }
}

export const reportScheduleService = new ReportScheduleService();

