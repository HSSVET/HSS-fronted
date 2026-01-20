import { apiClient } from '../../../services/api';
import { API_ENDPOINTS } from '../../../constants';
import {
    Vaccine,
    VaccineStock,
    VaccineStockAlert,
    VaccinationStats,
    VaccinationFilters,
    AnimalVaccinationCard,
    VaccinationRecord,
    VaccinationSchedule
} from '../types/vaccination';
import type { ApiResponse } from '../../../types/common';

export class VaccinationService {
    // Vaccines
    static async getVaccines(filters?: VaccinationFilters): Promise<ApiResponse<Vaccine[]>> {
        const params = new URLSearchParams();

        if (filters?.animalType) {
            params.append('animalType', filters.animalType);
        }

        if (filters?.manufacturer) {
            params.append('manufacturer', filters.manufacturer);
        }

        if (filters?.search) {
            params.append('search', filters.search);
        }

        return apiClient.get(`${API_ENDPOINTS.VACCINES}${params.toString() ? '?' + params.toString() : ''}`);
    }

    static async getVaccineById(id: string): Promise<ApiResponse<Vaccine>> {
        return apiClient.get(`${API_ENDPOINTS.VACCINES}/${id}`);
    }

    static async createVaccine(vaccine: Omit<Vaccine, 'id'>): Promise<ApiResponse<Vaccine>> {
        return apiClient.post(API_ENDPOINTS.VACCINES, vaccine);
    }

    static async updateVaccine(id: string, updates: Partial<Vaccine>): Promise<ApiResponse<Vaccine>> {
        return apiClient.put(`${API_ENDPOINTS.VACCINES}/${id}`, updates);
    }

    static async deleteVaccine(id: string): Promise<ApiResponse<void>> {
        return apiClient.delete(`${API_ENDPOINTS.VACCINES}/${id}`);
    }

    // Vaccination records
    static async getVaccinationRecords(animalId?: string): Promise<ApiResponse<VaccinationRecord[]>> {
        const params = new URLSearchParams();

        if (animalId) {
            params.append('animalId', animalId);
        }

        return apiClient.get(`${API_ENDPOINTS.VACCINATIONS}${params.toString() ? '?' + params.toString() : ''}`);
    }

    static async createVaccinationRecord(record: Omit<VaccinationRecord, 'id'>): Promise<ApiResponse<VaccinationRecord>> {
        return apiClient.post(API_ENDPOINTS.VACCINATIONS, record);
    }

    static async createVaccination(request: any): Promise<ApiResponse<VaccinationRecord>> {
        return apiClient.post(API_ENDPOINTS.VACCINATIONS, request);
    }

    static async updateVaccinationRecord(id: string, updates: Partial<VaccinationRecord>): Promise<ApiResponse<VaccinationRecord>> {
        return apiClient.put(`${API_ENDPOINTS.VACCINATIONS}/${id}`, updates);
    }

    // Vaccination schedule
    static async getVaccinationSchedule(animalId: string): Promise<ApiResponse<VaccinationSchedule[]>> {
        return apiClient.get(`${API_ENDPOINTS.VACCINATIONS}/schedule/${animalId}`);
    }

    static async createVaccinationSchedule(schedule: Omit<VaccinationSchedule, 'id'>): Promise<ApiResponse<VaccinationSchedule>> {
        return apiClient.post(`${API_ENDPOINTS.VACCINATIONS}/schedule`, schedule);
    }

    // Vaccine stock
    static async getVaccineStock(): Promise<ApiResponse<VaccineStock[]>> {
        return apiClient.get(`${API_ENDPOINTS.VACCINES}/stock`);
    }

    static async updateVaccineStock(vaccineId: string, quantity: number): Promise<ApiResponse<VaccineStock>> {
        return apiClient.patch(`${API_ENDPOINTS.VACCINES}/${vaccineId}/stock`, { quantity });
    }

    // Statistics and reports
    static async getVaccinationStats(): Promise<ApiResponse<VaccinationStats>> {
        // Fallback to stock stats if vaccination specific not available or implement in backend
        // For now, let's use a mocked response or try to use an existing endpoint
        // TODO: Implement /api/vaccinations/statistics in backend
        return apiClient.get(`${API_ENDPOINTS.VACCINATIONS}/statistics`);
    }

    static async getStockAlerts(): Promise<ApiResponse<VaccineStockAlert[]>> {
        return apiClient.get(`${API_ENDPOINTS.STOCK}/alerts`);
    }

    // Animal vaccination card
    static async getAnimalVaccinationCard(animalId: string): Promise<ApiResponse<AnimalVaccinationCard>> {
        return apiClient.get(`${API_ENDPOINTS.VACCINATIONS}/card/${animalId}`);
    }

    static async getDueVaccinations(): Promise<ApiResponse<VaccinationRecord[]>> {
        return apiClient.get(`${API_ENDPOINTS.VACCINATIONS}/due`);
    }

    static async getOverdueVaccinations(): Promise<ApiResponse<VaccinationRecord[]>> {
        return apiClient.get(`${API_ENDPOINTS.VACCINATIONS}/overdue`);
    }

    // Helper method for breeds
    static getBreedsByAnimalType(animalType: string): string[] {
        return animalBreeds[animalType as keyof typeof animalBreeds] || [];
    }

    // Get vaccines with stock info (mock implementation)
    static async getVaccineWithStock(): Promise<ApiResponse<any[]>> {
        return apiClient.get(`${API_ENDPOINTS.VACCINES}/with-stock`);
    }
}

// Legacy exports
export const mockVaccines = [];
export const mockVaccineStock = [];
export const animalBreeds = {
    dog: ['Golden Retriever', 'Labrador', 'Diğer'],
    cat: ['Persian', 'British Shorthair', 'Diğer'],
    bird: ['Muhabbet Kuşu', 'Kanarya', 'Diğer'],
    rabbit: ['Holland Lop', 'Angora', 'Diğer'],
    hamster: ['Syrian Hamster', 'Dwarf Hamster', 'Diğer'],
    other: ['Diğer']
};

// Note: Mock functions have been replaced with API calls
export const vaccinationService = {
    getVaccines: VaccinationService.getVaccines,
    getVaccineById: VaccinationService.getVaccineById,
    getVaccinationRecords: VaccinationService.getVaccinationRecords,
    getVaccinationStats: VaccinationService.getVaccinationStats,
    createVaccinationRecord: VaccinationService.createVaccinationRecord,
    createVaccination: VaccinationService.createVaccination,
    getBreedsByAnimalType: VaccinationService.getBreedsByAnimalType,
    getStockAlerts: VaccinationService.getStockAlerts,
    getVaccineStock: VaccinationService.getVaccineStock,
    getDueVaccinations: VaccinationService.getDueVaccinations,
    getOverdueVaccinations: VaccinationService.getOverdueVaccinations,
    getVaccineWithStock: VaccinationService.getVaccineWithStock,
    getAnimalVaccinationCard: VaccinationService.getAnimalVaccinationCard,
    addVaccinationRecord: (animalId: string, record: any) => VaccinationService.createVaccinationRecord({ ...record, animalId }),
    exportVaccinationCardPDF: (animalId: string) => Promise.resolve(new Blob()), // Mock implementation
    addVaccineWithStock: (vaccineData: any, stockData: any) => VaccinationService.createVaccine(vaccineData), // Mock implementation
};
