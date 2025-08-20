import { BaseEntity } from '../../../types/common';

export type TestStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export type TestCategory = 'blood' | 'urine' | 'xray' | 'ultrasound' | 'biopsy' | 'other';

export interface LabTest extends BaseEntity {
  animalId: string;
  animalName: string;
  veterinarianId: string;
  veterinarianName: string;
  testType: string;
  category: TestCategory;
  status: TestStatus;
  requestDate: Date;
  completionDate?: Date;
  results?: TestResult[];
  notes?: string;
  cost?: number;
  urgent: boolean;
}

export interface TestResult {
  parameter: string;
  value: string | number;
  unit?: string;
  referenceRange?: string;
  status: 'normal' | 'high' | 'low' | 'critical';
  notes?: string;
}

export interface TestType {
  id: string;
  name: string;
  category: TestCategory;
  parameters: TestParameter[];
  estimatedDuration: number; // in hours
  cost: number;
  requiresFasting: boolean;
  instructions?: string;
}

export interface TestParameter {
  name: string;
  unit?: string;
  referenceRange?: string;
  dataType: 'number' | 'text' | 'boolean';
}

export interface CreateLabTestRequest {
  animalId: string;
  veterinarianId: string;
  testTypeIds: string[];
  notes?: string;
  urgent?: boolean;
} 