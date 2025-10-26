import type { ApiResponse, PaginatedResponse, SpringPage } from '../../../types/common';
import type {
  Appointment,
  AppointmentSlot,
  CalendarAppointmentPayload,
  CreateAppointmentRequest,
} from '../types/appointment';

export interface AppointmentRecord {
  appointmentId: number;
  animalId: number;
  animalName: string;
  ownerName: string;
  dateTime: string;
  subject: string;
  veterinarianId: number;
  veterinarianName: string;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const normalizeSpringPage = <T>(page: SpringPage<T>): PaginatedResponse<T> => ({
  items: page.content,
  total: page.totalElements,
  page: page.number,
  limit: page.size,
  totalPages: page.totalPages,
});

const emptyPage = <T>(page: number, limit: number): PaginatedResponse<T> => ({
  items: [],
  total: 0,
  page,
  limit,
  totalPages: 0,
});

export class AppointmentService {
  // Get all appointments
  async getAllAppointments(): Promise<ApiResponse<AppointmentRecord[]>> {
    // Direct API call instead of going through ServiceFactory
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<AppointmentRecord[]>('/api/appointments');
    return response;
  }

  // Get all appointments with pagination
  async getAppointments(
    page: number = 0,
    limit: number = 10,
    status?: string,
    veterinarianId?: string
  ): Promise<ApiResponse<PaginatedResponse<AppointmentRecord>>> {
    // Direct API call instead of going through ServiceFactory
    const { apiClient } = await import('../../../services/api');
    const params = new URLSearchParams({
      page: page.toString(),
      size: limit.toString(),
      ...(status && { status }),
      ...(veterinarianId && { veterinarianId })
    });
    const response = await apiClient.get<SpringPage<AppointmentRecord>>(`/api/appointments?${params}`);
    
    // Convert Spring Page to PaginatedResponse
    if (response.success && response.data) {
      const paginatedResponse: PaginatedResponse<AppointmentRecord> = {
        items: response.data.content,
        total: response.data.totalElements,
        page: response.data.number,
        limit: response.data.size,
        totalPages: response.data.totalPages,
      };
      return { success: true, data: paginatedResponse };
    }
    
    return { 
      success: false, 
      data: { items: [], total: 0, page, limit, totalPages: 0 }, 
      error: response.error || 'Failed to fetch appointments',
      status: response.status 
    };
  }

  // Get basic appointments list for dropdowns
  async getBasicAppointments(): Promise<ApiResponse<any[]>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<AppointmentRecord[]>('/api/appointments');
    
    if (response.success && response.data) {
      const basicAppointments = response.data.map(apt => ({
        appointmentId: apt.appointmentId,
        subject: apt.subject,
        animalName: apt.animalName,
        dateTime: apt.dateTime
      }));
      return { success: true, data: basicAppointments };
    }
    
    return { 
      success: false, 
      data: [], 
      error: response.error || 'Failed to fetch basic appointments',
      status: response.status 
    };
  }

  // Get appointment by ID
  async getAppointmentById(id: string): Promise<ApiResponse<AppointmentRecord>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<AppointmentRecord>(`/api/appointments/${id}`);
    return response;
  }

  // Create new appointment
  async createAppointment(appointment: CreateAppointmentRequest): Promise<ApiResponse<AppointmentRecord>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.post<AppointmentRecord>('/api/appointments', appointment);
    return response;
  }

  // Update appointment
  async updateAppointment(id: string, appointment: Partial<Appointment>): Promise<ApiResponse<AppointmentRecord>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.put<AppointmentRecord>(`/api/appointments/${id}`, appointment);
    return response;
  }

  // Delete appointment
  async deleteAppointment(id: string): Promise<ApiResponse<void>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.delete<void>(`/api/appointments/${id}`);
    return response;
  }

  // Get available slots
  async getAvailableSlots(
    date: Date,
    veterinarianId?: string
  ): Promise<ApiResponse<AppointmentSlot[]>> {
    const { apiClient } = await import('../../../services/api');
    const params = new URLSearchParams({
      date: date.toISOString().split('T')[0],
      ...(veterinarianId && { veterinarianId })
    });
    const response = await apiClient.get<AppointmentSlot[]>(`/api/appointments/available-slots?${params}`);
    return response;
  }

  // Cancel appointment
  async cancelAppointment(id: string, reason?: string): Promise<ApiResponse<AppointmentRecord>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.patch<AppointmentRecord>(
      `/api/appointments/${id}/status`, 
      { status: 'CANCELLED', reason }
    );
    return response;
  }

  // Complete appointment
  async completeAppointment(id: string, notes?: string): Promise<ApiResponse<AppointmentRecord>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.patch<AppointmentRecord>(
      `/api/appointments/${id}/status`, 
      { status: 'COMPLETED', notes }
    );
    return response;
  }

  // Get appointments by animal
  async getAppointmentsByAnimal(animalId: string): Promise<ApiResponse<AppointmentRecord[]>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<AppointmentRecord[]>(`/api/appointments/animal/${animalId}`);
    return response;
  }

  // Get appointments by date range
  async getAppointmentsByDateRange(
    startDate: Date,
    endDate: Date,
    veterinarianId?: string
  ): Promise<ApiResponse<AppointmentRecord[]>> {
    // Direct API call instead of going through ServiceFactory
    const { apiClient } = await import('../../../services/api');
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      ...(veterinarianId && { veterinarianId })
    });
    const response = await apiClient.get<AppointmentRecord[]>(`/api/appointments/date-range?${params}`);
    return response;
  }

  // Get appointments by animal ID
  async getAppointmentsByAnimalId(animalId: string): Promise<ApiResponse<AppointmentRecord[]>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<AppointmentRecord[]>(`/api/appointments/animal/${animalId}`);
    return response;
  }

  // Get appointments by veterinarian ID
  async getAppointmentsByVeterinarianId(veterinarianId: string): Promise<ApiResponse<AppointmentRecord[]>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<AppointmentRecord[]>(`/api/appointments/veterinarian/${veterinarianId}`);
    return response;
  }

  // Get appointments by owner ID
  async getAppointmentsByOwnerId(ownerId: string): Promise<ApiResponse<AppointmentRecord[]>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<AppointmentRecord[]>(`/api/appointments/owner/${ownerId}`);
    return response;
  }

  // Get appointments by specific date
  async getAppointmentsByDate(date: Date): Promise<ApiResponse<AppointmentRecord[]>> {
    const { apiClient } = await import('../../../services/api');
    const params = new URLSearchParams({
      date: date.toISOString().split('T')[0]
    });
    const response = await apiClient.get<AppointmentRecord[]>(`/api/appointments?${params}`);
    return response;
  }

  // Get today's appointments
  async getTodayAppointments(): Promise<ApiResponse<AppointmentRecord[]>> {
    const { apiClient } = await import('../../../services/api');
    const today = new Date().toISOString().split('T')[0];
    const params = new URLSearchParams({ date: today });
    const response = await apiClient.get<AppointmentRecord[]>(`/api/appointments?${params}`);
    return response;
  }

  // Get upcoming appointments
  async getUpcomingAppointments(): Promise<ApiResponse<AppointmentRecord[]>> {
    const { apiClient } = await import('../../../services/api');
    const now = new Date();
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 1); // Next month
    
    const params = new URLSearchParams({
      startDate: now.toISOString(),
      endDate: futureDate.toISOString()
    });
    
    const response = await apiClient.get<AppointmentRecord[]>(`/api/appointments/date-range?${params}`);
    return response;
  }

  // Search appointments by subject
  async searchAppointmentsBySubject(subject: string): Promise<ApiResponse<AppointmentRecord[]>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<AppointmentRecord[]>(`/api/appointments?search=${encodeURIComponent(subject)}`);
    return response;
  }

  // Search appointments by animal name
  async searchAppointmentsByAnimalName(animalName: string): Promise<ApiResponse<AppointmentRecord[]>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<AppointmentRecord[]>(`/api/appointments?animalName=${encodeURIComponent(animalName)}`);
    return response;
  }

  // Search appointments by owner name
  async searchAppointmentsByOwnerName(ownerName: string): Promise<ApiResponse<AppointmentRecord[]>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<AppointmentRecord[]>(`/api/appointments?ownerName=${encodeURIComponent(ownerName)}`);
    return response;
  }

  // Get calendar appointments
  async getCalendarAppointments(
    startDate: Date,
    endDate: Date
  ): Promise<ApiResponse<CalendarAppointmentPayload[]>> {
    try {
      // Try to get appointments using date range endpoint as fallback
      const { apiClient } = await import('../../../services/api');
      
      // Use date range endpoint instead of calendar endpoint
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });
      
      const response = await apiClient.get<AppointmentRecord[]>(`/api/appointments/date-range?${params}`);
      
      // Convert AppointmentRecord[] to CalendarAppointmentPayload[]
      if (response.success && response.data) {
        const calendarPayloads: CalendarAppointmentPayload[] = response.data.map(appointment => ({
          id: appointment.appointmentId,
          title: appointment.subject || 'Randevu',
          start: appointment.dateTime,
          end: appointment.dateTime,
          animalId: appointment.animalId,
          animalName: appointment.animalName,
          veterinarianId: appointment.veterinarianId,
          veterinarianName: appointment.veterinarianName,
          ownerId: appointment.animalId,
          ownerName: appointment.ownerName,
        }));
        return { success: true, data: calendarPayloads };
      }
      
      return { 
        success: false, 
        data: [], 
        error: response.error || 'Failed to fetch calendar appointments',
        status: response.status 
      };
    } catch (error) {
      console.warn('Calendar appointments fetch failed, returning empty array:', error);
      return { 
        success: false, 
        data: [], 
        error: error instanceof Error ? error.message : 'Failed to fetch calendar appointments',
        status: 500 
      };
    }
  }
}
