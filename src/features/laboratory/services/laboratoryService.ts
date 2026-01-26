import { apiClient } from '../../../services/api';
import { API_ENDPOINTS } from '../../../constants';
import type { LabTest, TestType, CreateLabTestRequest } from '../types/laboratory';
import type { ApiResponse, PaginatedResponse, SpringPage } from '../../../types/common';

export class LaboratoryService {
  // Get all lab tests with pagination
  static async getLabTests(
    page: number = 1,
    limit: number = 10,
    status?: string,
    category?: string
  ): Promise<ApiResponse<SpringPage<LabTest>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
      ...(category && { category }),
    });

    return apiClient.get(`${API_ENDPOINTS.LAB_TESTS}?${params}`);
  }

  // Get lab statistics
  static async getStatistics(): Promise<ApiResponse<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    today: number;
  }>> {
    return apiClient.get(`${API_ENDPOINTS.LAB_TESTS}/stats`);
  }

  // Get lab test by ID
  static async getLabTestById(id: string): Promise<ApiResponse<LabTest>> {
    return apiClient.get(`${API_ENDPOINTS.LAB_TESTS}/${id}`);
  }

  // Create new lab test
  static async createLabTest(test: CreateLabTestRequest): Promise<ApiResponse<LabTest>> {
    return apiClient.post(API_ENDPOINTS.LAB_TESTS, test);
  }

  // Update lab test
  static async updateLabTest(id: string, test: Partial<LabTest>): Promise<ApiResponse<LabTest>> {
    return apiClient.put(`${API_ENDPOINTS.LAB_TESTS}/${id}`, test);
  }

  // Delete lab test
  static async deleteLabTest(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${API_ENDPOINTS.LAB_TESTS}/${id}`);
  }

  // Get test types
  static async getTestTypes(): Promise<ApiResponse<TestType[]>> {
    return apiClient.get(`${API_ENDPOINTS.LAB_TESTS}/test-types`);
  }

  // Get test type by ID
  static async getTestTypeById(id: string): Promise<ApiResponse<TestType>> {
    return apiClient.get(`${API_ENDPOINTS.LAB_TESTS}/test-types/${id}`);
  }

  // Get lab tests by animal
  static async getLabTestsByAnimal(animalId: string): Promise<ApiResponse<LabTest[]>> {
    return apiClient.get(`${API_ENDPOINTS.LAB_TESTS}/animal/${animalId}`);
  }

  // Update test results
  static async updateTestResults(id: string, results: any[]): Promise<ApiResponse<LabTest>> {
    return apiClient.patch(`${API_ENDPOINTS.LAB_TESTS}/${id}/results`, { results });
  }

  // Upload test result file
  static async uploadTestResult(id: string, formData: FormData): Promise<ApiResponse<LabTest>> {
    return apiClient.post(`${API_ENDPOINTS.LAB_TESTS}/${id}/results`, formData);
  }

  // Complete lab test
  static async completeLabTest(id: string, results: any[], notes?: string): Promise<ApiResponse<LabTest>> {
    return apiClient.patch(`${API_ENDPOINTS.LAB_TESTS}/${id}/complete`, { results, notes });
  }

  // Cancel lab test
  static async cancelLabTest(id: string, reason?: string): Promise<ApiResponse<LabTest>> {
    return apiClient.patch(`${API_ENDPOINTS.LAB_TESTS}/${id}/cancel`, { reason });
  }

  // Get urgent tests
  static async getUrgentTests(): Promise<ApiResponse<LabTest[]>> {
    return apiClient.get(`${API_ENDPOINTS.LAB_TESTS}/urgent`);
  }

  // Get pending tests
  static async getPendingTests(): Promise<ApiResponse<LabTest[]>> {
    return apiClient.get(`${API_ENDPOINTS.LAB_TESTS}/pending`);
  }

  // Get lab results
  static async getLabResults(filters?: any): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();

    if (filters?.animalId) {
      params.append('animalId', filters.animalId);
    }

    if (filters?.testType) {
      params.append('testType', filters.testType);
    }

    return apiClient.get(`${API_ENDPOINTS.LAB_RESULTS}${params.toString() ? '?' + params.toString() : ''}`);
  }

  // Create lab result
  static async createLabResult(resultData: any): Promise<ApiResponse<any>> {
    return apiClient.post(API_ENDPOINTS.LAB_RESULTS, resultData);
  }

  // Get signed URL from backend
  static async getSignedUrl(filePath: string): Promise<ApiResponse<{ signedUrl: string; expirationTime: string }>> {
    return apiClient.get(`${API_ENDPOINTS.FILES}/signed-url?filePath=${encodeURIComponent(filePath)}`);
  }

  // Helper to get view/download URL for a file path (Deprecated - use getSignedUrl for secure access)
  static getViewFileUrl(filePath: string): string {
    // If it's a full URL (http/https), return as is
    if (filePath.startsWith('http')) return filePath;
    return `${API_ENDPOINTS.FILES}/view?filePath=${encodeURIComponent(filePath)}`;
  }
} 