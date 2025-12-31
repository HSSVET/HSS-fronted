import { apiClient } from '../../../services/api';
import { API_ENDPOINTS } from '../../../constants';
import type { ApiResponse } from '../../../types/common';

export interface Reminder {
  reminderId: number;
  appointmentId: number;
  sendTime: string;
  channel: 'EMAIL' | 'SMS' | 'PUSH';
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED' | 'CANCELLED';
  message: string;
  recipientEmail?: string;
  recipientPhone?: string;
  sentAt?: string;
  errorMessage?: string;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReminderCreateRequest {
  appointmentId: number;
  sendTime: string;
  channel: 'EMAIL' | 'SMS' | 'PUSH';
  message?: string;
  recipientEmail?: string;
  recipientPhone?: string;
}

export class ReminderService {
  static async createReminder(request: ReminderCreateRequest): Promise<ApiResponse<Reminder>> {
    return apiClient.post<Reminder>(API_ENDPOINTS.REMINDERS, request);
  }

  static async getRemindersByAppointmentId(appointmentId: number): Promise<ApiResponse<Reminder[]>> {
    return apiClient.get<Reminder[]>(`${API_ENDPOINTS.REMINDERS}/appointment/${appointmentId}`);
  }

  static async getPendingReminders(): Promise<ApiResponse<Reminder[]>> {
    return apiClient.get<Reminder[]>(`${API_ENDPOINTS.REMINDERS}/pending`);
  }

  static async sendReminder(reminderId: number): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${API_ENDPOINTS.REMINDERS}/${reminderId}/send`);
  }

  static async cancelReminder(reminderId: number): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${API_ENDPOINTS.REMINDERS}/${reminderId}/cancel`);
  }

  static async processPendingReminders(): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${API_ENDPOINTS.REMINDERS}/process`);
  }

  static async retryFailedReminders(): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${API_ENDPOINTS.REMINDERS}/retry-failed`);
  }
}

export const reminderService = new ReminderService();

