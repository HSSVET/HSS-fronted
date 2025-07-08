import {
    Vaccine,
    VaccineStock,
    VaccinationRecord,
    VaccineCard,
    StockAlert,
    VaccinationStats,
    VaccinationFilters,
    AnimalType,
    ApplicationMethod
} from '../types/vaccination';

// Mock Data
export const mockVaccines: Vaccine[] = [
    {
        id: '1',
        name: 'Kuduz Aşısı',
        manufacturer: 'VetBioTech',
        diseaseType: 'Kuduz Virüsü',
        animalType: 'dog',
        animalBreeds: ['Tüm ırklar'],
        dose: '1 ml',
        applicationMethod: 'intramuscular',
        protectionPeriod: '3 ay',
        minimumAge: 'Hafif ateş, enjeksiyon bölgesinde hassasiyet',
        sideEffects: 'Hafif ateş, enjeksiyon bölgesinde hassasiyet',
        notes: 'Yıllık tekrar gerektirir',
        isActive: true
    },
    {
        id: '2',
        name: 'Parvovirus Aşısı',
        manufacturer: 'PetVax',
        diseaseType: 'Parvovirus',
        animalType: 'dog',
        animalBreeds: ['Golden Retriever', 'Labrador', 'Alman Çoban Köpeği', 'Diğer'],
        dose: '0.5 ml',
        applicationMethod: 'subcutaneous',
        protectionPeriod: '2 ay',
        minimumAge: 'İştahsızlık, letarji',
        sideEffects: 'İştahsızlık, letarji',
        notes: 'Yavrı köpekler için önemli',
        isActive: true
    },
    {
        id: '3',
        name: 'Bordetella Aşısı',
        manufacturer: 'VetBioTech',
        diseaseType: 'Kennel Cough, Bordetella Bronchiseptica',
        animalType: 'dog',
        animalBreeds: ['Tüm ırklar'],
        dose: '0.5 ml',
        applicationMethod: 'intranasal',
        protectionPeriod: '4 ay',
        minimumAge: 'Hafif öksürük',
        sideEffects: 'Hafif öksürük',
        notes: 'Barınaklar veya otel ortamına gerek durumdur',
        isActive: true
    },
    {
        id: '4',
        name: 'Karma Aşı (DHPP)',
        manufacturer: 'PetVax',
        diseaseType: 'Distemper, Hepatit, Parvovirus, Parainfluenza',
        animalType: 'dog',
        animalBreeds: ['Tüm ırklar'],
        dose: '1 ml',
        applicationMethod: 'subcutaneous',
        protectionPeriod: '2 ay',
        minimumAge: 'Ateş, iştahsızlık',
        sideEffects: 'Ateş, iştahsızlık',
        notes: 'Temel korunma aşılarından biridir',
        isActive: true
    },
    {
        id: '5',
        name: 'Leptospiroz Aşısı',
        manufacturer: 'VetBioTech',
        diseaseType: 'Leptospira Bakterileri',
        animalType: 'dog',
        animalBreeds: ['Golden Retriever', 'Bulldog', 'Diğer'],
        dose: '1 ml',
        applicationMethod: 'intramuscular',
        protectionPeriod: '4 ay',
        minimumAge: 'Ateş, hassasiyet',
        sideEffects: 'Ateş, hassasiyet',
        notes: 'Risk altındaki köpekler için önerilir',
        isActive: true
    }
];

export const mockVaccineStock: VaccineStock[] = [
    {
        id: '1',
        vaccineId: '1',
        serialNumber: 'VBT-KDZ-2024-001',
        batchNumber: 'BTH-2024-11',
        expiryDate: '2024-11-15',
        quantity: 6,
        unitPrice: 25.50,
        supplier: 'VetBioTech Distribütörü',
        receivedDate: '2024-01-15',
        isUsed: false
    },
    {
        id: '2',
        vaccineId: '2',
        serialNumber: 'PV-PRV-2024-001',
        batchNumber: 'BTH-2024-09',
        expiryDate: '2024-09-20',
        quantity: 3,
        unitPrice: 18.75,
        supplier: 'PetVax Turkey',
        receivedDate: '2024-02-20',
        isUsed: false
    },
    {
        id: '3',
        vaccineId: '3',
        serialNumber: 'VBT-BRD-2024-001',
        batchNumber: 'BTH-2024-10',
        expiryDate: '2024-10-05',
        quantity: 32,
        unitPrice: 22.00,
        supplier: 'VetBioTech Distribütörü',
        receivedDate: '2024-03-05',
        isUsed: false
    },
    {
        id: '4',
        vaccineId: '4',
        serialNumber: 'PV-DHPP-2024-001',
        batchNumber: 'BTH-2024-12',
        expiryDate: '2024-12-22',
        quantity: 38,
        unitPrice: 32.25,
        supplier: 'PetVax Turkey',
        receivedDate: '2024-04-22',
        isUsed: false
    },
    {
        id: '5',
        vaccineId: '5',
        serialNumber: 'VBT-LEP-2024-001',
        batchNumber: 'BTH-2024-11',
        expiryDate: '2024-11-30',
        quantity: 4,
        unitPrice: 28.90,
        supplier: 'VetBioTech Distribütörü',
        receivedDate: '2024-05-30',
        isUsed: false
    }
];

export const mockStockAlerts: StockAlert[] = [
    {
        id: '1',
        vaccineId: '1',
        vaccineName: 'Kuduz Aşısı',
        alertType: 'low_stock',
        currentStock: 6,
        minimumStock: 10,
        message: 'Kuduz Aşısı stok seviyesi kritik: 6 adet kaldı!',
        createdDate: '2024-07-08',
        isRead: false
    },
    {
        id: '2',
        vaccineId: '2',
        vaccineName: 'Parvovirus Aşısı',
        alertType: 'low_stock',
        currentStock: 3,
        minimumStock: 15,
        message: 'Parvovirus Aşısı stok seviyesi kritik: 3 adet kaldı!',
        createdDate: '2024-07-07',
        isRead: false
    },
    {
        id: '3',
        vaccineId: '5',
        vaccineName: 'Leptospiroz Aşısı',
        alertType: 'low_stock',
        currentStock: 4,
        minimumStock: 12,
        message: 'Leptospiroz Aşısı stok seviyesi kritik: 4 adet kaldı!',
        createdDate: '2024-07-06',
        isRead: false
    }
];

// Service Functions
class VaccinationService {
    private vaccines: Vaccine[] = mockVaccines;
    private vaccineStock: VaccineStock[] = mockVaccineStock;
    private stockAlerts: StockAlert[] = mockStockAlerts;

    // Aşı Listesi
    async getVaccines(filters?: VaccinationFilters): Promise<Vaccine[]> {
        let filtered = [...this.vaccines];

        if (filters?.animalType) {
            filtered = filtered.filter(v => v.animalType === filters.animalType);
        }

        if (filters?.diseaseType) {
            filtered = filtered.filter(v =>
                v.diseaseType.toLowerCase().includes(filters.diseaseType!.toLowerCase())
            );
        }

        if (filters?.applicationMethod) {
            filtered = filtered.filter(v => v.applicationMethod === filters.applicationMethod);
        }

        if (filters?.manufacturer) {
            filtered = filtered.filter(v =>
                v.manufacturer.toLowerCase().includes(filters.manufacturer!.toLowerCase())
            );
        }

        return filtered;
    }

    // Stok Bilgileri
    async getVaccineStock(): Promise<VaccineStock[]> {
        return [...this.vaccineStock];
    }

    // Aşı Stok Durumu
    async getVaccineWithStock(): Promise<Array<Vaccine & { stock: VaccineStock[] }>> {
        const vaccines = await this.getVaccines();
        return vaccines.map(vaccine => ({
            ...vaccine,
            stock: this.vaccineStock.filter(stock => stock.vaccineId === vaccine.id)
        }));
    }

    // Stok Uyarıları
    async getStockAlerts(): Promise<StockAlert[]> {
        return [...this.stockAlerts];
    }

    // İstatistikler
    async getVaccinationStats(): Promise<VaccinationStats> {
        const totalStock = this.vaccineStock.reduce((sum, stock) => sum + stock.quantity, 0);
        const lowStockAlerts = this.stockAlerts.filter(alert => alert.alertType === 'low_stock').length;

        return {
            totalVaccines: this.vaccines.length,
            totalStock,
            lowStockAlerts,
            expiringStock: 0, // Hesaplanacak
            totalAnimalsVaccinated: 248, // Mock veri
            overdueVaccinations: 14 // Mock veri
        };
    }

    // Stok Düşürme
    async useVaccine(serialNumber: string, animalId: string): Promise<boolean> {
        const stockIndex = this.vaccineStock.findIndex(stock =>
            stock.serialNumber === serialNumber && !stock.isUsed
        );

        if (stockIndex === -1) {
            throw new Error('Aşı stokta bulunamadı veya zaten kullanılmış');
        }

        this.vaccineStock[stockIndex] = {
            ...this.vaccineStock[stockIndex],
            quantity: Math.max(0, this.vaccineStock[stockIndex].quantity - 1),
            isUsed: this.vaccineStock[stockIndex].quantity === 1,
            usedDate: this.vaccineStock[stockIndex].quantity === 1 ? new Date().toISOString() : undefined,
            animalId: this.vaccineStock[stockIndex].quantity === 1 ? animalId : undefined
        };

        return true;
    }

    // Yeni Aşı Ekleme
    async addVaccine(vaccine: Omit<Vaccine, 'id'>): Promise<Vaccine> {
        const newVaccine: Vaccine = {
            ...vaccine,
            id: (this.vaccines.length + 1).toString()
        };

        this.vaccines.push(newVaccine);
        return newVaccine;
    }

    // Aşı Kartı Mock Data
    async getVaccineCard(animalId: string): Promise<VaccineCard | null> {
        // Bu mock data, gerçek implementasyonda hayvan veritabanından gelecek
        return {
            animalId,
            animalName: 'Max',
            animalType: 'dog',
            breed: 'Golden Retriever',
            birthDate: '2023-03-15',
            ownerName: 'Ahmet Yılmaz',
            vaccinations: [],
            upcomingVaccinations: [
                {
                    vaccineId: '1',
                    vaccineName: 'Kuduz Aşısı',
                    dueDate: '2024-08-15',
                    isOverdue: false,
                    priority: 'high'
                }
            ]
        };
    }
}

export const vaccinationService = new VaccinationService(); 