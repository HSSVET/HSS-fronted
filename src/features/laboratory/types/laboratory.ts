
export type TestStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type TestCategory = 'blood' | 'urine' | 'xray' | 'ultrasound' | 'biopsy' | 'other';

export interface LabResult {
  resultId: number;
  testId: number;
  result: string;
  value?: string;
  unit?: string;
  normalRange?: string;
  interpretation?: string;
  fileUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LabTest {
  testId: number;
  animalId: number;
  animalName: string;
  testName: string;
  date: string;
  status: TestStatus;
  results?: LabResult[];
  createdAt?: string;
  updatedAt?: string;

  // Backwards compatibility or optional fields if needed by UI but not in main response
  veterinarianName?: string;
  category?: TestCategory;
  urgent?: boolean;
}

// Deprecated or mapped types
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