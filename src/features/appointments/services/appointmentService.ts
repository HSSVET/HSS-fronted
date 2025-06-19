import { apiClient } from '../../../services/api';
import { API_ENDPOINTS } from '../../../constants';
import type { Appointment, AppointmentSlot, CreateAppointmentRequest } from '../types/appointment';
import type { ApiResponse, PaginatedResponse } from '../../../types/common';

export class AppointmentService {
  // Get all appointments with pagination
  static async getAppointments(
    page: number = 1,
    limit: number = 10,
    status?: string,
    veterinarianId?: string
  ): Promise<ApiResponse<PaginatedResponse<Appointment>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
      ...(veterinarianId && { veterinarianId }),
    });

    return apiClient.get(`${API_ENDPOINTS.APPOINTMENTS}?${params}`);
  }

  // Get appointment by ID
  static async getAppointmentById(id: string): Promise<ApiResponse<Appointment>> {
    return apiClient.get(`${API_ENDPOINTS.APPOINTMENTS}/${id}`);
  }

  // Create new appointment
  static async createAppointment(appointment: CreateAppointmentRequest): Promise<ApiResponse<Appointment>> {
    return apiClient.post(API_ENDPOINTS.APPOINTMENTS, appointment);
  }

  // Update appointment
  static async updateAppointment(id: string, appointment: Partial<Appointment>): Promise<ApiResponse<Appointment>> {
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
  static async cancelAppointment(id: string, reason?: string): Promise<ApiResponse<Appointment>> {
    return apiClient.patch(`${API_ENDPOINTS.APPOINTMENTS}/${id}/cancel`, { reason });
  }

  // Complete appointment
  static async completeAppointment(id: string, notes?: string): Promise<ApiResponse<Appointment>> {
    return apiClient.patch(`${API_ENDPOINTS.APPOINTMENTS}/${id}/complete`, { notes });
  }

  // Get appointments by animal
  static async getAppointmentsByAnimal(animalId: string): Promise<ApiResponse<Appointment[]>> {
    return apiClient.get(`${API_ENDPOINTS.APPOINTMENTS}/animal/${animalId}`);
  }

  // Get appointments by date range
  static async getAppointmentsByDateRange(
    startDate: Date,
    endDate: Date,
    veterinarianId?: string
  ): Promise<ApiResponse<Appointment[]>> {
    const params = new URLSearchParams({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      ...(veterinarianId && { veterinarianId }),
    });

    return apiClient.get(`${API_ENDPOINTS.APPOINTMENTS}/range?${params}`);
  }
} 