import { apiClient } from '../../../services/api';
import { API_ENDPOINTS } from '../../../constants';
import type { LabTest, TestType, CreateLabTestRequest } from '../types/laboratory';
import type { ApiResponse, PaginatedResponse } from '../../../types/common';

export class LaboratoryService {
  // Get all lab tests with pagination
  static async getLabTests(
    page: number = 1,
    limit: number = 10,
    status?: string,
    category?: string
  ): Promise<ApiResponse<PaginatedResponse<LabTest>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
      ...(category && { category }),
    });

    return apiClient.get(`${API_ENDPOINTS.LABORATORY}?${params}`);
  }

  // Get lab test by ID
  static async getLabTestById(id: string): Promise<ApiResponse<LabTest>> {
    return apiClient.get(`${API_ENDPOINTS.LABORATORY}/${id}`);
  }

  // Create new lab test
  static async createLabTest(test: CreateLabTestRequest): Promise<ApiResponse<LabTest>> {
    return apiClient.post(API_ENDPOINTS.LABORATORY, test);
  }

  // Update lab test
  static async updateLabTest(id: string, test: Partial<LabTest>): Promise<ApiResponse<LabTest>> {
    return apiClient.put(`${API_ENDPOINTS.LABORATORY}/${id}`, test);
  }

  // Delete lab test
  static async deleteLabTest(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${API_ENDPOINTS.LABORATORY}/${id}`);
  }

  // Get test types
  static async getTestTypes(): Promise<ApiResponse<TestType[]>> {
    return apiClient.get(`${API_ENDPOINTS.LABORATORY}/test-types`);
  }

  // Get test type by ID
  static async getTestTypeById(id: string): Promise<ApiResponse<TestType>> {
    return apiClient.get(`${API_ENDPOINTS.LABORATORY}/test-types/${id}`);
  }

  // Get lab tests by animal
  static async getLabTestsByAnimal(animalId: string): Promise<ApiResponse<LabTest[]>> {
    return apiClient.get(`${API_ENDPOINTS.LABORATORY}/animal/${animalId}`);
  }

  // Update test results
  static async updateTestResults(id: string, results: any[]): Promise<ApiResponse<LabTest>> {
    return apiClient.patch(`${API_ENDPOINTS.LABORATORY}/${id}/results`, { results });
  }

  // Complete lab test
  static async completeLabTest(id: string, results: any[], notes?: string): Promise<ApiResponse<LabTest>> {
    return apiClient.patch(`${API_ENDPOINTS.LABORATORY}/${id}/complete`, { results, notes });
  }

  // Cancel lab test
  static async cancelLabTest(id: string, reason?: string): Promise<ApiResponse<LabTest>> {
    return apiClient.patch(`${API_ENDPOINTS.LABORATORY}/${id}/cancel`, { reason });
  }

  // Get urgent tests
  static async getUrgentTests(): Promise<ApiResponse<LabTest[]>> {
    return apiClient.get(`${API_ENDPOINTS.LABORATORY}/urgent`);
  }

  // Get pending tests
  static async getPendingTests(): Promise<ApiResponse<LabTest[]>> {
    return apiClient.get(`${API_ENDPOINTS.LABORATORY}/pending`);
  }
} 