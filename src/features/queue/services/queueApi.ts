import apiClient from '../../../services/api';
import type { ApiResponse } from '../../../types/common';
import type {
  QueueEntry,
  QueueCheckInRequest,
  QueueStatusUpdateRequest,
  QueueAssignmentRequest,
  WaitTimeResponse,
} from '../types/queue.types';

const QUEUE_BASE = '/api/queue';

export const queueApi = {
  /**
   * Check in a patient with existing appointment
   */
  checkInWithAppointment: async (appointmentId: number): Promise<ApiResponse<QueueEntry>> => {
    return apiClient.post<QueueEntry>(`${QUEUE_BASE}/check-in/appointment/${appointmentId}`);
  },

  /**
   * Check in a walk-in patient
   */
  walkInCheckIn: async (request: QueueCheckInRequest): Promise<ApiResponse<QueueEntry>> => {
    return apiClient.post<QueueEntry>(`${QUEUE_BASE}/check-in/walk-in`, request);
  },

  /**
   * Get today's complete queue
   */
  getTodayQueue: async (): Promise<ApiResponse<QueueEntry[]>> => {
    return apiClient.get<QueueEntry[]>(`${QUEUE_BASE}/today`, undefined, false); // Don't cache - need real-time data
  },

  /**
   * Get active queue (waiting + in progress)
   */
  getActiveQueue: async (): Promise<ApiResponse<QueueEntry[]>> => {
    return apiClient.get<QueueEntry[]>(`${QUEUE_BASE}/active`, undefined, false); // Don't cache
  },

  /**
   * Update queue entry status
   */
  updateStatus: async (queueEntryId: number, status: QueueStatusUpdateRequest): Promise<ApiResponse<QueueEntry>> => {
    return apiClient.put<QueueEntry>(`${QUEUE_BASE}/${queueEntryId}/status`, status);
  },

  /**
   * Assign veterinarian and room to queue entry
   */
  assignVeterinarian: async (queueEntryId: number, assignment: QueueAssignmentRequest): Promise<ApiResponse<QueueEntry>> => {
    return apiClient.put<QueueEntry>(`${QUEUE_BASE}/${queueEntryId}/assign`, assignment);
  },

  /**
   * Get next patient for veterinarian
   */
  getNextPatient: async (veterinarianId: number): Promise<ApiResponse<QueueEntry | null>> => {
    return apiClient.get<QueueEntry | null>(`${QUEUE_BASE}/next/${veterinarianId}`);
  },

  /**
   * Get estimated wait time for a queue entry
   */
  getWaitTime: async (queueEntryId: number): Promise<ApiResponse<WaitTimeResponse>> => {
    return apiClient.get<WaitTimeResponse>(`${QUEUE_BASE}/${queueEntryId}/wait-time`, undefined, false);
  },
};

export default queueApi;
