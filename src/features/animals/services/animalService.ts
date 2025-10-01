import { apiClient } from '../../../services/api';
import { API_ENDPOINTS } from '../../../constants';
import type { Animal, MedicalRecord, Vaccination } from '../types/animal';
import type { ApiResponse, PaginatedResponse, SpringPage } from '../../../types/common';

export interface AnimalRecord {
  id: number;
  name: string;
  owner?: {
    id: number;
    name: string;
    fullName?: string;
    phone?: string;
    email?: string;
  };
  species?: {
    id: number;
    name: string;
  };
  breed?: {
    id: number;
    name: string;
  };
  gender?: string;
  birthDate?: string;
  ageInYears?: number;
  weight?: number;
  color?: string;
  microchipNumber?: string;
  allergies?: string;
  chronicDiseases?: string;
  notes?: string;
  lastVaccinationDate?: string;
  lastVaccinationName?: string;
  nextVaccinationDate?: string;
  nextVaccinationName?: string;
  visitCount?: number;
  lastVisitDate?: string;
  primaryVeterinarianId?: number;
  primaryVeterinarianName?: string;
  hasChronicDiseases?: boolean;
  hasAllergies?: boolean;
}

export interface BasicAnimalRecord {
  id: number;
  name: string;
  ownerName?: string;
  speciesName?: string;
  breedName?: string;
  microchipNumber?: string;
}

const normalizeSpringPage = <T>(page: SpringPage<T>): PaginatedResponse<T> => ({
  items: page.content,
  total: page.totalElements,
  page: page.number,
  limit: page.size,
  totalPages: page.totalPages,
});

const emptyPage = <T>(page: number, limit: number): PaginatedResponse<T> => ({
  items: [],
  total: 0,
  page,
  limit,
  totalPages: 0,
});

export class AnimalService {
  // Get all animals
  static async getAllAnimals(): Promise<ApiResponse<AnimalRecord[]>> {
    return apiClient.get(API_ENDPOINTS.ANIMALS);
  }

  // Get all animals with pagination
  static async getAnimals(
    page: number = 0,
    limit: number = 10,
    search?: string
  ): Promise<ApiResponse<PaginatedResponse<AnimalRecord>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });

    const response = await apiClient.get<SpringPage<AnimalRecord>>(`${API_ENDPOINTS.ANIMALS_PAGED}?${params}`);

    if (!response.success || !response.data) {
      return {
        ...response,
        data: emptyPage<AnimalRecord>(page, limit),
      };
    }

    return {
      ...response,
      data: normalizeSpringPage(response.data),
    };
  }

  // Get basic animals list for dropdowns
  static async getBasicAnimals(): Promise<ApiResponse<BasicAnimalRecord[]>> {
    return apiClient.get(API_ENDPOINTS.ANIMALS_BASIC);
  }

  // Get animal by ID
  static async getAnimalById(id: string): Promise<ApiResponse<AnimalRecord>> {
    return apiClient.get(`${API_ENDPOINTS.ANIMALS}/${id}`);
  }

  // Create new animal
  static async createAnimal(animal: Omit<Animal, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<AnimalRecord>> {
    return apiClient.post(API_ENDPOINTS.ANIMALS, animal);
  }

  // Update animal
  static async updateAnimal(id: string, animal: Partial<Animal>): Promise<ApiResponse<AnimalRecord>> {
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
  static async searchByOwner(ownerName: string): Promise<ApiResponse<AnimalRecord[]>> {
    return apiClient.get(`${API_ENDPOINTS.ANIMALS_SEARCH_OWNER}?ownerName=${encodeURIComponent(ownerName)}`);
  }

  // Search animals by name
  static async searchByName(name: string): Promise<ApiResponse<AnimalRecord[]>> {
    return apiClient.get(`${API_ENDPOINTS.ANIMALS_SEARCH_NAME}?name=${encodeURIComponent(name)}`);
  }

  // Search animals by microchip
  static async searchByMicrochip(microchip: string): Promise<ApiResponse<AnimalRecord[]>> {
    return apiClient.get(`${API_ENDPOINTS.ANIMALS_SEARCH_MICROCHIP}?microchip=${encodeURIComponent(microchip)}`);
  }

  // Get animal by microchip number
  static async getAnimalByMicrochip(microchipNumber: string): Promise<ApiResponse<AnimalRecord>> {
    return apiClient.get(`${API_ENDPOINTS.ANIMALS}/microchip/${microchipNumber}`);
  }

  // Get animals by owner ID
  static async getAnimalsByOwnerId(ownerId: string): Promise<ApiResponse<AnimalRecord[]>> {
    return apiClient.get(`${API_ENDPOINTS.ANIMALS}/owner/${ownerId}`);
  }

  // Get animals by species ID
  static async getAnimalsBySpeciesId(speciesId: string): Promise<ApiResponse<AnimalRecord[]>> {
    return apiClient.get(`${API_ENDPOINTS.ANIMALS}/species/${speciesId}`);
  }

  // Get animals by breed ID
  static async getAnimalsByBreedId(breedId: string): Promise<ApiResponse<AnimalRecord[]>> {
    return apiClient.get(`${API_ENDPOINTS.ANIMALS}/breed/${breedId}`);
  }

  // Get animals with allergies
  static async getAnimalsWithAllergies(): Promise<ApiResponse<AnimalRecord[]>> {
    return apiClient.get(API_ENDPOINTS.ANIMALS_WITH_ALLERGIES);
  }

  // Get animals with chronic diseases
  static async getAnimalsWithChronicDiseases(): Promise<ApiResponse<AnimalRecord[]>> {
    return apiClient.get(API_ENDPOINTS.ANIMALS_WITH_CHRONIC_DISEASES);
  }

  // Get animals with birthday today
  static async getAnimalsWithBirthdayToday(): Promise<ApiResponse<AnimalRecord[]>> {
    return apiClient.get(API_ENDPOINTS.ANIMALS_BIRTHDAY_TODAY);
  }

  // Get animals with birthday this month
  static async getAnimalsWithBirthdayThisMonth(): Promise<ApiResponse<AnimalRecord[]>> {
    return apiClient.get(API_ENDPOINTS.ANIMALS_BIRTHDAY_THIS_MONTH);
  }
}

// Legacy export for compatibility
export const animalService = AnimalService;
export default AnimalService;
