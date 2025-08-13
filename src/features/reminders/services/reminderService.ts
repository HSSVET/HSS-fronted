import { apiClient } from '../../../services/api';

export interface Reminder {
  id: string;
  appointmentId: string;
  channel: 'SMS' | 'EMAIL';
  sendTime: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  animalName?: string;
  ownerName?: string;
  appointmentDate?: string;
}

export interface CreateReminderRequest {
  appointmentId: string;
  channel: 'SMS' | 'EMAIL';
  sendTime: string;
}

export interface SystemStatus {
  schedulerEnabled: boolean;
  lastProcessTime: string;
  totalProcessed: number;
  successRate: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export class ReminderService {
  private static readonly BASE_URL = '/api/reminders';

  /**
   * Manuel hatırlatma oluştur
   */
  static async createReminder(request: CreateReminderRequest): Promise<ApiResponse<Reminder>> {
    try {
      const params = new URLSearchParams();
      params.append('appointmentId', request.appointmentId);
      params.append('channel', request.channel);
      params.append('sendTime', request.sendTime);

      const response: any = await apiClient.post(`${this.BASE_URL}/create`, params);

      return {
        success: true,
        data: response.data,
        message: 'Hatırlatma başarıyla oluşturuldu'
      };
    } catch (error: any) {
      console.error('Hatırlatma oluşturulurken hata:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Hatırlatma oluşturulurken hata oluştu'
      };
    }
  }

  /**
   * Test bildirimi gönder
   */
  static async sendTestNotification(channel: 'SMS' | 'EMAIL', destination: string): Promise<ApiResponse<any>> {
    try {
      const params = new URLSearchParams();
      params.append('channel', channel);
      params.append('destination', destination);

      const response: any = await apiClient.post(`${this.BASE_URL}/test`, params);

      return {
        success: response.data.success,
        data: response.data,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Test bildirimi gönderilirken hata:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Test bildirimi gönderilirken hata oluştu'
      };
    }
  }

  /**
   * Beklemedeki hatırlatmaları işle
   */
  static async processReminders(): Promise<ApiResponse<{ processedCount: number }>> {
    try {
      const response: any = await apiClient.post(`${this.BASE_URL}/process`);

      return {
        success: response.data.success,
        data: { processedCount: response.data.processedCount },
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Hatırlatmalar işlenirken hata:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Hatırlatmalar işlenirken hata oluştu'
      };
    }
  }

  /**
   * Randevu hatırlatmaları oluştur
   */
  static async createAppointmentReminders(): Promise<ApiResponse<{ createdCount: number }>> {
    try {
      const response: any = await apiClient.post(`${this.BASE_URL}/create-appointment-reminders`);

      return {
        success: response.data.success,
        data: { createdCount: response.data.createdCount },
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Randevu hatırlatmaları oluşturulurken hata:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Randevu hatırlatmaları oluşturulurken hata oluştu'
      };
    }
  }

  /**
   * Aşı hatırlatmaları oluştur
   */
  static async createVaccinationReminders(): Promise<ApiResponse<{ createdCount: number }>> {
    try {
      const response: any = await apiClient.post(`${this.BASE_URL}/create-vaccination-reminders`);

      return {
        success: response.data.success,
        data: { createdCount: response.data.createdCount },
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Aşı hatırlatmaları oluşturulurken hata:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Aşı hatırlatmaları oluşturulurken hata oluştu'
      };
    }
  }

  /**
   * Başarısız hatırlatmaları yeniden dene
   */
  static async retryFailedReminders(): Promise<ApiResponse<{ retriedCount: number }>> {
    try {
      const response: any = await apiClient.post(`${this.BASE_URL}/retry-failed`);

      return {
        success: response.data.success,
        data: { retriedCount: response.data.retriedCount },
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Başarısız hatırlatmalar yeniden denenirken hata:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Başarısız hatırlatmalar yeniden denenirken hata oluştu'
      };
    }
  }

  /**
   * Sistem durumunu al
   */
  static async getSystemStatus(): Promise<ApiResponse<SystemStatus>> {
    try {
      const response: any = await apiClient.get(`${this.BASE_URL}/system-status`);

      return {
        success: response.data.success,
        data: {
          schedulerEnabled: response.data.schedulerEnabled,
          lastProcessTime: response.data.lastProcessTime,
          totalProcessed: response.data.totalProcessed || 0,
          successRate: response.data.successRate || 0
        },
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Sistem durumu alınırken hata:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Sistem durumu alınırken hata oluştu'
      };
    }
  }

  /**
   * Randevu ID'sine göre hatırlatmaları al
   */
  static async getRemindersByAppointment(appointmentId: string): Promise<ApiResponse<Reminder[]>> {
    try {
      // Bu endpoint henüz backend'de yok, gelecekte eklenebilir
      const response: any = await apiClient.get(`${this.BASE_URL}/appointment/${appointmentId}`);

      return {
        success: true,
        data: response.data,
        message: 'Hatırlatmalar başarıyla alındı'
      };
    } catch (error: any) {
      console.error('Hatırlatmalar alınırken hata:', error);
      
      // Şimdilik mock data dön
      return {
        success: true,
        data: [],
        message: 'Mock data - gerçek API henüz implement edilmedi'
      };
    }
  }

  /**
   * Tüm hatırlatmaları al (sayfalama ile)
   */
  static async getAllReminders(page: number = 1, limit: number = 10): Promise<ApiResponse<{
    reminders: Reminder[];
    total: number;
    currentPage: number;
    totalPages: number;
  }>> {
    try {
      // Bu endpoint henüz backend'de yok, gelecekte eklenebilir
      const response: any = await apiClient.get(`${this.BASE_URL}?page=${page}&limit=${limit}`);

      return {
        success: true,
        data: response.data,
        message: 'Hatırlatmalar başarıyla alındı'
      };
    } catch (error: any) {
      console.error('Hatırlatmalar alınırken hata:', error);
      
      // Şimdilik mock data dön
      return {
        success: true,
        data: {
          reminders: [],
          total: 0,
          currentPage: 1,
          totalPages: 1
        },
        message: 'Mock data - gerçek API henüz implement edilmedi'
      };
    }
  }
}
