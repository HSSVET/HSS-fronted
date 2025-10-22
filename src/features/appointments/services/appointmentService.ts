import { ServiceFactory } from '../../../services/mockServiceFactory';
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
    
    return { success: false, data: { items: [], total: 0, page, limit, totalPages: 0 }, error: 'Failed to fetch appointments' };
  }

  // Get basic appointments list for dropdowns
  async getBasicAppointments(): Promise<ApiResponse<any[]>> {
    const service = ServiceFactory.getAppointmentService();
    return service.getBasicAppointments();
  }

  // Get appointment by ID
  async getAppointmentById(id: string): Promise<ApiResponse<AppointmentRecord>> {
    const service = ServiceFactory.getAppointmentService();
    return service.getAppointmentById(id);
  }

  // Create new appointment
  async createAppointment(appointment: CreateAppointmentRequest): Promise<ApiResponse<AppointmentRecord>> {
    const service = ServiceFactory.getAppointmentService();
    return service.createAppointment(appointment);
  }

  // Update appointment
  async updateAppointment(id: string, appointment: Partial<Appointment>): Promise<ApiResponse<AppointmentRecord>> {
    const service = ServiceFactory.getAppointmentService();
    return service.updateAppointment(id, appointment);
  }

  // Delete appointment
  async deleteAppointment(id: string): Promise<ApiResponse<void>> {
    const service = ServiceFactory.getAppointmentService();
    return service.deleteAppointment(id);
  }

  // Get available slots
  async getAvailableSlots(
    date: Date,
    veterinarianId?: string
  ): Promise<ApiResponse<AppointmentSlot[]>> {
    const service = ServiceFactory.getAppointmentService();
    return service.getAvailableSlots(date, veterinarianId);
  }

  // Cancel appointment
  async cancelAppointment(id: string, reason?: string): Promise<ApiResponse<AppointmentRecord>> {
    const service = ServiceFactory.getAppointmentService();
    return service.cancelAppointment(id, reason);
  }

  // Complete appointment
  async completeAppointment(id: string, notes?: string): Promise<ApiResponse<AppointmentRecord>> {
    const service = ServiceFactory.getAppointmentService();
    return service.completeAppointment(id, notes);
  }

  // Get appointments by animal
  async getAppointmentsByAnimal(animalId: string): Promise<ApiResponse<AppointmentRecord[]>> {
    const service = ServiceFactory.getAppointmentService();
    return service.getAppointmentsByAnimal(animalId);
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
    const service = ServiceFactory.getAppointmentService();
    return service.getAppointmentsByAnimalId(animalId);
  }

  // Get appointments by veterinarian ID
  async getAppointmentsByVeterinarianId(veterinarianId: string): Promise<ApiResponse<AppointmentRecord[]>> {
    const service = ServiceFactory.getAppointmentService();
    return service.getAppointmentsByVeterinarianId(veterinarianId);
  }

  // Get appointments by owner ID
  async getAppointmentsByOwnerId(ownerId: string): Promise<ApiResponse<AppointmentRecord[]>> {
    const service = ServiceFactory.getAppointmentService();
    return service.getAppointmentsByOwnerId(ownerId);
  }

  // Get appointments by specific date
  async getAppointmentsByDate(date: Date): Promise<ApiResponse<AppointmentRecord[]>> {
    const service = ServiceFactory.getAppointmentService();
    return service.getAppointmentsByDate(date);
  }

  // Get today's appointments
  async getTodayAppointments(): Promise<ApiResponse<AppointmentRecord[]>> {
    // Direct API call instead of going through ServiceFactory
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<AppointmentRecord[]>('/api/appointments/today');
    return response;
  }

  // Get upcoming appointments
  async getUpcomingAppointments(): Promise<ApiResponse<AppointmentRecord[]>> {
    const service = ServiceFactory.getAppointmentService();
    return service.getUpcomingAppointments();
  }

  // Search appointments by subject
  async searchAppointmentsBySubject(subject: string): Promise<ApiResponse<AppointmentRecord[]>> {
    const service = ServiceFactory.getAppointmentService();
    return service.searchAppointmentsBySubject(subject);
  }

  // Search appointments by animal name
  async searchAppointmentsByAnimalName(animalName: string): Promise<ApiResponse<AppointmentRecord[]>> {
    const service = ServiceFactory.getAppointmentService();
    return service.searchAppointmentsByAnimalName(animalName);
  }

  // Search appointments by owner name
  async searchAppointmentsByOwnerName(ownerName: string): Promise<ApiResponse<AppointmentRecord[]>> {
    const service = ServiceFactory.getAppointmentService();
    return service.searchAppointmentsByOwnerName(ownerName);
  }

  // Get calendar appointments
  async getCalendarAppointments(
    startDate: Date,
    endDate: Date
  ): Promise<ApiResponse<CalendarAppointmentPayload[]>> {
    // Direct API call instead of going through ServiceFactory
    const { apiClient } = await import('../../../services/api');
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });
    const response = await apiClient.get<AppointmentRecord[]>(`/api/appointments/calendar?${params}`);
    
    // Convert AppointmentRecord[] to CalendarAppointmentPayload[]
    if (response.success && response.data) {
      const calendarPayloads: CalendarAppointmentPayload[] = response.data.map(appointment => ({
        id: appointment.appointmentId,
        title: appointment.subject || 'Randevu',
        start: appointment.dateTime,
        end: appointment.dateTime, // You might want to add duration logic here
        animalId: appointment.animalId,
        animalName: appointment.animalName,
        veterinarianId: appointment.veterinarianId,
        veterinarianName: appointment.veterinarianName,
        ownerId: appointment.animalId, // Using animalId as ownerId for now
        ownerName: appointment.ownerName,
      }));
      return { success: true, data: calendarPayloads };
    }
    
    return { success: false, data: [], error: 'Failed to fetch calendar appointments' };
  }
}
