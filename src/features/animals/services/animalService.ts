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
  private mapBackendToAnimalRecord = (backend: any): AnimalRecord => {
    return {
      id: backend.animalId ?? backend.id ?? 0,
      name: backend.name,
      owner: backend.ownerId || backend.ownerName ? {
        id: backend.ownerId ?? 0,
        name: backend.ownerName ?? '',
      } : undefined,
      species: backend.speciesId || backend.speciesName ? {
        id: backend.speciesId ?? 0,
        name: backend.speciesName ?? '',
      } : undefined,
      breed: backend.breedId || backend.breedName ? {
        id: backend.breedId ?? 0,
        name: backend.breedName ?? '',
      } : undefined,
      gender: backend.gender,
      birthDate: backend.birthDate?.toString(),
      weight: backend.weight,
      color: backend.color,
      microchipNumber: backend.microchipNo ?? backend.microchipNumber,
      allergies: backend.allergies,
      chronicDiseases: backend.chronicDiseases,
      notes: backend.notes,
      lastVisitDate: backend.lastVisitDate,
      nextVaccinationDate: backend.nextVaccinationDate,
    };
  };
  // Get all animals
  async getAllAnimals(): Promise<ApiResponse<AnimalRecord[]>> {
    // Direct API call instead of going through ServiceFactory
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<SpringPage<any>>('/api/animals?page=0&size=100');
    if (response.success && response.data) {
      const items = (response.data.content || []).map(this.mapBackendToAnimalRecord);
      return { success: true, data: items, status: response.status } as ApiResponse<AnimalRecord[]>;
    }
    return { success: false, data: [], error: response.error || 'Failed to fetch animals' };
  }

  // Get all animals with pagination
  async getAnimals(
    page: number = 0,
    limit: number = 10,
    search?: string
  ): Promise<ApiResponse<PaginatedResponse<AnimalRecord>>> {
    // Direct API call instead of going through ServiceFactory
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<SpringPage<any>>(`/api/animals?page=${page}&size=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}`);
    
    // Convert Spring Page to PaginatedResponse
    if (response.success && response.data) {
      const paginatedResponse: PaginatedResponse<AnimalRecord> = {
        items: (response.data.content || []).map(this.mapBackendToAnimalRecord),
        total: response.data.totalElements,
        page: response.data.number,
        limit: response.data.size,
        totalPages: response.data.totalPages,
      };
      return { success: true, data: paginatedResponse };
    }
    
    return { success: false, data: emptyPage<AnimalRecord>(page, limit), error: 'Failed to fetch animals' };
  }

  // Get basic animals list for dropdowns
  async getBasicAnimals(): Promise<ApiResponse<BasicAnimalRecord[]>> {
    // Use the main animals endpoint and transform the data
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<SpringPage<any>>('/api/animals?page=0&size=1000');
    
    if (response.success && response.data) {
      const basicAnimals: BasicAnimalRecord[] = (response.data.content || []).map(a => ({
        id: a.animalId ?? a.id ?? 0,
        name: a.name,
        ownerName: a.ownerName,
        speciesName: a.speciesName,
        breedName: a.breedName,
        microchipNumber: a.microchipNo ?? a.microchipNumber,
      }));
      return { success: true, data: basicAnimals };
    }
    
    return { success: false, data: [], error: 'Failed to fetch basic animals' };
  }

  // Get animal by ID
  async getAnimalById(id: string): Promise<ApiResponse<AnimalRecord>> {
    const service = ServiceFactory.getAnimalService();
    return service.getAnimalById(id);
  }

  // Create new animal
  async createAnimal(animal: Omit<Animal, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<AnimalRecord>> {
    const service = ServiceFactory.getAnimalService();
    return service.createAnimal(animal);
  }

  // Update animal
  async updateAnimal(id: string, animal: Partial<Animal>): Promise<ApiResponse<AnimalRecord>> {
    const service = ServiceFactory.getAnimalService();
    return service.updateAnimal(id, animal);
  }

  // Delete animal
  async deleteAnimal(id: string): Promise<ApiResponse<void>> {
    const service = ServiceFactory.getAnimalService();
    return service.deleteAnimal(id);
  }

  // Get animal medical history
  async getMedicalHistory(animalId: string): Promise<ApiResponse<MedicalRecord[]>> {
    const service = ServiceFactory.getAnimalService();
    return service.getMedicalHistory(animalId);
  }

  // Add medical record
  async addMedicalRecord(
    animalId: string,
    record: Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt' | 'animalId'>
  ): Promise<ApiResponse<MedicalRecord>> {
    const service = ServiceFactory.getAnimalService();
    return service.addMedicalRecord(animalId, record);
  }

  // Get animal vaccinations
  async getVaccinations(animalId: string): Promise<ApiResponse<Vaccination[]>> {
    const service = ServiceFactory.getAnimalService();
    return service.getVaccinations(animalId);
  }

  // Add vaccination
  async addVaccination(
    animalId: string,
    vaccination: Omit<Vaccination, 'id' | 'createdAt' | 'updatedAt' | 'animalId'>
  ): Promise<ApiResponse<Vaccination>> {
    const service = ServiceFactory.getAnimalService();
    return service.addVaccination(animalId, vaccination);
  }

  // Search animals by owner
  async searchByOwner(ownerName: string): Promise<ApiResponse<AnimalRecord[]>> {
    const service = ServiceFactory.getAnimalService();
    return service.searchByOwner(ownerName);
  }

  // Search animals by name
  async searchByName(name: string): Promise<ApiResponse<AnimalRecord[]>> {
    const service = ServiceFactory.getAnimalService();
    return service.searchByName(name);
  }

  // Search animals by microchip
  async searchByMicrochip(microchip: string): Promise<ApiResponse<AnimalRecord[]>> {
    const service = ServiceFactory.getAnimalService();
    return service.searchByMicrochip(microchip);
  }

  // Get animal by microchip number
  async getAnimalByMicrochip(microchipNumber: string): Promise<ApiResponse<AnimalRecord>> {
    const service = ServiceFactory.getAnimalService();
    return service.getAnimalByMicrochip(microchipNumber);
  }

  // Get animals by owner ID
  async getAnimalsByOwnerId(ownerId: string): Promise<ApiResponse<AnimalRecord[]>> {
    const service = ServiceFactory.getAnimalService();
    return service.getAnimalsByOwnerId(ownerId);
  }

  // Get animals by species ID
  async getAnimalsBySpeciesId(speciesId: string): Promise<ApiResponse<AnimalRecord[]>> {
    const service = ServiceFactory.getAnimalService();
    return service.getAnimalsBySpeciesId(speciesId);
  }

  // Get animals by breed ID
  async getAnimalsByBreedId(breedId: string): Promise<ApiResponse<AnimalRecord[]>> {
    const service = ServiceFactory.getAnimalService();
    return service.getAnimalsByBreedId(breedId);
  }

  // Get animals with allergies
  async getAnimalsWithAllergies(): Promise<ApiResponse<AnimalRecord[]>> {
    const service = ServiceFactory.getAnimalService();
    return service.getAnimalsWithAllergies();
  }

  // Get animals with chronic diseases
  async getAnimalsWithChronicDiseases(): Promise<ApiResponse<AnimalRecord[]>> {
    const service = ServiceFactory.getAnimalService();
    return service.getAnimalsWithChronicDiseases();
  }

  // Get animals with birthday today
  async getAnimalsWithBirthdayToday(): Promise<ApiResponse<AnimalRecord[]>> {
    const service = ServiceFactory.getAnimalService();
    return service.getAnimalsWithBirthdayToday();
  }

  // Get animals with birthday this month
  async getAnimalsWithBirthdayThisMonth(): Promise<ApiResponse<AnimalRecord[]>> {
    const service = ServiceFactory.getAnimalService();
    return service.getAnimalsWithBirthdayThisMonth();
  }
}

// Legacy export for compatibility
export const animalService = AnimalService;
export default AnimalService;
