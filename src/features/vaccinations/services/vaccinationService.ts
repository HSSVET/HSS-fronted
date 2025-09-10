import {
    Vaccine,
    VaccineStock,
    StockAlert,
    VaccinationStats,
    VaccinationFilters,
    AnimalVaccinationCard,
    VaccinationRecord,
    VaccinationSchedule
} from '../types/vaccination';
import { Animal } from '../../animals/types/animal';

// Hayvan türlerine göre ırklar
export const animalBreeds = {
    dog: [
        'Golden Retriever',
        'Labrador',
        'Alman Çoban Köpeği',
        'Bulldog',
        'Rottweiler',
        'Pitbull',
        'Husky',
        'Poodle',
        'Beagle',
        'Kangal',
        'Akbaş',
        'Diğer'
    ],
    cat: [
        'Persian',
        'British Shorthair',
        'Maine Coon',
        'Siamese',
        'Ragdoll',
        'Scottish Fold',
        'Sphynx',
        'Bengal',
        'Tekir',
        'Van Kedisi',
        'Ankara Kedisi',
        'Diğer'
    ],
    bird: [
        'Muhabbet Kuşu',
        'Kanarya',
        'Sultan Papağanı',
        'Jako',
        'Cennet Papağanı',
        'Güvercin',
        'Diğer'
    ],
    rabbit: [
        'Holland Lop',
        'Angora',
        'Rex',
        'Flemish Giant',
        'Mini Lop',
        'Diğer'
    ],
    hamster: [
        'Syrian Hamster',
        'Dwarf Hamster',
        'Roborovski',
        'Chinese Hamster',
        'Diğer'
    ],
    other: ['Diğer']
};

// Mock Data
export const mockVaccines: Vaccine[] = [
    {
        id: '1',
        name: 'Kuduz Aşısı',
        manufacturer: 'VetBioTech',
        animalTypes: ['Köpek'],
        breeds: ['Tüm ırklar'],
        diseaseTargets: ['Kuduz Virüsü'],
        dose: '1 ml',
        expiryDate: '2024-12-31',
        serialNumber: 'VBT-KDZ-2024-001',
        stockQuantity: 6,
        stockStatus: 'low',
        applicationMethod: 'injection',
        sideEffects: ['Hafif ateş', 'enjeksiyon bölgesinde hassasiyet'],
        notes: 'Yıllık tekrar gerektirir'
    },
    {
        id: '2',
        name: 'Parvovirus Aşısı',
        manufacturer: 'PetVax',
        diseaseType: 'Parvovirus',
        animalType: 'dog',
        animalBreeds: ['Golden Retriever', 'Labrador', 'Alman Çoban Köpeği', 'Diğer'],
        dose: '0.5 ml',
        applicationMethod: 'injection',
        protectionPeriod: '2 ay',
        minimumAge: '6 hafta',
        sideEffects: ['İştahsızlık', 'letarji'],
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
        applicationMethod: 'nasal',
        protectionPeriod: '4 ay',
        minimumAge: '8 hafta',
        sideEffects: ['Hafif öksürük'],
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
        applicationMethod: 'injection',
        protectionPeriod: '2 ay',
        minimumAge: '6 hafta',
        sideEffects: ['Ateş', 'iştahsızlık'],
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
        applicationMethod: 'injection',
        protectionPeriod: '4 ay',
        minimumAge: '12 hafta',
        sideEffects: ['Ateş', 'hassasiyet'],
        notes: 'Risk altındaki köpekler için önerilir',
        isActive: true
    },
    {
        id: '6',
        name: 'Kedi Karma Aşısı (FVRCP)',
        manufacturer: 'FelineVax',
        diseaseType: 'Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia',
        animalType: 'cat',
        animalBreeds: ['Tüm ırklar'],
        dose: '1 ml',
        applicationMethod: 'injection',
        protectionPeriod: '3 ay',
        minimumAge: '8 hafta',
        sideEffects: ['Hafif ateş', 'letarji'],
        notes: 'Kediler için temel aşı',
        isActive: true
    },
    {
        id: '7',
        name: 'FeLV Aşısı',
        manufacturer: 'FelineVax',
        diseaseType: 'Feline Leukemia Virus',
        animalType: 'cat',
        animalBreeds: ['Persian', 'British Shorthair', 'Diğer'],
        dose: '1 ml',
        applicationMethod: 'injection',
        protectionPeriod: '12 ay',
        minimumAge: '12 hafta',
        sideEffects: ['Enjeksiyon yerinde şişlik'],
        notes: 'Dışarı çıkan kediler için önerilir',
        isActive: true
    }
];

export const mockVaccineStock: VaccineStock[] = [
    {
        id: '1',
        vaccineId: '1',
        serialNumber: 'VBT-KDZ-2024-001',
        batchNumber: 'BTH-2024-11',
        expiryDate: new Date('2024-11-15'),
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
        expiryDate: new Date('2024-09-20'),
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
        expiryDate: new Date('2024-10-05'),
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
        expiryDate: new Date('2024-12-22'),
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
        expiryDate: new Date('2024-11-30'),
        quantity: 4,
        unitPrice: 28.90,
        supplier: 'VetBioTech Distribütörü',
        receivedDate: '2024-05-30',
        isUsed: false
    },
    {
        id: '6',
        vaccineId: '6',
        serialNumber: 'FV-FVRCP-2024-001',
        batchNumber: 'BTH-2024-08',
        expiryDate: new Date('2024-08-15'),
        quantity: 15,
        unitPrice: 27.75,
        supplier: 'FelineVax Turkey',
        receivedDate: '2024-03-15',
        isUsed: false
    },
    {
        id: '7',
        vaccineId: '7',
        serialNumber: 'FV-FELV-2024-001',
        batchNumber: 'BTH-2024-09',
        expiryDate: new Date('2024-09-30'),
        quantity: 8,
        unitPrice: 35.00,
        supplier: 'FelineVax Turkey',
        receivedDate: '2024-04-30',
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
        expiryDate: new Date('2024-11-15'),
        message: 'Kuduz Aşısı stok seviyesi kritik: 6 adet kaldı!',
        createdDate: new Date('2024-07-08'),
        isRead: false,
        priority: 'high'
    },
    {
        id: '2',
        vaccineId: '2',
        vaccineName: 'Parvovirus Aşısı',
        alertType: 'low_stock',
        currentStock: 3,
        minimumStock: 15,
        expiryDate: new Date('2024-09-20'),
        message: 'Parvovirus Aşısı stok seviyesi kritik: 3 adet kaldı!',
        createdDate: new Date('2024-07-07'),
        isRead: false,
        priority: 'high'
    },
    {
        id: '3',
        vaccineId: '5',
        vaccineName: 'Leptospiroz Aşısı',
        alertType: 'expiring_soon',
        currentStock: 12,
        minimumStock: 10,
        expiryDate: new Date('2024-08-15'),
        message: 'Leptospiroz Aşısı yakında sona erecek: 15 Ağustos 2024',
        createdDate: new Date('2024-07-06'),
        isRead: false,
        priority: 'medium'
    }
];

// Service Functions
class VaccinationService {
    private vaccines: Vaccine[] = mockVaccines;
    private vaccineStock: VaccineStock[] = mockVaccineStock;
    private stockAlerts: StockAlert[] = mockStockAlerts;

    // Hayvan türüne göre ırkları getir
    getBreedsByAnimalType(animalType: string): string[] {
        return (animalBreeds as any)[animalType] || [];
    }

    // Aşı Listesi
    async getVaccines(filters?: VaccinationFilters): Promise<Vaccine[]> {
        let filtered = [...this.vaccines];

        if (filters?.animalType) {
            filtered = filtered.filter(v =>
                v.animalTypes?.includes(filters.animalType!) ||
                (v as any).animalType === filters.animalType // backward compatibility
            );
        }

        if (filters?.breed) {
            filtered = filtered.filter(v =>
                v.breeds?.includes(filters.breed!) ||
                v.breeds?.includes('Tüm ırklar') ||
                (v as any).animalBreeds?.includes(filters.breed!) || // backward compatibility
                (v as any).animalBreeds?.includes('Tüm ırklar')
            );
        }

        // Search functionality for vaccination card
        if (filters?.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(v =>
                v.name.toLowerCase().includes(searchTerm) ||
                v.manufacturer.toLowerCase().includes(searchTerm) ||
                v.diseaseTargets?.some(d => d.toLowerCase().includes(searchTerm)) ||
                (v as any).diseaseType?.toLowerCase().includes(searchTerm) // backward compatibility
            );
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
        const expiringStock = this.stockAlerts.filter(alert => alert.alertType === 'expiring_soon').length;

        return {
            totalVaccines: this.vaccines.length,
            totalStock,
            lowStockAlerts,
            totalAnimalsVaccinated: 248, // Mock veri
            thisMonthVaccinations: 42, // Mock veri
            upcomingVaccinations: 8, // Mock veri
            overdueVaccinations: 3, // Mock veri
            expiringStock
        };
    }

    // Stok Düşürme
    async useVaccine(serialNumber: string, animalId: string): Promise<boolean> {
        const stockIndex = this.vaccineStock.findIndex(stock =>
            stock.serialNumber === serialNumber && stock.quantity > 0
        );

        if (stockIndex === -1) {
            throw new Error('Aşı stokta bulunamadı veya zaten kullanılmış');
        }

        this.vaccineStock[stockIndex] = {
            ...this.vaccineStock[stockIndex],
            quantity: Math.max(0, this.vaccineStock[stockIndex].quantity - 1),
            usedDate: this.vaccineStock[stockIndex].quantity === 1 ? new Date().toISOString() : undefined,
            animalId: this.vaccineStock[stockIndex].quantity === 1 ? animalId : undefined
        };

        return true;
    }

    // Yeni Aşı Ekleme (Hem aşı hem de stok bilgileri ile)
    async addVaccine(vaccine: Omit<Vaccine, 'id'>, stockData?: Omit<VaccineStock, 'id' | 'vaccineId'>): Promise<Vaccine> {
        const newVaccineId = (this.vaccines.length + 1).toString();

        const newVaccine: Vaccine = {
            ...vaccine,
            id: newVaccineId
        };

        this.vaccines.push(newVaccine);

        // Eğer stok bilgileri verilmişse, stoku da ekle
        if (stockData) {
            await this.addVaccineStock(newVaccineId, stockData);
        }

        return newVaccine;
    }

    // Stok Ekleme
    async addVaccineStock(vaccineId: string, stockData: Omit<VaccineStock, 'id' | 'vaccineId'>): Promise<VaccineStock> {
        const newStock: VaccineStock = {
            ...stockData,
            id: (this.vaccineStock.length + 1).toString(),
            vaccineId
        };

        this.vaccineStock.push(newStock);
        return newStock;
    }

    // Aşı ve Stok Bilgilerini Birlikte Ekleme (Form için optimize edilmiş)
    async addVaccineWithStock(vaccineData: Omit<Vaccine, 'id'>, stockData: {
        serialNumber: string;
        batchNumber?: string;
        expiryDate?: string;
        quantity: number;
        unitPrice: number;
        supplier?: string;
        receivedDate: string;
    }): Promise<{ vaccine: Vaccine; stock: VaccineStock }> {
        // Önce aşıyı ekle
        const vaccine = await this.addVaccine(vaccineData);

        // Sonra stok bilgilerini ekle
        const stock = await this.addVaccineStock(vaccine.id, {
            serialNumber: stockData.serialNumber,
            batchNumber: stockData.batchNumber || '',
            expiryDate: stockData.expiryDate ? new Date(stockData.expiryDate) : new Date(),
            quantity: stockData.quantity,
            unitPrice: stockData.unitPrice,
            supplier: stockData.supplier || '',
            receivedDate: stockData.receivedDate
        });

        return { vaccine, stock };
    }

    // Eski Aşı Kartı Mock Data - Backward Compatibility
    async getVaccineCard(animalId: string): Promise<any | null> {
        // Bu mock data, gerçek implementasyonda hayvan veritabanından gelecek
        // Artık getAnimalVaccinationCard kullanın
        console.warn('getVaccineCard deprecated, use getAnimalVaccinationCard instead');
        return null;
    }

    // =============================================================================
    // AŞI KARNESİ YÖNETİM SİSTEMİ - YENİ METOTLAR
    // =============================================================================

    // Tüm hayvanları getir (aşı karnesi için)
    async getAllAnimals(): Promise<Animal[]> {
        // Mock data - gerçek implementasyonda animals service'den gelecek
        return [
            {
                id: 'animal1',
                name: 'Max',
                species: 'Köpek',
                breed: 'Golden Retriever',
                age: 2,
                gender: 'Erkek',
                weight: 25,
                color: 'Sarı',
                microchipId: 'MC123456789',
                owner: {
                    id: 'owner1',
                    name: 'Ahmet Yılmaz',
                    phone: '0555-123-4567',
                    email: 'ahmet@email.com',
                    address: 'İstanbul, Kadıköy'
                },
                status: 'active',
                createdAt: new Date('2023-01-15'),
                updatedAt: new Date('2024-01-15')
            },
            {
                id: 'animal2',
                name: 'Luna',
                species: 'Kedi',
                breed: 'Persian',
                age: 1,
                gender: 'Dişi',
                weight: 4,
                color: 'Beyaz',
                owner: {
                    id: 'owner2',
                    name: 'Fatma Demir',
                    phone: '0555-987-6543',
                    email: 'fatma@email.com',
                    address: 'Ankara, Çankaya'
                },
                status: 'active',
                createdAt: new Date('2023-06-20'),
                updatedAt: new Date('2024-01-20')
            },
            {
                id: 'animal3',
                name: 'Charlie',
                species: 'Köpek',
                breed: 'Labrador',
                age: 3,
                gender: 'Erkek',
                weight: 30,
                color: 'Kahverengi',
                microchipId: 'MC987654321',
                owner: {
                    id: 'owner3',
                    name: 'Mehmet Özkan',
                    phone: '0555-456-7890',
                    email: 'mehmet@email.com',
                    address: 'İzmir, Bornova'
                },
                status: 'active',
                createdAt: new Date('2022-08-10'),
                updatedAt: new Date('2024-01-10')
            }
        ];
    }

    // Hayvan aşı karnesini getir
    async getAnimalVaccinationCard(animalId: string): Promise<AnimalVaccinationCard> {
        const animals = await this.getAllAnimals();
        const animal = animals.find(a => a.id === animalId);

        if (!animal) {
            throw new Error('Hayvan bulunamadı');
        }

        // Mock aşı kayıtları
        const vaccinationHistory: VaccinationRecord[] = [
            {
                id: 'vac1',
                animalId: animal.id,
                animalName: animal.name,
                animalSpecies: animal.species,
                animalBreed: animal.breed,
                ownerId: animal.owner?.id || '',
                ownerName: animal.owner?.name || '',
                vaccineId: '1',
                vaccineName: 'Kuduz Aşısı',
                manufacturer: 'VetBioTech',
                batchNumber: 'VBT-KDZ-2024-001',
                applicationDate: new Date('2024-01-15'),
                nextDueDate: new Date('2025-01-15'),
                veterinarianId: 'vet1',
                veterinarianName: 'Dr. Ali Veli',
                applicationMethod: 'injection',
                applicationSite: 'Sol arka bacak',
                dose: '1 ml',
                certificateNumber: 'CERT-2024-001',
                isCompleted: true,
                notes: 'Normal reaksiyon, sorun yok'
            },
            {
                id: 'vac2',
                animalId: animal.id,
                animalName: animal.name,
                animalSpecies: animal.species,
                animalBreed: animal.breed,
                ownerId: animal.owner?.id || '',
                ownerName: animal.owner?.name || '',
                vaccineId: '4',
                vaccineName: 'Karma Aşı (DHPP)',
                manufacturer: 'PetVax',
                batchNumber: 'PV-DHPP-2024-002',
                applicationDate: new Date('2024-02-20'),
                nextDueDate: new Date('2024-08-20'),
                veterinarianId: 'vet1',
                veterinarianName: 'Dr. Ali Veli',
                applicationMethod: 'injection',
                applicationSite: 'Sağ arka bacak',
                dose: '1 ml',
                certificateNumber: 'CERT-2024-002',
                isCompleted: true,
                notes: 'Hafif ateş, 1 gün dinlendi'
            }
        ];

        // Mock yaklaşan aşılar
        const upcomingVaccinations: VaccinationSchedule[] = [
            {
                animalId: animal.id,
                vaccineId: '2',
                vaccineName: 'Parvovirus Aşısı',
                scheduledDate: new Date('2024-08-15'),
                isOverdue: false,
                priority: 'high',
                notes: 'Yıllık tekrar'
            }
        ];

        return {
            animalId: animal.id,
            animalName: animal.name,
            animalSpecies: animal.species,
            animalBreed: animal.breed,
            animalAge: animal.age,
            animalGender: animal.gender,
            animalWeight: animal.weight,
            animalColor: animal.color,
            microchipId: animal.microchipId,
            ownerId: animal.owner?.id || '',
            ownerName: animal.owner?.name || '',
            ownerPhone: animal.owner?.phone || '',
            ownerEmail: animal.owner?.email,
            ownerAddress: animal.owner?.address,
            vaccinationHistory,
            upcomingVaccinations,
            cardCreatedDate: new Date('2023-01-15'),
            lastUpdatedDate: new Date(),
            qrCode: `QR-${animal.id}`,
            clinicInfo: {
                name: 'HSS Veteriner Kliniği',
                address: 'Örnek Mah. Veteriner Cad. No:123, İstanbul',
                phone: '0212-555-0123',
                license: 'VET-LIC-2024-001',
                veterinarianName: 'Dr. Ali Veli',
                veterinarianLicense: 'DOC-LIC-12345'
            }
        };
    }

    // Aşı kaydı ekleme
    async addVaccinationRecord(animalId: string, vaccinationData: Partial<VaccinationRecord>): Promise<VaccinationRecord> {
        const animals = await this.getAllAnimals();
        const animal = animals.find(a => a.id === animalId);

        if (!animal) {
            throw new Error('Hayvan bulunamadı');
        }

        const newRecord: VaccinationRecord = {
            id: `vac-${Date.now()}`,
            animalId: animal.id,
            animalName: animal.name,
            animalSpecies: animal.species,
            animalBreed: animal.breed,
            ownerId: animal.owner?.id || '',
            ownerName: animal.owner?.name || '',
            vaccineId: vaccinationData.vaccineId || '',
            vaccineName: vaccinationData.vaccineName || '',
            manufacturer: vaccinationData.manufacturer || '',
            batchNumber: vaccinationData.batchNumber || '',
            applicationDate: vaccinationData.applicationDate || new Date(),
            nextDueDate: vaccinationData.nextDueDate,
            veterinarianId: vaccinationData.veterinarianId || 'vet1',
            veterinarianName: vaccinationData.veterinarianName || '',
            applicationMethod: vaccinationData.applicationMethod || 'injection',
            applicationSite: vaccinationData.applicationSite,
            dose: vaccinationData.dose || '',
            sideEffects: vaccinationData.sideEffects,
            notes: vaccinationData.notes,
            certificateNumber: vaccinationData.certificateNumber || `CERT-${Date.now()}`,
            isCompleted: vaccinationData.isCompleted ?? true
        };

        // Mock olarak kayıt eklendi kabul ediyoruz
        console.log('Yeni aşı kaydı eklendi:', newRecord);

        return newRecord;
    }

    // Aşı karnesini PDF olarak export etme
    async exportVaccinationCardPDF(animalId: string): Promise<Blob> {
        // Mock PDF oluşturma - gerçek implementasyonda PDF library kullanılacak
        const vaccinationCard = await this.getAnimalVaccinationCard(animalId);

        // Mock PDF content
        const pdfContent = `
AŞI KARNESİ
==========

Hayvan Bilgileri:
- Adı: ${vaccinationCard.animalName}
- Türü: ${vaccinationCard.animalSpecies}
- Irkı: ${vaccinationCard.animalBreed || 'Belirtilmemiş'}
- Yaşı: ${vaccinationCard.animalAge} yaş
- Cinsiyeti: ${vaccinationCard.animalGender}

Sahip Bilgileri:
- Adı: ${vaccinationCard.ownerName}
- Telefon: ${vaccinationCard.ownerPhone}

Aşı Geçmişi:
${vaccinationCard.vaccinationHistory.map(v =>
            `- ${v.applicationDate.toLocaleDateString('tr-TR')}: ${v.vaccineName} (${v.manufacturer})`
        ).join('\n')}

Klinik Bilgileri:
${vaccinationCard.clinicInfo.name}
${vaccinationCard.clinicInfo.address}
${vaccinationCard.clinicInfo.phone}
        `;

        // Mock Blob oluşturma
        return new Blob([pdfContent], { type: 'application/pdf' });
    }

    // Aşı geçmişini güncelle
    async updateVaccinationRecord(recordId: string, updateData: Partial<VaccinationRecord>): Promise<VaccinationRecord> {
        // Mock güncelleme
        console.log('Aşı kaydı güncellendi:', recordId, updateData);

        // Mocked updated record
        return {
            id: recordId,
            animalId: '',
            animalName: '',
            animalSpecies: '',
            ownerId: '',
            ownerName: '',
            vaccineId: '',
            vaccineName: '',
            manufacturer: '',
            batchNumber: '',
            applicationDate: new Date(),
            veterinarianId: '',
            veterinarianName: '',
            applicationMethod: 'injection',
            dose: '',
            isCompleted: true,
            ...updateData
        };
    }

    // Yaklaşan aşı hatırlatmaları
    async getUpcomingVaccinations(animalId?: string): Promise<VaccinationSchedule[]> {
        const allAnimals = await this.getAllAnimals();
        const targetAnimals = animalId ? allAnimals.filter(a => a.id === animalId) : allAnimals;

        // Mock upcoming vaccinations
        return targetAnimals.flatMap(animal => [
            {
                animalId: animal.id,
                vaccineId: '1',
                vaccineName: 'Kuduz Aşısı',
                scheduledDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 gün sonra
                isOverdue: false,
                priority: 'high' as const,
                notes: 'Yıllık tekrar'
            }
        ]);
    }

    // Geciken aşıları getir
    async getOverdueVaccinations(): Promise<VaccinationSchedule[]> {
        const upcoming = await this.getUpcomingVaccinations();
        return upcoming.filter(v => v.isOverdue);
    }
}

export const vaccinationService = new VaccinationService(); 