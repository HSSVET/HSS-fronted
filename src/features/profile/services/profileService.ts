import { apiClient } from '../../../services/api';
import type { ApiResponse } from '../../../types/common';

export interface WorkSchedule {
  id?: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface DashboardPreference {
  widgetId: string;
  isVisible: boolean;
  position: number;
  size?: 'small' | 'medium' | 'large';
}

export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  specialization?: string;
  licenseNumber?: string;
  workSchedules: WorkSchedule[];
  dashboardPreferences: DashboardPreference[];
  totalPatients?: number;
  totalAppointments?: number;
  upcomingAppointments?: number;
}

export interface UpdateProfileRequest {
  phone?: string;
  specialization?: string;
  workSchedules?: WorkSchedule[];
  dashboardPreferences?: DashboardPreference[];
}

export class ProfileService {
  static async getCurrentUserProfile(): Promise<ApiResponse<UserProfile>> {
    try {
      const response = await apiClient.get<UserProfile>('/api/profile/me');
      return response;
    } catch (error) {
      console.error('Profil bilgileri alınırken hata:', error);
      return {
        success: false,
        data: null as any,
        error: 'Profil bilgileri alınamadı'
      };
    }
  }

  static async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<UserProfile>> {
    try {
      const response = await apiClient.put<UserProfile>('/api/profile/me', data);
      return response;
    } catch (error) {
      console.error('Profil güncellenirken hata:', error);
      return {
        success: false,
        data: null as any,
        error: 'Profil güncellenemedi'
      };
    }
  }

  static async updateWorkSchedule(schedules: WorkSchedule[]): Promise<ApiResponse<WorkSchedule[]>> {
    try {
      const response = await apiClient.put<WorkSchedule[]>('/api/profile/work-schedule', schedules);
      return response;
    } catch (error) {
      console.error('Çalışma programı güncellenirken hata:', error);
      return {
        success: false,
        data: [],
        error: 'Çalışma programı güncellenemedi'
      };
    }
  }

  static async updateDashboardPreferences(preferences: DashboardPreference[]): Promise<ApiResponse<DashboardPreference[]>> {
    try {
      const response = await apiClient.put<DashboardPreference[]>('/api/profile/dashboard-preferences', preferences);
      return response;
    } catch (error) {
      console.error('Dashboard tercihleri güncellenirken hata:', error);
      return {
        success: false,
        data: [],
        error: 'Dashboard tercihleri güncellenemedi'
      };
    }
  }

  static async getMyPatients(limit: number = 10): Promise<ApiResponse<any[]>> {
    try {
      const response = await apiClient.get<any[]>(`/api/profile/my-patients?limit=${limit}`);
      return response;
    } catch (error) {
      console.error('Hastalar alınırken hata:', error);
      return {
        success: false,
        data: [],
        error: 'Hasta listesi alınamadı'
      };
    }
  }

  static async getMyAppointments(startDate?: string, endDate?: string): Promise<ApiResponse<any[]>> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await apiClient.get<any[]>(`/api/profile/my-appointments?${params.toString()}`);
      return response;
    } catch (error) {
      console.error('Randevular alınırken hata:', error);
      return {
        success: false,
        data: [],
        error: 'Randevu listesi alınamadı'
      };
    }
  }
}

export default ProfileService;
