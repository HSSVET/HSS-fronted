import { ServiceFactory } from '../../../services/mockServiceFactory';
import type { ApiResponse, PaginatedResponse, SpringPage } from '../../../types/common';
import type { Animal, MedicalRecord, Vaccination } from '../types/animal';

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
    const service = ServiceFactory.getAnimalService();
    return service.getAllAnimals();
  }

  // Get all animals with pagination
  static async getAnimals(
    page: number = 0,
    limit: number = 10,
    search?: string
  ): Promise<ApiResponse<PaginatedResponse<AnimalRecord>>> {
    const service = ServiceFactory.getAnimalService();
    return service.getAnimals(page, limit, search);
  }

  // Get basic animals list for dropdowns
  static async getBasicAnimals(): Promise<ApiResponse<BasicAnimalRecord[]>> {
    const service = ServiceFactory.getAnimalService();
    return service.getBasicAnimals();
  }

  // Get animal by ID
  static async getAnimalById(id: string): Promise<ApiResponse<AnimalRecord>> {
    const service = ServiceFactory.getAnimalService();
    return service.getAnimalById(id);
  }

  // Create new animal
  static async createAnimal(animal: Omit<Animal, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<AnimalRecord>> {
    const service = ServiceFactory.getAnimalService();
    return service.createAnimal(animal);
  }

  // Update animal
  static async updateAnimal(id: string, animal: Partial<Animal>): Promise<ApiResponse<AnimalRecord>> {
    const service = ServiceFactory.getAnimalService();
    return service.updateAnimal(id, animal);
  }

  // Delete animal
  static async deleteAnimal(id: string): Promise<ApiResponse<void>> {
    const service = ServiceFactory.getAnimalService();
    return service.deleteAnimal(id);
  }

  // Get animal medical history
  static async getMedicalHistory(animalId: string): Promise<ApiResponse<MedicalRecord[]>> {
    const service = ServiceFactory.getAnimalService();
    return service.getMedicalHistory(animalId);
  }

  // Add medical record
  static async addMedicalRecord(
    animalId: string,
    record: Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt' | 'animalId'>
  ): Promise<ApiResponse<MedicalRecord>> {
    const service = ServiceFactory.getAnimalService();
    return service.addMedicalRecord(animalId, record);
  }

  // Get animal vaccinations
  static async getVaccinations(animalId: string): Promise<ApiResponse<Vaccination[]>> {
    const service = ServiceFactory.getAnimalService();
    return service.getVaccinations(animalId);
  }

  // Add vaccination
  static async addVaccination(
    animalId: string,
    vaccination: Omit<Vaccination, 'id' | 'createdAt' | 'updatedAt' | 'animalId'>
  ): Promise<ApiResponse<Vaccination>> {
    const service = ServiceFactory.getAnimalService();
    return service.addVaccination(animalId, vaccination);
  }

  // Search animals by owner
  static async searchByOwner(ownerName: string): Promise<ApiResponse<AnimalRecord[]>> {
    const service = ServiceFactory.getAnimalService();
    return service.searchByOwner(ownerName);
  }

  // Search animals by name
  static async searchByName(name: string): Promise<ApiResponse<AnimalRecord[]>> {
    const service = ServiceFactory.getAnimalService();
    return service.searchByName(name);
  }

  // Search animals by microchip
  static async searchByMicrochip(microchip: string): Promise<ApiResponse<AnimalRecord[]>> {
    const service = ServiceFactory.getAnimalService();
    return service.searchByMicrochip(microchip);
  }

  // Get animal by microchip number
  static async getAnimalByMicrochip(microchipNumber: string): Promise<ApiResponse<AnimalRecord>> {
    const service = ServiceFactory.getAnimalService();
    return service.getAnimalByMicrochip(microchipNumber);
  }

  // Get animals by owner ID
  static async getAnimalsByOwnerId(ownerId: string): Promise<ApiResponse<AnimalRecord[]>> {
    const service = ServiceFactory.getAnimalService();
    return service.getAnimalsByOwnerId(ownerId);
  }

  // Get animals by species ID
  static async getAnimalsBySpeciesId(speciesId: string): Promise<ApiResponse<AnimalRecord[]>> {
    const service = ServiceFactory.getAnimalService();
    return service.getAnimalsBySpeciesId(speciesId);
  }

  // Get animals by breed ID
  static async getAnimalsByBreedId(breedId: string): Promise<ApiResponse<AnimalRecord[]>> {
    const service = ServiceFactory.getAnimalService();
    return service.getAnimalsByBreedId(breedId);
  }

  // Get animals with allergies
  static async getAnimalsWithAllergies(): Promise<ApiResponse<AnimalRecord[]>> {
    const service = ServiceFactory.getAnimalService();
    return service.getAnimalsWithAllergies();
  }

  // Get animals with chronic diseases
  static async getAnimalsWithChronicDiseases(): Promise<ApiResponse<AnimalRecord[]>> {
    const service = ServiceFactory.getAnimalService();
    return service.getAnimalsWithChronicDiseases();
  }

  // Get animals with birthday today
  static async getAnimalsWithBirthdayToday(): Promise<ApiResponse<AnimalRecord[]>> {
    const service = ServiceFactory.getAnimalService();
    return service.getAnimalsWithBirthdayToday();
  }

  // Get animals with birthday this month
  static async getAnimalsWithBirthdayThisMonth(): Promise<ApiResponse<AnimalRecord[]>> {
    const service = ServiceFactory.getAnimalService();
    return service.getAnimalsWithBirthdayThisMonth();
  }
}

// Legacy export for compatibility
export const animalService = AnimalService;
export default AnimalService;
