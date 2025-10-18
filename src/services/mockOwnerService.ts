import type { AnimalOwner } from '../features/animals/types/animal';
import type { ApiResponse, PaginatedResponse } from '../types/common';
import {
    filterBySearch,
    generateId,
    mockAnimals,
    mockOwners,
    paginateData,
    simulateApiDelay
} from './mockData';

export interface OwnerRecord {
    id: number;
    name: string;
    fullName?: string;
    phone?: string;
    email?: string;
    address?: string;
    emergencyContact?: string;
    animalCount?: number;
    lastVisitDate?: string;
    totalSpent?: number;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
}

// Convert AnimalOwner to OwnerRecord format
const convertToOwnerRecord = (owner: AnimalOwner): OwnerRecord => {
    const ownerAnimals = mockAnimals.filter(animal => animal.owner.id === owner.id);
    const lastVisit = ownerAnimals.reduce((latest, animal) => {
        const visitDate = new Date(animal.lastCheckup || animal.createdAt);
        return visitDate > latest ? visitDate : latest;
    }, new Date(0));

    return {
        id: parseInt(owner.id),
        name: owner.name,
        fullName: owner.name,
        phone: owner.phone,
        email: owner.email,
        address: owner.address,
        emergencyContact: owner.emergencyContact,
        animalCount: ownerAnimals.length,
        lastVisitDate: lastVisit.getTime() > 0 ? lastVisit.toISOString().split('T')[0] : undefined,
        totalSpent: Math.floor(Math.random() * 5000) + 500, // Mock total spent
        notes: `Sahip notları: ${owner.name} ile iletişim kuruldu`,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
    };
};

export class MockOwnerService {
    // Get all owners
    async getAllOwners(): Promise<ApiResponse<OwnerRecord[]>> {
        await simulateApiDelay();

        const owners = mockOwners.map(convertToOwnerRecord);

        return {
            success: true,
            data: owners,
            status: 200
        };
    }

    // Get all owners with pagination
    async getOwners(
        page: number = 0,
        limit: number = 10,
        search?: string
    ): Promise<ApiResponse<PaginatedResponse<OwnerRecord>>> {
        await simulateApiDelay();

        let filteredOwners = mockOwners;

        if (search) {
            filteredOwners = filterBySearch(mockOwners, search, ['name', 'phone', 'email']);
        }

        const ownerRecords = filteredOwners.map(convertToOwnerRecord);
        const paginatedData = paginateData(ownerRecords, page, limit);

        return {
            success: true,
            data: paginatedData,
            status: 200
        };
    }

    // Get owner by ID
    async getOwnerById(id: string): Promise<ApiResponse<OwnerRecord>> {
        await simulateApiDelay();

        const owner = mockOwners.find(o => o.id === id);

        if (!owner) {
            return {
                success: false,
                data: {} as OwnerRecord,
                error: 'Owner not found',
                status: 404
            };
        }

        return {
            success: true,
            data: convertToOwnerRecord(owner),
            status: 200
        };
    }

    // Create new owner
    async createOwner(owner: Omit<AnimalOwner, 'id'>): Promise<ApiResponse<OwnerRecord>> {
        await simulateApiDelay();

        const newOwner: AnimalOwner = {
            ...owner,
            id: generateId()
        };

        mockOwners.push(newOwner);

        return {
            success: true,
            data: convertToOwnerRecord(newOwner),
            status: 201
        };
    }

    // Update owner
    async updateOwner(id: string, owner: Partial<AnimalOwner>): Promise<ApiResponse<OwnerRecord>> {
        await simulateApiDelay();

        const index = mockOwners.findIndex(o => o.id === id);

        if (index === -1) {
            return {
                success: false,
                data: {} as OwnerRecord,
                error: 'Owner not found',
                status: 404
            };
        }

        mockOwners[index] = {
            ...mockOwners[index],
            ...owner
        };

        return {
            success: true,
            data: convertToOwnerRecord(mockOwners[index]),
            status: 200
        };
    }

    // Delete owner
    async deleteOwner(id: string): Promise<ApiResponse<void>> {
        await simulateApiDelay();

        const index = mockOwners.findIndex(o => o.id === id);

        if (index === -1) {
            return {
                success: false,
                data: undefined,
                error: 'Owner not found',
                status: 404
            };
        }

        // Check if owner has animals
        const hasAnimals = mockAnimals.some(animal => animal.owner.id === id);
        if (hasAnimals) {
            return {
                success: false,
                data: undefined,
                error: 'Cannot delete owner with existing animals',
                status: 400
            };
        }

        mockOwners.splice(index, 1);

        return {
            success: true,
            data: undefined,
            status: 200
        };
    }

    // Search owners by name
    async searchByName(name: string): Promise<ApiResponse<OwnerRecord[]>> {
        await simulateApiDelay();

        const filteredOwners = mockOwners.filter(owner =>
            owner.name.toLowerCase().includes(name.toLowerCase())
        );

        return {
            success: true,
            data: filteredOwners.map(convertToOwnerRecord),
            status: 200
        };
    }

    // Search owners by phone
    async searchByPhone(phone: string): Promise<ApiResponse<OwnerRecord[]>> {
        await simulateApiDelay();

        const filteredOwners = mockOwners.filter(owner =>
            owner.phone.includes(phone)
        );

        return {
            success: true,
            data: filteredOwners.map(convertToOwnerRecord),
            status: 200
        };
    }

    // Search owners by email
    async searchByEmail(email: string): Promise<ApiResponse<OwnerRecord[]>> {
        await simulateApiDelay();

        const filteredOwners = mockOwners.filter(owner =>
            owner.email?.toLowerCase().includes(email.toLowerCase())
        );

        return {
            success: true,
            data: filteredOwners.map(convertToOwnerRecord),
            status: 200
        };
    }

    // Get owners with animals
    async getOwnersWithAnimals(): Promise<ApiResponse<OwnerRecord[]>> {
        await simulateApiDelay();

        const ownersWithAnimals = mockOwners.filter(owner =>
            mockAnimals.some(animal => animal.owner.id === owner.id)
        );

        return {
            success: true,
            data: ownersWithAnimals.map(convertToOwnerRecord),
            status: 200
        };
    }

    // Get owners without animals
    async getOwnersWithoutAnimals(): Promise<ApiResponse<OwnerRecord[]>> {
        await simulateApiDelay();

        const ownersWithoutAnimals = mockOwners.filter(owner =>
            !mockAnimals.some(animal => animal.owner.id === owner.id)
        );

        return {
            success: true,
            data: ownersWithoutAnimals.map(convertToOwnerRecord),
            status: 200
        };
    }

    // Get owner statistics
    async getOwnerStatistics(ownerId: string): Promise<ApiResponse<{
        totalAnimals: number;
        totalAppointments: number;
        totalSpent: number;
        lastVisitDate?: string;
        averageVisitInterval: number;
    }>> {
        await simulateApiDelay();

        const ownerAnimals = mockAnimals.filter(animal => animal.owner.id === ownerId);
        const totalAnimals = ownerAnimals.length;
        const totalSpent = Math.floor(Math.random() * 5000) + 500;
        const lastVisit = ownerAnimals.reduce((latest, animal) => {
            const visitDate = new Date(animal.lastCheckup || animal.createdAt);
            return visitDate > latest ? visitDate : latest;
        }, new Date(0));

        return {
            success: true,
            data: {
                totalAnimals,
                totalAppointments: Math.floor(Math.random() * 20) + 1,
                totalSpent,
                lastVisitDate: lastVisit.getTime() > 0 ? lastVisit.toISOString().split('T')[0] : undefined,
                averageVisitInterval: Math.floor(Math.random() * 90) + 30 // days
            },
            status: 200
        };
    }

    // Get owner's animals
    async getOwnerAnimals(ownerId: string): Promise<ApiResponse<any[]>> {
        await simulateApiDelay();

        const ownerAnimals = mockAnimals.filter(animal => animal.owner.id === ownerId);

        return {
            success: true,
            data: ownerAnimals,
            status: 200
        };
    }
}

// Legacy export for compatibility
export const ownerService = MockOwnerService;
export default MockOwnerService;
