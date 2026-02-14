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
  status?: 'ACTIVE' | 'FOLLOW_UP' | 'DECEASED' | 'ARCHIVED';
  behaviorNotes?: string;
  profileImageUrl?: string;
  height?: number;
  sterilized?: boolean;
  conditions?: any[]; // Using any[] to avoid circular dependency, ideally should be AnimalCondition[]
}

export interface BasicAnimalRecord {
  id: number;
  name: string;
  ownerName?: string;
  speciesName?: string;
  breedName?: string;
  microchipNumber?: string;
}

const emptyPage = <T>(page: number, limit: number): PaginatedResponse<T> => ({
  items: [],
  total: 0,
  page,
  limit,
  totalPages: 0,
});

export class AnimalService {
  private mapBackendToAnimalRecord = (backend: any): AnimalRecord => {
    const mapped = {
      id: backend.animalId ?? backend.id ?? 0,
      name: backend.name || 'İsimsiz',
      owner: backend.ownerId || backend.ownerName ? {
        id: backend.ownerId ?? 0,
        name: backend.ownerName ?? '',
        fullName: backend.ownerName ?? '',
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
      birthDate: backend.birthDate ? (typeof backend.birthDate === 'string' ? backend.birthDate : backend.birthDate.toString()) : undefined,
      weight: backend.weight ? (typeof backend.weight === 'number' ? backend.weight : Number(backend.weight)) : undefined,
      color: backend.color,
      microchipNumber: backend.microchipNo ?? backend.microchipNumber,
      allergies: backend.allergies,
      chronicDiseases: backend.chronicDiseases,
      notes: backend.notes,
      lastVisitDate: backend.lastVisitDate ? (typeof backend.lastVisitDate === 'string' ? backend.lastVisitDate : backend.lastVisitDate.toString()) : undefined,
      nextVaccinationDate: backend.nextVaccinationDate ? (typeof backend.nextVaccinationDate === 'string' ? backend.nextVaccinationDate : backend.nextVaccinationDate.toString()) : undefined,
      status: backend.status,
      behaviorNotes: backend.behaviorNotes,
      profileImageUrl: backend.profileImageUrl,
      height: backend.height,
      sterilized: backend.sterilized,
      conditions: backend.conditions,
    };

    return mapped;
  };
  // Get all animals
  async getAllAnimals(): Promise<ApiResponse<AnimalRecord[]>> {
    // Direct API call instead of going through ServiceFactory
    const { apiClient } = await import('../../../services/api');
    // Spring Boot Pageable uses 'size' not 'limit'
    const response = await apiClient.get<SpringPage<any>>('/api/animals?page=0&size=100');
    if (response.success && response.data) {
      const items = (response.data.content || []).map(this.mapBackendToAnimalRecord);
      return { success: true, data: items, status: response.status } as ApiResponse<AnimalRecord[]>;
    }
    return {
      success: false,
      data: [],
      error: response.error || 'Failed to fetch animals',
      status: response.status
    };
  }

  // Get all animals with pagination
  async getAnimals(
    page: number = 0,
    limit: number = 10,
    search?: string
  ): Promise<ApiResponse<PaginatedResponse<AnimalRecord>>> {
    // Direct API call instead of going through ServiceFactory
    const { apiClient } = await import('../../../services/api');
    // Spring Boot Pageable uses 'size' not 'limit'
    const response = await apiClient.get<SpringPage<any>>(`/api/animals?page=${page}&size=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}`);

    // Convert Spring Page to PaginatedResponse
    if (response.success && response.data) {
      const mappedItems = (response.data.content || []).map(this.mapBackendToAnimalRecord);

      const paginatedResponse: PaginatedResponse<AnimalRecord> = {
        items: mappedItems,
        total: response.data.totalElements,
        page: response.data.number,
        limit: response.data.size,
        totalPages: response.data.totalPages,
      };

      return { success: true, data: paginatedResponse, status: response.status };
    }
    return {
      success: false,
      data: emptyPage<AnimalRecord>(page, limit),
      error: response.error || 'Failed to fetch animals',
      status: response.status
    };
  }

  // Get basic animals list for dropdowns
  async getBasicAnimals(): Promise<ApiResponse<BasicAnimalRecord[]>> {
    // Use the main animals endpoint and transform the data
    const { apiClient } = await import('../../../services/api');
    // Spring Boot uses 'size' not 'limit'
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

    return { success: false, data: [], error: response.error || 'Failed to fetch basic animals' };
  }

  // Get animal by ID
  async getAnimalById(id: string): Promise<ApiResponse<AnimalRecord>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<AnimalRecord>(`/api/animals/${id}`);
    return response;
  }

  // Create new animal
  async createAnimal(animal: {
    ownerId: number;
    name: string;
    speciesId: number;
    breedId: number;
    gender?: string;
    birthDate?: string;
    weight?: number;
    color?: string;
    microchipNo?: string;
    allergies?: string;
    chronicDiseases?: string;
    notes?: string;
  }): Promise<ApiResponse<AnimalRecord>> {
    const { apiClient } = await import('../../../services/api');

    // Helper function to convert empty strings to undefined
    const cleanString = (value?: string): string | undefined => {
      if (!value || value.trim() === '') return undefined;
      return value.trim();
    };

    // Convert to backend's AnimalCreateRequest format
    const request: any = {
      ownerId: animal.ownerId,
      name: animal.name.trim(),
      speciesId: animal.speciesId,
      breedId: animal.breedId,
    };

    // Only include optional fields if they have values
    if (animal.gender && animal.gender.trim() !== '') {
      request.gender = animal.gender.trim();
    }

    if (animal.birthDate && animal.birthDate.trim() !== '') {
      // Backend LocalDate formatı YYYY-MM-DD bekliyor
      const dateStr = animal.birthDate.trim();
      // Date formatını kontrol et
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (dateRegex.test(dateStr)) {
        const date = new Date(dateStr + 'T00:00:00'); // UTC timezone için
        if (!isNaN(date.getTime()) && date < new Date()) {
          request.birthDate = dateStr; // Format: YYYY-MM-DD
        }
      }
    }

    if (animal.weight !== undefined && animal.weight !== null && animal.weight > 0) {
      request.weight = Number(animal.weight);
    }

    const cleanColor = cleanString(animal.color);
    if (cleanColor) {
      request.color = cleanColor;
    }

    const cleanMicrochip = cleanString(animal.microchipNo);
    if (cleanMicrochip) {
      request.microchipNo = cleanMicrochip;
    }

    const cleanAllergies = cleanString(animal.allergies);
    if (cleanAllergies) {
      request.allergies = cleanAllergies;
    }

    const cleanChronicDiseases = cleanString(animal.chronicDiseases);
    if (cleanChronicDiseases) {
      request.chronicDiseases = cleanChronicDiseases;
    }

    const cleanNotes = cleanString(animal.notes);
    if (cleanNotes) {
      request.notes = cleanNotes;
    }

    console.log('Sending animal create request:', request);
    const response = await apiClient.post<AnimalRecord>('/api/animals', request);
    return response;
  }

  // Update animal
  async updateAnimal(id: string, animal: Partial<Animal>): Promise<ApiResponse<AnimalRecord>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.put<AnimalRecord>(`/api/animals/${id}`, animal);
    return response;
  }

  // Delete animal
  async deleteAnimal(id: string): Promise<ApiResponse<void>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.delete<void>(`/api/animals/${id}`);
    return response;
  }

  // Get animal medical history
  async getMedicalHistory(animalId: string): Promise<ApiResponse<MedicalRecord[]>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<MedicalRecord[]>(`/api/animals/${animalId}/medical-history`);
    return response;
  }

  // Add medical record
  async addMedicalRecord(
    animalId: string,
    record: Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt' | 'animalId'>
  ): Promise<ApiResponse<MedicalRecord>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.post<MedicalRecord>(`/api/animals/${animalId}/medical-history`, record);
    return response;
  }

  // Get animal vaccinations
  async getVaccinations(animalId: string): Promise<ApiResponse<Vaccination[]>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<Vaccination[]>(`/api/animals/${animalId}/vaccinations`);
    return response;
  }

  // Add vaccination
  async addVaccination(
    animalId: string,
    vaccination: Omit<Vaccination, 'id' | 'createdAt' | 'updatedAt' | 'animalId'>
  ): Promise<ApiResponse<Vaccination>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.post<Vaccination>(`/api/animals/${animalId}/vaccinations`, vaccination);
    return response;
  }

  // Search animals by owner
  async searchByOwner(ownerName: string): Promise<ApiResponse<AnimalRecord[]>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<AnimalRecord[]>(`/api/animals?ownerName=${encodeURIComponent(ownerName)}`);
    return response;
  }

  // Search animals by name
  async searchByName(name: string): Promise<ApiResponse<AnimalRecord[]>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<AnimalRecord[]>(`/api/animals?name=${encodeURIComponent(name)}`);
    return response;
  }

  // Search animals by microchip
  async searchByMicrochip(microchip: string): Promise<ApiResponse<AnimalRecord[]>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<AnimalRecord[]>(`/api/animals?microchipNumber=${encodeURIComponent(microchip)}`);
    return response;
  }

  // Unified search - searches by name, owner name, and microchip
  async searchAnimals(query: string): Promise<ApiResponse<AnimalRecord[]>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<any[]>(`/api/animals/search?query=${encodeURIComponent(query)}`);
    
    if (response.success && response.data) {
      const mappedAnimals = response.data.map(this.mapBackendToAnimalRecord);
      return { success: true, data: mappedAnimals, status: response.status };
    }
    
    return {
      success: false,
      data: [],
      error: response.error || 'Failed to search animals',
      status: response.status
    };
  }

  // Get animal by microchip number
  async getAnimalByMicrochip(microchipNumber: string): Promise<ApiResponse<AnimalRecord>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<AnimalRecord>(`/api/animals/microchip/${microchipNumber}`);
    return response;
  }

  // Get animals by owner ID
  async getAnimalsByOwnerId(ownerId: string): Promise<ApiResponse<AnimalRecord[]>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<AnimalRecord[]>(`/api/animals/owner/${ownerId}`);
    return response;
  }

  // Get animals by species ID
  async getAnimalsBySpeciesId(speciesId: string): Promise<ApiResponse<AnimalRecord[]>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<AnimalRecord[]>(`/api/animals/species/${speciesId}`);
    return response;
  }

  // Get animals by breed ID
  async getAnimalsByBreedId(breedId: string): Promise<ApiResponse<AnimalRecord[]>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<AnimalRecord[]>(`/api/animals/breed/${breedId}`);
    return response;
  }

  // Get animals with allergies
  async getAnimalsWithAllergies(): Promise<ApiResponse<AnimalRecord[]>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<AnimalRecord[]>('/api/animals?hasAllergies=true');
    return response;
  }

  // Get animals with chronic diseases
  async getAnimalsWithChronicDiseases(): Promise<ApiResponse<AnimalRecord[]>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<AnimalRecord[]>('/api/animals?hasChronicDiseases=true');
    return response;
  }

  // Get animals with birthday today
  async getAnimalsWithBirthdayToday(): Promise<ApiResponse<AnimalRecord[]>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<AnimalRecord[]>('/api/animals/birthday/today');
    return response;
  }

  // Get animals with birthday this month
  async getAnimalsWithBirthdayThisMonth(): Promise<ApiResponse<AnimalRecord[]>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<AnimalRecord[]>('/api/animals/birthday/this-month');
    return response;
  }
}

export const animalService = new AnimalService();
export default animalService;
