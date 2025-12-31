export interface SurgeryMedication {
  id?: number;
  medicineId: number;
  quantity: number;
}

export interface Surgery {
  surgeryId: number;
  animalId: number;
  animalName?: string;
  veterinarianId?: number;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startDate?: string; // ISO DateTime
  endDate?: string;   // ISO DateTime
  description?: string;
  preOpInstructions?: string;
  postOpInstructions?: string;
  anesthesiaProtocol?: string;
  complications?: string;
  medications: SurgeryMedication[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSurgeryRequest {
  animalId: number;
  veterinarianId?: number;
  description: string;
  startDate?: string;
}

export interface SurgeryMedicationRequest {
  medicineId: number;
  quantity: number;
}
