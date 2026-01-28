// Queue Entry Types
export interface QueueEntry {
  queueEntryId: number;
  clinicId: number;
  appointmentId?: number;
  animalId: number;
  animalName: string;
  ownerName: string;
  queueNumber: number;
  status: QueueStatus;
  priority: QueuePriority;
  checkInTime: string; // ISO string
  estimatedStartTime?: string; // ISO string
  estimatedWaitMinutes: number;
  assignedVeterinarianId?: number;
  assignedVeterinarianName?: string;
  assignedRoom?: string;
  notes?: string;
}

export type QueueStatus = 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
export type QueuePriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' | 'EMERGENCY';
export type AppointmentType = 'GENERAL_EXAM' | 'VACCINATION' | 'SURGERY' | 'FOLLOW_UP' | 'EMERGENCY' | 'LAB_RESULTS';

// Request Types
export interface QueueCheckInRequest {
  appointmentId?: number; // For scheduled appointments
  animalId?: number; // For walk-ins
  appointmentType?: AppointmentType;
  priority?: QueuePriority;
  notes?: string;
}

export interface QueueStatusUpdateRequest {
  status: QueueStatus;
}

export interface QueueAssignmentRequest {
  veterinarianId: number;
  room?: string;
}

// Response Types
export interface WaitTimeResponse {
  estimatedWaitMinutes: number;
}
