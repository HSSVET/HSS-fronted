import { BaseEntity } from '../../../types/common';

export type AppointmentStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export type AppointmentType = 'checkup' | 'vaccination' | 'surgery' | 'emergency' | 'consultation';

export interface Appointment extends BaseEntity {
  animalId: string;
  animalName: string;
  ownerName: string;
  ownerPhone: string;
  veterinarianId: string;
  veterinarianName: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: AppointmentType;
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  estimatedDuration: number; // in minutes
  actualDuration?: number; // in minutes
  cost?: number;
  paid?: boolean;
}

export interface AppointmentSlot {
  date: Date;
  startTime: string;
  endTime: string;
  available: boolean;
  veterinarianId?: string;
}

export interface CreateAppointmentRequest {
  animalId: number;
  dateTime: string;
  subject?: string;
  veterinarianId?: number;
}

// Temporary interface for backward compatibility with existing forms
export interface LegacyAppointment {
  id: string;
  date: string;
  time: string;
  patientName: string;
  patientId: string;
  phone: string;
  ownerName: string;
  chipNumber: string;
  breed: string;
  petType: string;
  description: string;
}

// Extended appointment interface for form usage
export interface AppointmentFormData {
  time: string;
  patientName: string;
  patientId: string;
  phone: string;
  ownerName: string;
  chipNumber: string;
  breed: string;
  petType: string;
  description: string;
}

export interface CalendarAppointmentMeta {
  animalName?: string;
  ownerName?: string;
  veterinarianName?: string;
  speciesName?: string;
  subject?: string;
}

export interface CalendarAppointment {
  id?: number;
  title?: string;
  start: string;
  end?: string;
  backgroundColor?: string;
  textColor?: string;
  extendedProps?: CalendarAppointmentMeta;
}

export interface CalendarAppointmentResponse {
  id: number;
  animal?: {
    id: number;
    name: string;
    ownerName?: string;
    speciesName?: string;
    breedName?: string;
    microchipNumber?: string;
  };
  dateTime: string;
  subject?: string;
  veterinarianId?: number;
  veterinarianName?: string;
  owner?: {
    id: number;
    fullName: string;
    phone?: string;
    email?: string;
  };
  googleCalendarEventId?: string | null;
  googleCalendarSynced?: boolean;
}

export type CalendarAppointmentPayload = CalendarAppointment | CalendarAppointmentResponse;
