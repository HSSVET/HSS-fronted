// Aşı takip sistemi için type tanımları

export interface Vaccine {
    id: string;
    name: string;
    manufacturer: string;
    animalTypes?: string[];
    breeds?: string[];
    diseaseTargets?: string[];
    dose: string;
    expiryDate?: string;
    serialNumber?: string;
    stockQuantity?: number;
    stockStatus?: 'available' | 'low' | 'critical';
    sideEffects?: string[] | string;
    applicationMethod: ApplicationMethod;
    notes?: string;

    // Backward compatibility fields
    animalType?: AnimalType;
    animalBreeds?: string[];
    diseaseType?: string;
    protectionPeriod?: string;
    minimumAge?: string;
    isActive?: boolean;
}

export interface VaccineStock {
    id: string;
    vaccineId: string;
    serialNumber: string;
    quantity: number;
    lastUpdated?: Date;
    expiryDate: Date | string;
    batchNumber: string;
    supplier: string;
    location?: string;
    unitPrice?: number;
    receivedDate?: string;
    isUsed?: boolean;
    usedDate?: string;
    animalId?: string;
}

export interface VaccinationRecord {
    id: string;
    animalId: string;
    animalName: string;
    animalSpecies: string;
    animalBreed?: string;
    ownerId: string;
    ownerName: string;
    vaccineId: string;
    vaccineName: string;
    manufacturer: string;
    batchNumber: string;
    applicationDate: Date;
    nextDueDate?: Date;
    veterinarianId: string;
    veterinarianName: string;
    applicationMethod: 'injection' | 'oral' | 'nasal';
    applicationSite?: string;
    dose: string;
    sideEffects?: string[];
    notes?: string;
    certificateNumber?: string;
    isCompleted: boolean;
}

export interface VaccinationSchedule {
    animalId: string;
    vaccineId: string;
    vaccineName: string;
    scheduledDate: Date;
    isOverdue: boolean;
    priority: 'low' | 'medium' | 'high' | 'critical';
    notes?: string;
}

export interface AnimalVaccinationCard {
    animalId: string;
    animalName: string;
    animalSpecies: string;
    animalBreed?: string;
    animalAge: number;
    animalGender: 'Erkek' | 'Dişi';
    animalWeight?: number;
    animalColor?: string;
    microchipId?: string;
    ownerId: string;
    ownerName: string;
    ownerPhone: string;
    ownerEmail?: string;
    ownerAddress?: string;
    vaccinationHistory: VaccinationRecord[];
    upcomingVaccinations: VaccinationSchedule[];
    cardCreatedDate: Date;
    lastUpdatedDate: Date;
    qrCode?: string;
    clinicInfo: {
        name: string;
        address: string;
        phone: string;
        license: string;
        veterinarianName: string;
        veterinarianLicense: string;
    };
}

export interface VaccinationStats {
    totalVaccines: number;
    totalStock: number;
    lowStockAlerts: number;
    totalAnimalsVaccinated: number;
    thisMonthVaccinations?: number;
    upcomingVaccinations?: number;
    overdueVaccinations?: number;
    expiringStock?: number;
}

export interface VaccineStockAlert {
    id: string;
    vaccineId: string;
    vaccineName: string;
    currentStock: number;
    minimumStock: number;
    alertType: 'low_stock' | 'expiring_soon' | 'expired';
    expiryDate?: Date;
    createdDate: Date;
    isRead: boolean;
    priority: 'low' | 'medium' | 'high';
    message: string;
}

export interface VaccinationFilters {
    search?: string;
    animalType?: string;
    breed?: string;
    stockStatus?: string;
    manufacturer?: string;
    diseaseType?: string;
    dateRange?: {
        start: Date;
        end: Date;
    };
}

export interface VaccinationCardPrintData {
    animalInfo: AnimalVaccinationCard;
    printDate: Date;
    printedBy: string;
    clinicLogo?: string;
    certificateNumber: string;
}

// Type Definitions for Backward Compatibility
export type AnimalType = 'dog' | 'cat' | 'bird' | 'rabbit' | 'hamster' | 'other';
export type ApplicationMethod = 'injection' | 'oral' | 'nasal' | 'subcutaneous' | 'intramuscular' | 'intranasal' | 'intradermal';

// Animal breeds mapping
export const animalBreeds: Record<string, string[]> = {
    'Köpek': [
        'Golden Retriever', 'Labrador Retriever', 'German Shepherd', 'Bulldog',
        'Poodle', 'Beagle', 'Rottweiler', 'Yorkshire Terrier', 'Chihuahua',
        'Siberian Husky', 'Shih Tzu', 'Boxer', 'Border Collie', 'Cocker Spaniel',
        'Great Dane', 'Dalmatian', 'Jack Russell Terrier', 'Kangal', 'Akbaş'
    ],
    'Kedi': [
        'Persian', 'British Shorthair', 'Maine Coon', 'Siamese', 'Ragdoll',
        'Bengal', 'American Shorthair', 'Scottish Fold', 'Sphynx', 'Russian Blue',
        'Norwegian Forest', 'Birman', 'Abyssinian', 'Turkish Angora', 'Van Kedisi'
    ],
    'Kuş': [
        'Muhabbet Kuşu', 'Kanarya', 'Sultan Papağanı', 'Cennet Papağanı',
        'Jako', 'Macaw', 'Kakadu', 'Finch', 'Java Isparoz'
    ],
    'Tavşan': [
        'Holland Lop', 'Netherland Dwarf', 'Flemish Giant', 'Angora',
        'Rex', 'Mini Rex', 'Lionhead', 'English Lop'
    ],
    'Hamster': [
        'Syrian Hamster', 'Dwarf Hamster', 'Chinese Hamster', 'Roborovski'
    ],
    'Diğer': ['Belirsiz', 'Karışık', 'Sokak Hayvanı']
}; 