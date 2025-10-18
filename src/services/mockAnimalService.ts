import type { Animal, MedicalRecord, Vaccination } from '../features/animals/types/animal';
import type { ApiResponse, PaginatedResponse } from '../types/common';
import {
    filterBySearch,
    generateId,
    mockAnimals,
    mockMedicalRecords,
    mockVaccinations,
    paginateData,
    simulateApiDelay
} from './mockData';

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

// Convert Animal to AnimalRecord format
const convertToAnimalRecord = (animal: Animal): AnimalRecord => ({
    id: parseInt(animal.id),
    name: animal.name,
    owner: {
        id: parseInt(animal.owner.id),
        name: animal.owner.name,
        fullName: animal.owner.name,
        phone: animal.owner.phone,
        email: animal.owner.email
    },
    species: {
        id: 1,
        name: animal.species
    },
    breed: animal.breed ? {
        id: 1,
        name: animal.breed
    } : undefined,
    gender: animal.gender,
    birthDate: new Date(Date.now() - animal.age * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    ageInYears: animal.age,
    weight: animal.weight,
    color: animal.color,
    microchipNumber: animal.microchipId,
    allergies: animal.notes?.includes('alerji') ? 'Bilinen alerji' : undefined,
    chronicDiseases: animal.health === 'Tedavi Altında' ? 'Kronik hastalık' : undefined,
    notes: animal.notes,
    lastVaccinationDate: animal.nextVaccine,
    lastVaccinationName: 'Karma Aşı',
    nextVaccinationDate: animal.nextVaccine,
    nextVaccinationName: 'Karma Aşı',
    visitCount: Math.floor(Math.random() * 10) + 1,
    lastVisitDate: animal.lastCheckup,
    primaryVeterinarianId: 1,
    primaryVeterinarianName: 'Dr. Mehmet Veteriner',
    hasChronicDiseases: animal.health === 'Tedavi Altında',
    hasAllergies: animal.notes?.includes('alerji') || false
});

export class MockAnimalService {
    // Get all animals
    async getAllAnimals(): Promise<ApiResponse<AnimalRecord[]>> {
        await simulateApiDelay();

        const animals = mockAnimals.map(convertToAnimalRecord);

        return {
            success: true,
            data: animals,
            status: 200
        };
    }

    // Get all animals with pagination
    async getAnimals(
        page: number = 0,
        limit: number = 10,
        search?: string
    ): Promise<ApiResponse<PaginatedResponse<AnimalRecord>>> {
        await simulateApiDelay();

        let filteredAnimals = mockAnimals;

        if (search) {
            filteredAnimals = filterBySearch(mockAnimals, search, ['name', 'species', 'breed']);
        }

        const animalRecords = filteredAnimals.map(convertToAnimalRecord);
        const paginatedData = paginateData(animalRecords, page, limit);

        return {
            success: true,
            data: paginatedData,
            status: 200
        };
    }

    // Get basic animals list for dropdowns
    async getBasicAnimals(): Promise<ApiResponse<BasicAnimalRecord[]>> {
        await simulateApiDelay();

        const basicAnimals: BasicAnimalRecord[] = mockAnimals.map(animal => ({
            id: parseInt(animal.id),
            name: animal.name,
            ownerName: animal.owner.name,
            speciesName: animal.species,
            breedName: animal.breed,
            microchipNumber: animal.microchipId
        }));

        return {
            success: true,
            data: basicAnimals,
            status: 200
        };
    }

    // Get animal by ID
    async getAnimalById(id: string): Promise<ApiResponse<AnimalRecord>> {
        await simulateApiDelay();

        const animal = mockAnimals.find(a => a.id === id);

        if (!animal) {
            return {
                success: false,
                data: {} as AnimalRecord,
                error: 'Animal not found',
                status: 404
            };
        }

        return {
            success: true,
            data: convertToAnimalRecord(animal),
            status: 200
        };
    }

    // Create new animal
    async createAnimal(animal: Omit<Animal, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<AnimalRecord>> {
        await simulateApiDelay();

        const newAnimal: Animal = {
            ...animal,
            id: generateId(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        mockAnimals.push(newAnimal);

        return {
            success: true,
            data: convertToAnimalRecord(newAnimal),
            status: 201
        };
    }

    // Update animal
    async updateAnimal(id: string, animal: Partial<Animal>): Promise<ApiResponse<AnimalRecord>> {
        await simulateApiDelay();

        const index = mockAnimals.findIndex(a => a.id === id);

        if (index === -1) {
            return {
                success: false,
                data: {} as AnimalRecord,
                error: 'Animal not found',
                status: 404
            };
        }

        mockAnimals[index] = {
            ...mockAnimals[index],
            ...animal,
            updatedAt: new Date()
        };

        return {
            success: true,
            data: convertToAnimalRecord(mockAnimals[index]),
            status: 200
        };
    }

    // Delete animal
    async deleteAnimal(id: string): Promise<ApiResponse<void>> {
        await simulateApiDelay();

        const index = mockAnimals.findIndex(a => a.id === id);

        if (index === -1) {
            return {
                success: false,
                data: undefined,
                error: 'Animal not found',
                status: 404
            };
        }

        mockAnimals.splice(index, 1);

        return {
            success: true,
            data: undefined,
            status: 200
        };
    }

    // Get animal medical history
    async getMedicalHistory(animalId: string): Promise<ApiResponse<MedicalRecord[]>> {
        await simulateApiDelay();

        const records = mockMedicalRecords.filter(r => r.animalId === animalId);

        return {
            success: true,
            data: records,
            status: 200
        };
    }

    // Add medical record
    async addMedicalRecord(
        animalId: string,
        record: Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt' | 'animalId'>
    ): Promise<ApiResponse<MedicalRecord>> {
        await simulateApiDelay();

        const newRecord: MedicalRecord = {
            ...record,
            id: generateId(),
            animalId,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        mockMedicalRecords.push(newRecord);

        return {
            success: true,
            data: newRecord,
            status: 201
        };
    }

    // Get animal vaccinations
    async getVaccinations(animalId: string): Promise<ApiResponse<Vaccination[]>> {
        await simulateApiDelay();

        const vaccinations = mockVaccinations.filter(v => v.animalId === animalId);

        return {
            success: true,
            data: vaccinations,
            status: 200
        };
    }

    // Add vaccination
    async addVaccination(
        animalId: string,
        vaccination: Omit<Vaccination, 'id' | 'createdAt' | 'updatedAt' | 'animalId'>
    ): Promise<ApiResponse<Vaccination>> {
        await simulateApiDelay();

        const newVaccination: Vaccination = {
            ...vaccination,
            id: generateId(),
            animalId,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        mockVaccinations.push(newVaccination);

        return {
            success: true,
            data: newVaccination,
            status: 201
        };
    }

    // Search animals by owner
    async searchByOwner(ownerName: string): Promise<ApiResponse<AnimalRecord[]>> {
        await simulateApiDelay();

        const filteredAnimals = mockAnimals.filter(animal =>
            animal.owner.name.toLowerCase().includes(ownerName.toLowerCase())
        );

        return {
            success: true,
            data: filteredAnimals.map(convertToAnimalRecord),
            status: 200
        };
    }

    // Search animals by name
    async searchByName(name: string): Promise<ApiResponse<AnimalRecord[]>> {
        await simulateApiDelay();

        const filteredAnimals = mockAnimals.filter(animal =>
            animal.name.toLowerCase().includes(name.toLowerCase())
        );

        return {
            success: true,
            data: filteredAnimals.map(convertToAnimalRecord),
            status: 200
        };
    }

    // Search animals by microchip
    async searchByMicrochip(microchip: string): Promise<ApiResponse<AnimalRecord[]>> {
        await simulateApiDelay();

        const filteredAnimals = mockAnimals.filter(animal =>
            animal.microchipId?.toLowerCase().includes(microchip.toLowerCase())
        );

        return {
            success: true,
            data: filteredAnimals.map(convertToAnimalRecord),
            status: 200
        };
    }

    // Get animal by microchip number
    async getAnimalByMicrochip(microchipNumber: string): Promise<ApiResponse<AnimalRecord>> {
        await simulateApiDelay();

        const animal = mockAnimals.find(a => a.microchipId === microchipNumber);

        if (!animal) {
            return {
                success: false,
                data: {} as AnimalRecord,
                error: 'Animal not found',
                status: 404
            };
        }

        return {
            success: true,
            data: convertToAnimalRecord(animal),
            status: 200
        };
    }

    // Get animals by owner ID
    async getAnimalsByOwnerId(ownerId: string): Promise<ApiResponse<AnimalRecord[]>> {
        await simulateApiDelay();

        const filteredAnimals = mockAnimals.filter(animal => animal.owner.id === ownerId);

        return {
            success: true,
            data: filteredAnimals.map(convertToAnimalRecord),
            status: 200
        };
    }

    // Get animals by species ID
    async getAnimalsBySpeciesId(speciesId: string): Promise<ApiResponse<AnimalRecord[]>> {
        await simulateApiDelay();

        const speciesMap: { [key: string]: string } = {
            '1': 'Köpek',
            '2': 'Kedi',
            '3': 'Kuş',
            '4': 'Tavşan',
            '5': 'Hamster'
        };

        const speciesName = speciesMap[speciesId];
        const filteredAnimals = mockAnimals.filter(animal => animal.species === speciesName);

        return {
            success: true,
            data: filteredAnimals.map(convertToAnimalRecord),
            status: 200
        };
    }

    // Get animals by breed ID
    async getAnimalsByBreedId(breedId: string): Promise<ApiResponse<AnimalRecord[]>> {
        await simulateApiDelay();

        const breedMap: { [key: string]: string } = {
            '1': 'Golden Retriever',
            '2': 'British Shorthair',
            '3': 'Muhabbet Kuşu',
            '4': 'Hollanda Lop',
            '5': 'Labrador',
            '6': 'Persian'
        };

        const breedName = breedMap[breedId];
        const filteredAnimals = mockAnimals.filter(animal => animal.breed === breedName);

        return {
            success: true,
            data: filteredAnimals.map(convertToAnimalRecord),
            status: 200
        };
    }

    // Get animals with allergies
    async getAnimalsWithAllergies(): Promise<ApiResponse<AnimalRecord[]>> {
        await simulateApiDelay();

        const filteredAnimals = mockAnimals.filter(animal =>
            animal.notes?.includes('alerji') || animal.health === 'Kritik'
        );

        return {
            success: true,
            data: filteredAnimals.map(convertToAnimalRecord),
            status: 200
        };
    }

    // Get animals with chronic diseases
    async getAnimalsWithChronicDiseases(): Promise<ApiResponse<AnimalRecord[]>> {
        await simulateApiDelay();

        const filteredAnimals = mockAnimals.filter(animal =>
            animal.health === 'Tedavi Altında' || animal.health === 'Kritik'
        );

        return {
            success: true,
            data: filteredAnimals.map(convertToAnimalRecord),
            status: 200
        };
    }

    // Get animals with birthday today
    async getAnimalsWithBirthdayToday(): Promise<ApiResponse<AnimalRecord[]>> {
        await simulateApiDelay();

        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        // Simulate some animals having birthday today
        const filteredAnimals = mockAnimals.filter((_, index) => index % 3 === 0);

        return {
            success: true,
            data: filteredAnimals.map(convertToAnimalRecord),
            status: 200
        };
    }

    // Get animals with birthday this month
    async getAnimalsWithBirthdayThisMonth(): Promise<ApiResponse<AnimalRecord[]>> {
        await simulateApiDelay();

        // Simulate some animals having birthday this month
        const filteredAnimals = mockAnimals.filter((_, index) => index % 2 === 0);

        return {
            success: true,
            data: filteredAnimals.map(convertToAnimalRecord),
            status: 200
        };
    }
}

// Legacy export for compatibility
export const animalService = MockAnimalService;
export default MockAnimalService;
