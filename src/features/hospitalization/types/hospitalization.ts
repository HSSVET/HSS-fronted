export interface HospitalizationLog {
  logId?: number;
  logTime: string; // ISO DateTime
  notes: string;
  temperature?: number;
  heartRate?: number;
  respiratoryRate?: number;
  treatmentGiven?: string;
  performedBy?: string;
}

export interface Hospitalization {
  hospitalizationId: number;
  animalId: number;
  animalName?: string;
  admissionDate: string; // ISO DateTime
  dischargeDate?: string; // ISO DateTime
  status: 'ACTIVE' | 'DISCHARGED' | 'CANCELLED';
  diagnosis: string;
  carePlan: string;
  cageNumber?: string;
  logs: HospitalizationLog[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AdmitPatientRequest {
  animalId: number;
  diagnosis: string;
  carePlan: string;
  cageNumber?: string;
}

export interface AddLogRequest {
  notes: string;
  temperature?: number;
  heartRate?: number;
  respiratoryRate?: number;
  treatmentGiven?: string;
}
