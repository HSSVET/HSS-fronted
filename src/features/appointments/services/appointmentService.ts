import { apiClient } from '../../../services/api';
import { API_ENDPOINTS } from '../../../constants';
import type {
  Appointment,
  AppointmentSlot,
  CalendarAppointmentPayload,
  CreateAppointmentRequest,
} from '../types/appointment';
import type { ApiResponse, PaginatedResponse, SpringPage } from '../../../types/common';

export interface AppointmentRecord {
  id: number;
  animal?: {
    id: number;
    name: string;
  };
  dateTime: string;
  subject?: string;
  veterinarianId?: number;
  veterinarianName?: string;
  owner?: {
    id: number;
    name: string;
  };
  googleCalendarEventId?: string;
  googleCalendarSynced?: boolean;
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
  static async getAllAppointments(): Promise<ApiResponse<AppointmentRecord[]>> {
    return apiClient.get(API_ENDPOINTS.APPOINTMENTS);
  }

  // Get all appointments with pagination
  static async getAppointments(
    page: number = 0,
    limit: number = 10,
    status?: string,
    veterinarianId?: string
  ): Promise<ApiResponse<PaginatedResponse<AppointmentRecord>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: limit.toString(),
      limit: limit.toString(),
      ...(status && { status }),
      ...(veterinarianId && { veterinarianId }),
    });

    const response = await apiClient.get<SpringPage<AppointmentRecord>>(`${API_ENDPOINTS.APPOINTMENTS_PAGED}?${params}`);

    if (!response.success || !response.data) {
      return {
        ...response,
        data: emptyPage<AppointmentRecord>(page, limit),
      };
    }

    return {
      ...response,
      data: normalizeSpringPage(response.data),
    };
  }

  // Get basic appointments list for dropdowns
  static async getBasicAppointments(): Promise<ApiResponse<any[]>> {
    return apiClient.get(API_ENDPOINTS.APPOINTMENTS_BASIC);
  }

  // Get appointment by ID
  static async getAppointmentById(id: string): Promise<ApiResponse<AppointmentRecord>> {
    return apiClient.get(`${API_ENDPOINTS.APPOINTMENTS}/${id}`);
  }

  // Create new appointment
  static async createAppointment(appointment: CreateAppointmentRequest): Promise<ApiResponse<AppointmentRecord>> {
    const payload: Record<string, unknown> = {
      animalId: appointment.animalId,
      dateTime: appointment.dateTime,
    };

    if (appointment.subject) {
      payload.subject = appointment.subject;
    }

    if (typeof appointment.veterinarianId === 'number') {
      payload.veterinarianId = appointment.veterinarianId;
    }

    return apiClient.post(API_ENDPOINTS.APPOINTMENTS, payload);
  }

  // Update appointment
  static async updateAppointment(id: string, appointment: Partial<Appointment>): Promise<ApiResponse<AppointmentRecord>> {
    return apiClient.put(`${API_ENDPOINTS.APPOINTMENTS}/${id}`, appointment);
  }

  // Delete appointment
  static async deleteAppointment(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${API_ENDPOINTS.APPOINTMENTS}/${id}`);
  }

  // Get available slots
  static async getAvailableSlots(
    date: Date,
    veterinarianId?: string
  ): Promise<ApiResponse<AppointmentSlot[]>> {
    const params = new URLSearchParams({
      date: date.toISOString().split('T')[0],
      ...(veterinarianId && { veterinarianId }),
    });

    return apiClient.get(`${API_ENDPOINTS.APPOINTMENTS}/slots?${params}`);
  }

  // Cancel appointment
  static async cancelAppointment(id: string, reason?: string): Promise<ApiResponse<AppointmentRecord>> {
    return apiClient.patch(`${API_ENDPOINTS.APPOINTMENTS}/${id}/cancel`, { reason });
  }

  // Complete appointment
  static async completeAppointment(id: string, notes?: string): Promise<ApiResponse<AppointmentRecord>> {
    return apiClient.patch(`${API_ENDPOINTS.APPOINTMENTS}/${id}/complete`, { notes });
  }

  // Get appointments by animal
  static async getAppointmentsByAnimal(animalId: string): Promise<ApiResponse<AppointmentRecord[]>> {
    return apiClient.get(`${API_ENDPOINTS.APPOINTMENTS}/animal/${animalId}`);
  }

  // Get appointments by date range
  static async getAppointmentsByDateRange(
    startDate: Date,
    endDate: Date,
    veterinarianId?: string
  ): Promise<ApiResponse<AppointmentRecord[]>> {
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      ...(veterinarianId && { veterinarianId }),
    });

    return apiClient.get(`${API_ENDPOINTS.APPOINTMENTS_DATE_RANGE}?${params}`);
  }

  // Get appointments by animal ID
  static async getAppointmentsByAnimalId(animalId: string): Promise<ApiResponse<AppointmentRecord[]>> {
    return apiClient.get(`${API_ENDPOINTS.APPOINTMENTS}/animal/${animalId}`);
  }

  // Get appointments by veterinarian ID
  static async getAppointmentsByVeterinarianId(veterinarianId: string): Promise<ApiResponse<AppointmentRecord[]>> {
    return apiClient.get(`${API_ENDPOINTS.APPOINTMENTS}/veterinarian/${veterinarianId}`);
  }

  // Get appointments by owner ID
  static async getAppointmentsByOwnerId(ownerId: string): Promise<ApiResponse<AppointmentRecord[]>> {
    return apiClient.get(`${API_ENDPOINTS.APPOINTMENTS}/owner/${ownerId}`);
  }

  // Get appointments by specific date
  static async getAppointmentsByDate(date: Date): Promise<ApiResponse<AppointmentRecord[]>> {
    const dateStr = date.toISOString().split('T')[0];
    return apiClient.get(`${API_ENDPOINTS.APPOINTMENTS}/date/${dateStr}`);
  }

  // Get today's appointments
  static async getTodayAppointments(): Promise<ApiResponse<AppointmentRecord[]>> {
    return apiClient.get(API_ENDPOINTS.APPOINTMENTS_TODAY);
  }

  // Get upcoming appointments
  static async getUpcomingAppointments(): Promise<ApiResponse<AppointmentRecord[]>> {
    return apiClient.get(API_ENDPOINTS.APPOINTMENTS_UPCOMING);
  }

  // Search appointments by subject
  static async searchAppointmentsBySubject(subject: string): Promise<ApiResponse<AppointmentRecord[]>> {
    return apiClient.get(`${API_ENDPOINTS.APPOINTMENTS_SEARCH_SUBJECT}?subject=${encodeURIComponent(subject)}`);
  }

  // Search appointments by animal name
  static async searchAppointmentsByAnimalName(animalName: string): Promise<ApiResponse<AppointmentRecord[]>> {
    return apiClient.get(`${API_ENDPOINTS.APPOINTMENTS_SEARCH_ANIMAL}?animalName=${encodeURIComponent(animalName)}`);
  }

  // Search appointments by owner name
  static async searchAppointmentsByOwnerName(ownerName: string): Promise<ApiResponse<AppointmentRecord[]>> {
    return apiClient.get(`${API_ENDPOINTS.APPOINTMENTS_SEARCH_OWNER}?ownerName=${encodeURIComponent(ownerName)}`);
  }

  // Get calendar appointments
  static async getCalendarAppointments(
    startDate: Date,
    endDate: Date
  ): Promise<ApiResponse<CalendarAppointmentPayload[]>> {
    const toApiDateTime = (value: Date): string => value.toISOString().split('.')[0];
    const params = new URLSearchParams({
      startDate: toApiDateTime(startDate),
      endDate: toApiDateTime(endDate),
    });

    return apiClient.get(`${API_ENDPOINTS.APPOINTMENTS_CALENDAR}?${params}`);
  }
}
