import { apiClient } from '../../../services/api';
import { API_ENDPOINTS } from '../../../constants';
import type { Animal, MedicalRecord, Vaccination } from '../types/animal';
import type { ApiResponse, PaginatedResponse } from '../../../types/common';

export class AnimalService {
  // Get all animals with pagination
  static async getAnimals(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<ApiResponse<PaginatedResponse<Animal>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });

    return apiClient.get(`${API_ENDPOINTS.ANIMALS}?${params}`);
  }

  // Get animal by ID
  static async getAnimalById(id: string): Promise<ApiResponse<Animal>> {
    return apiClient.get(`${API_ENDPOINTS.ANIMALS}/${id}`);
  }

  // Create new animal
  static async createAnimal(animal: Omit<Animal, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Animal>> {
    return apiClient.post(API_ENDPOINTS.ANIMALS, animal);
  }

  // Update animal
  static async updateAnimal(id: string, animal: Partial<Animal>): Promise<ApiResponse<Animal>> {
    return apiClient.put(`${API_ENDPOINTS.ANIMALS}/${id}`, animal);
  }

  // Delete animal
  static async deleteAnimal(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${API_ENDPOINTS.ANIMALS}/${id}`);
  }

  // Get animal medical history
  static async getMedicalHistory(animalId: string): Promise<ApiResponse<MedicalRecord[]>> {
    return apiClient.get(`${API_ENDPOINTS.ANIMALS}/${animalId}/medical-history`);
  }

  // Add medical record
  static async addMedicalRecord(
    animalId: string,
    record: Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt' | 'animalId'>
  ): Promise<ApiResponse<MedicalRecord>> {
    return apiClient.post(`${API_ENDPOINTS.ANIMALS}/${animalId}/medical-history`, record);
  }

  // Get animal vaccinations
  static async getVaccinations(animalId: string): Promise<ApiResponse<Vaccination[]>> {
    return apiClient.get(`${API_ENDPOINTS.ANIMALS}/${animalId}/vaccinations`);
  }

  // Add vaccination
  static async addVaccination(
    animalId: string,
    vaccination: Omit<Vaccination, 'id' | 'createdAt' | 'updatedAt' | 'animalId'>
  ): Promise<ApiResponse<Vaccination>> {
    return apiClient.post(`${API_ENDPOINTS.ANIMALS}/${animalId}/vaccinations`, vaccination);
  }

  // Search animals by owner
  static async searchByOwner(ownerName: string): Promise<ApiResponse<Animal[]>> {
    return apiClient.get(`${API_ENDPOINTS.ANIMALS}/search/owner?name=${encodeURIComponent(ownerName)}`);
  }
} 