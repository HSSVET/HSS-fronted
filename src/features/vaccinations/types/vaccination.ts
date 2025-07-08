// Aşı takip sistemi için type tanımları

export interface Vaccine {
    id: string;
    name: string;
    manufacturer: string;
    diseaseType: string;
    animalType: AnimalType;
    animalBreeds: string[];
    dose: string;
    applicationMethod: ApplicationMethod;
    protectionPeriod: string;
    minimumAge: string;
    sideEffects: string;
    notes: string;
    isActive: boolean;
}

export interface VaccineStock {
    id: string;
    vaccineId: string;
    serialNumber: string;
    batchNumber: string;
    expiryDate: string;
    quantity: number;
    unitPrice: number;
    supplier: string;
    receivedDate: string;
    isUsed: boolean;
    usedDate?: string;
    animalId?: string;
}

export interface VaccinationRecord {
    id: string;
    animalId: string;
    animalName: string;
    vaccineId: string;
    vaccineName: string;
    serialNumber: string;
    applicationDate: string;
    nextDueDate: string;
    veterinarianName: string;
    dose: string;
    applicationMethod: ApplicationMethod;
    reactionNotes?: string;
    status: VaccinationStatus;
}

export interface VaccineCard {
    animalId: string;
    animalName: string;
    animalType: AnimalType;
    breed: string;
    birthDate: string;
    ownerName: string;
    vaccinations: VaccinationRecord[];
    upcomingVaccinations: UpcomingVaccination[];
}

export interface UpcomingVaccination {
    vaccineId: string;
    vaccineName: string;
    dueDate: string;
    isOverdue: boolean;
    priority: 'high' | 'medium' | 'low';
}

export interface StockAlert {
    id: string;
    vaccineId: string;
    vaccineName: string;
    alertType: 'low_stock' | 'expiring_soon' | 'expired';
    currentStock: number;
    minimumStock: number;
    expiryDate?: string;
    daysUntilExpiry?: number;
    message: string;
    createdDate: string;
    isRead: boolean;
}

export type AnimalType = 'dog' | 'cat' | 'bird' | 'rabbit' | 'hamster' | 'other';

export type ApplicationMethod =
    | 'subcutaneous' // Deri altı
    | 'intramuscular' // Kas içi
    | 'intranasal' // Burun içi
    | 'oral' // Ağızdan
    | 'intradermal'; // Deri içi

export type VaccinationStatus =
    | 'completed' // Tamamlandı
    | 'scheduled' // Planlandı
    | 'overdue' // Gecikti
    | 'cancelled'; // İptal edildi

export interface VaccinationFilters {
    animalType?: AnimalType;
    breed?: string;
    diseaseType?: string;
    manufacturer?: string;
    stockStatus?: 'available' | 'low' | 'out_of_stock' | 'expiring';
}

export interface VaccinationStats {
    totalVaccines: number;
    totalStock: number;
    lowStockAlerts: number;
    expiringStock: number;
    totalAnimalsVaccinated: number;
    overdueVaccinations: number;
} 