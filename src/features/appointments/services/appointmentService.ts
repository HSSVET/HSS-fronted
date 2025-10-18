import { ServiceFactory } from '../../../services/mockServiceFactory';
import type { ApiResponse, PaginatedResponse, SpringPage } from '../../../types/common';
import type {
  Appointment,
  AppointmentSlot,
  CalendarAppointmentPayload,
  CreateAppointmentRequest,
} from '../types/appointment';

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
    const service = ServiceFactory.getAppointmentService();
    return service.getAllAppointments();
  }

  // Get all appointments with pagination
  static async getAppointments(
    page: number = 0,
    limit: number = 10,
    status?: string,
    veterinarianId?: string
  ): Promise<ApiResponse<PaginatedResponse<AppointmentRecord>>> {
    const service = ServiceFactory.getAppointmentService();
    return service.getAppointments(page, limit, status, veterinarianId);
  }

  // Get basic appointments list for dropdowns
  static async getBasicAppointments(): Promise<ApiResponse<any[]>> {
    const service = ServiceFactory.getAppointmentService();
    return service.getBasicAppointments();
  }

  // Get appointment by ID
  static async getAppointmentById(id: string): Promise<ApiResponse<AppointmentRecord>> {
    const service = ServiceFactory.getAppointmentService();
    return service.getAppointmentById(id);
  }

  // Create new appointment
  static async createAppointment(appointment: CreateAppointmentRequest): Promise<ApiResponse<AppointmentRecord>> {
    const service = ServiceFactory.getAppointmentService();
    return service.createAppointment(appointment);
  }

  // Update appointment
  static async updateAppointment(id: string, appointment: Partial<Appointment>): Promise<ApiResponse<AppointmentRecord>> {
    const service = ServiceFactory.getAppointmentService();
    return service.updateAppointment(id, appointment);
  }

  // Delete appointment
  static async deleteAppointment(id: string): Promise<ApiResponse<void>> {
    const service = ServiceFactory.getAppointmentService();
    return service.deleteAppointment(id);
  }

  // Get available slots
  static async getAvailableSlots(
    date: Date,
    veterinarianId?: string
  ): Promise<ApiResponse<AppointmentSlot[]>> {
    const service = ServiceFactory.getAppointmentService();
    return service.getAvailableSlots(date, veterinarianId);
  }

  // Cancel appointment
  static async cancelAppointment(id: string, reason?: string): Promise<ApiResponse<AppointmentRecord>> {
    const service = ServiceFactory.getAppointmentService();
    return service.cancelAppointment(id, reason);
  }

  // Complete appointment
  static async completeAppointment(id: string, notes?: string): Promise<ApiResponse<AppointmentRecord>> {
    const service = ServiceFactory.getAppointmentService();
    return service.completeAppointment(id, notes);
  }

  // Get appointments by animal
  static async getAppointmentsByAnimal(animalId: string): Promise<ApiResponse<AppointmentRecord[]>> {
    const service = ServiceFactory.getAppointmentService();
    return service.getAppointmentsByAnimal(animalId);
  }

  // Get appointments by date range
  static async getAppointmentsByDateRange(
    startDate: Date,
    endDate: Date,
    veterinarianId?: string
  ): Promise<ApiResponse<AppointmentRecord[]>> {
    const service = ServiceFactory.getAppointmentService();
    return service.getAppointmentsByDateRange(startDate, endDate, veterinarianId);
  }

  // Get appointments by animal ID
  static async getAppointmentsByAnimalId(animalId: string): Promise<ApiResponse<AppointmentRecord[]>> {
    const service = ServiceFactory.getAppointmentService();
    return service.getAppointmentsByAnimalId(animalId);
  }

  // Get appointments by veterinarian ID
  static async getAppointmentsByVeterinarianId(veterinarianId: string): Promise<ApiResponse<AppointmentRecord[]>> {
    const service = ServiceFactory.getAppointmentService();
    return service.getAppointmentsByVeterinarianId(veterinarianId);
  }

  // Get appointments by owner ID
  static async getAppointmentsByOwnerId(ownerId: string): Promise<ApiResponse<AppointmentRecord[]>> {
    const service = ServiceFactory.getAppointmentService();
    return service.getAppointmentsByOwnerId(ownerId);
  }

  // Get appointments by specific date
  static async getAppointmentsByDate(date: Date): Promise<ApiResponse<AppointmentRecord[]>> {
    const service = ServiceFactory.getAppointmentService();
    return service.getAppointmentsByDate(date);
  }

  // Get today's appointments
  static async getTodayAppointments(): Promise<ApiResponse<AppointmentRecord[]>> {
    const service = ServiceFactory.getAppointmentService();
    return service.getTodayAppointments();
  }

  // Get upcoming appointments
  static async getUpcomingAppointments(): Promise<ApiResponse<AppointmentRecord[]>> {
    const service = ServiceFactory.getAppointmentService();
    return service.getUpcomingAppointments();
  }

  // Search appointments by subject
  static async searchAppointmentsBySubject(subject: string): Promise<ApiResponse<AppointmentRecord[]>> {
    const service = ServiceFactory.getAppointmentService();
    return service.searchAppointmentsBySubject(subject);
  }

  // Search appointments by animal name
  static async searchAppointmentsByAnimalName(animalName: string): Promise<ApiResponse<AppointmentRecord[]>> {
    const service = ServiceFactory.getAppointmentService();
    return service.searchAppointmentsByAnimalName(animalName);
  }

  // Search appointments by owner name
  static async searchAppointmentsByOwnerName(ownerName: string): Promise<ApiResponse<AppointmentRecord[]>> {
    const service = ServiceFactory.getAppointmentService();
    return service.searchAppointmentsByOwnerName(ownerName);
  }

  // Get calendar appointments
  static async getCalendarAppointments(
    startDate: Date,
    endDate: Date
  ): Promise<ApiResponse<CalendarAppointmentPayload[]>> {
    const service = ServiceFactory.getAppointmentService();
    return service.getCalendarAppointments(startDate, endDate);
  }
}
