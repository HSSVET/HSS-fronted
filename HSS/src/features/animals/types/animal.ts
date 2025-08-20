import { BaseEntity, Status } from '../../../types/common';

export type AnimalSpecies = 'Köpek' | 'Kedi' | 'Kuş' | 'Tavşan' | 'Hamster' | 'İnek' | 'Diğer';

export type AnimalGender = 'Erkek' | 'Dişi';

export type HealthStatus = 'İyi' | 'Tedavi Altında' | 'Kontrol Gerekli' | 'Kritik';

// Temporary interface for the list view (simplified)
export interface AnimalListItem {
  id: string;
  name: string;
  species: AnimalSpecies;
  breed?: string;
  health: HealthStatus;
  lastCheckup: string;
  owner: string;
  nextVaccine: string;
}

export interface Animal extends BaseEntity {
  name: string;
  species: AnimalSpecies;
  breed?: string;
  age: number;
  gender: AnimalGender;
  weight?: number;
  color?: string;
  owner: AnimalOwner;
  medicalHistory?: MedicalRecord[];
  status: Status;
  notes?: string;
  microchipId?: string;
  vaccinations?: Vaccination[];
  // Additional fields for backward compatibility
  health?: HealthStatus;
  lastCheckup?: string;
  nextVaccine?: string;
}

export interface AnimalOwner {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  emergencyContact?: string;
}

export interface MedicalRecord extends BaseEntity {
  animalId: string;
  veterinarianId: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
  date: Date;
  nextAppointment?: Date;
}

export interface Vaccination extends BaseEntity {
  animalId: string;
  vaccineName: string;
  date: Date;
  nextDueDate?: Date;
  veterinarianId: string;
  batchNumber?: string;
  notes?: string;
} 