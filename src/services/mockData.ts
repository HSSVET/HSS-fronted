// Mock data for development and testing
import type { Animal, AnimalOwner, MedicalRecord, Vaccination } from '../features/animals/types/animal';
import type { Appointment, AppointmentSlot } from '../features/appointments/types/appointment';

// Mock Animal Owners
export const mockOwners: AnimalOwner[] = [
    {
        id: '1',
        name: 'Ahmet Yılmaz',
        phone: '+90 532 123 45 67',
        email: 'ahmet.yilmaz@email.com',
        address: 'Kadıköy, İstanbul',
        emergencyContact: '+90 533 987 65 43'
    },
    {
        id: '2',
        name: 'Fatma Demir',
        phone: '+90 535 234 56 78',
        email: 'fatma.demir@email.com',
        address: 'Beşiktaş, İstanbul',
        emergencyContact: '+90 534 876 54 32'
    },
    {
        id: '3',
        name: 'Mehmet Kaya',
        phone: '+90 536 345 67 89',
        email: 'mehmet.kaya@email.com',
        address: 'Şişli, İstanbul',
        emergencyContact: '+90 537 765 43 21'
    },
    {
        id: '4',
        name: 'Ayşe Özkan',
        phone: '+90 537 456 78 90',
        email: 'ayse.ozkan@email.com',
        address: 'Beyoğlu, İstanbul',
        emergencyContact: '+90 538 654 32 10'
    },
    {
        id: '5',
        name: 'Ali Çelik',
        phone: '+90 538 567 89 01',
        email: 'ali.celik@email.com',
        address: 'Üsküdar, İstanbul',
        emergencyContact: '+90 539 543 21 09'
    }
];

// Mock Animals
export const mockAnimals: Animal[] = [
    {
        id: '1',
        name: 'Bella',
        species: 'Köpek',
        breed: 'Golden Retriever',
        age: 3,
        gender: 'Dişi',
        weight: 25.5,
        color: 'Altın',
        owner: mockOwners[0],
        status: 'active',
        notes: 'Çok sakin ve sevecen bir köpek',
        microchipId: 'TR001234567890',
        health: 'İyi',
        lastCheckup: '2024-01-15',
        nextVaccine: '2024-07-15',
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date('2024-01-15')
    },
    {
        id: '2',
        name: 'Maviş',
        species: 'Kedi',
        breed: 'British Shorthair',
        age: 2,
        gender: 'Erkek',
        weight: 4.2,
        color: 'Gri',
        owner: mockOwners[1],
        status: 'active',
        notes: 'Oyun oynamayı seven aktif kedi',
        microchipId: 'TR001234567891',
        health: 'İyi',
        lastCheckup: '2024-01-10',
        nextVaccine: '2024-06-10',
        createdAt: new Date('2023-03-20'),
        updatedAt: new Date('2024-01-10')
    },
    {
        id: '3',
        name: 'Cici',
        species: 'Kuş',
        breed: 'Muhabbet Kuşu',
        age: 1,
        gender: 'Dişi',
        weight: 0.05,
        color: 'Mavi',
        owner: mockOwners[2],
        status: 'active',
        notes: 'Konuşkan ve sosyal kuş',
        health: 'İyi',
        lastCheckup: '2024-01-05',
        nextVaccine: '2024-12-05',
        createdAt: new Date('2023-12-01'),
        updatedAt: new Date('2024-01-05')
    },
    {
        id: '4',
        name: 'Pamuk',
        species: 'Tavşan',
        breed: 'Hollanda Lop',
        age: 1,
        gender: 'Dişi',
        weight: 1.8,
        color: 'Beyaz',
        owner: mockOwners[3],
        status: 'active',
        notes: 'Çok temiz ve düzenli tavşan',
        health: 'İyi',
        lastCheckup: '2024-01-12',
        nextVaccine: '2024-07-12',
        createdAt: new Date('2023-06-15'),
        updatedAt: new Date('2024-01-12')
    },
    {
        id: '5',
        name: 'Max',
        species: 'Köpek',
        breed: 'Labrador',
        age: 5,
        gender: 'Erkek',
        weight: 30.0,
        color: 'Siyah',
        owner: mockOwners[4],
        status: 'active',
        notes: 'Enerjik ve oyuncu köpek',
        microchipId: 'TR001234567892',
        health: 'Tedavi Altında',
        lastCheckup: '2024-01-08',
        nextVaccine: '2024-04-08',
        createdAt: new Date('2022-08-10'),
        updatedAt: new Date('2024-01-08')
    },
    {
        id: '6',
        name: 'Luna',
        species: 'Kedi',
        breed: 'Persian',
        age: 4,
        gender: 'Dişi',
        weight: 3.8,
        color: 'Beyaz',
        owner: mockOwners[0],
        status: 'active',
        notes: 'Sakin ve uyumlu kedi',
        microchipId: 'TR001234567893',
        health: 'Kontrol Gerekli',
        lastCheckup: '2023-12-20',
        nextVaccine: '2024-03-20',
        createdAt: new Date('2022-05-15'),
        updatedAt: new Date('2023-12-20')
    }
];

// Mock Medical Records
export const mockMedicalRecords: MedicalRecord[] = [
    {
        id: '1',
        animalId: '1',
        veterinarianId: 'vet1',
        diagnosis: 'Rutin kontrol',
        treatment: 'Genel sağlık kontrolü',
        notes: 'Hayvan sağlıklı durumda',
        date: new Date('2024-01-15'),
        nextAppointment: new Date('2024-07-15'),
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
    },
    {
        id: '2',
        animalId: '2',
        veterinarianId: 'vet2',
        diagnosis: 'Aşı uygulaması',
        treatment: 'Karma aşı',
        notes: 'Aşı başarıyla uygulandı',
        date: new Date('2024-01-10'),
        nextAppointment: new Date('2024-06-10'),
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
    },
    {
        id: '3',
        animalId: '5',
        veterinarianId: 'vet1',
        diagnosis: 'Deri alerjisi',
        treatment: 'Antihistaminik tedavi',
        notes: 'Alerji belirtileri gözlemlendi, tedavi başlatıldı',
        date: new Date('2024-01-08'),
        nextAppointment: new Date('2024-01-22'),
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-08')
    }
];

// Mock Vaccinations
export const mockVaccinations: Vaccination[] = [
    {
        id: '1',
        animalId: '1',
        vaccineName: 'Karma Aşı (DHPP)',
        date: new Date('2024-01-15'),
        nextDueDate: new Date('2024-07-15'),
        veterinarianId: 'vet1',
        batchNumber: 'BATCH001',
        notes: 'Yıllık karma aşı uygulandı',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
    },
    {
        id: '2',
        animalId: '2',
        vaccineName: 'Karma Aşı (FVRCP)',
        date: new Date('2024-01-10'),
        nextDueDate: new Date('2024-06-10'),
        veterinarianId: 'vet2',
        batchNumber: 'BATCH002',
        notes: 'Kedi karma aşısı uygulandı',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
    },
    {
        id: '3',
        animalId: '5',
        vaccineName: 'Kuduz Aşısı',
        date: new Date('2024-01-08'),
        nextDueDate: new Date('2024-04-08'),
        veterinarianId: 'vet1',
        batchNumber: 'BATCH003',
        notes: 'Kuduz aşısı uygulandı',
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-08')
    }
];

// Mock Appointments
export const mockAppointments: Appointment[] = [
    {
        id: '1',
        animalId: '1',
        animalName: 'Bella',
        ownerName: 'Ahmet Yılmaz',
        ownerPhone: '+90 532 123 45 67',
        veterinarianId: 'vet1',
        veterinarianName: 'Dr. Mehmet Veteriner',
        date: new Date('2024-01-25'),
        startTime: '10:00',
        endTime: '10:30',
        type: 'checkup',
        status: 'scheduled',
        reason: 'Rutin kontrol',
        notes: 'Yıllık genel sağlık kontrolü',
        estimatedDuration: 30,
        cost: 150,
        paid: false,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
    },
    {
        id: '2',
        animalId: '2',
        animalName: 'Maviş',
        ownerName: 'Fatma Demir',
        ownerPhone: '+90 535 234 56 78',
        veterinarianId: 'vet2',
        veterinarianName: 'Dr. Ayşe Veteriner',
        date: new Date('2024-01-26'),
        startTime: '14:00',
        endTime: '14:45',
        type: 'vaccination',
        status: 'scheduled',
        reason: 'Aşı uygulaması',
        notes: 'Karma aşı uygulanacak',
        estimatedDuration: 45,
        cost: 200,
        paid: false,
        createdAt: new Date('2024-01-21'),
        updatedAt: new Date('2024-01-21')
    },
    {
        id: '3',
        animalId: '5',
        animalName: 'Max',
        ownerName: 'Ali Çelik',
        ownerPhone: '+90 538 567 89 01',
        veterinarianId: 'vet1',
        veterinarianName: 'Dr. Mehmet Veteriner',
        date: new Date('2024-01-22'),
        startTime: '09:00',
        endTime: '09:30',
        type: 'checkup',
        status: 'completed',
        reason: 'Alerji kontrolü',
        notes: 'Deri alerjisi takibi',
        estimatedDuration: 30,
        actualDuration: 25,
        cost: 180,
        paid: true,
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-22')
    },
    {
        id: '4',
        animalId: '6',
        animalName: 'Luna',
        ownerName: 'Ahmet Yılmaz',
        ownerPhone: '+90 532 123 45 67',
        veterinarianId: 'vet2',
        veterinarianName: 'Dr. Ayşe Veteriner',
        date: new Date('2024-01-27'),
        startTime: '11:00',
        endTime: '11:30',
        type: 'consultation',
        status: 'scheduled',
        reason: 'Genel danışmanlık',
        notes: 'Beslenme ve bakım önerileri',
        estimatedDuration: 30,
        cost: 120,
        paid: false,
        createdAt: new Date('2024-01-22'),
        updatedAt: new Date('2024-01-22')
    }
];

// Mock Appointment Slots
export const mockAppointmentSlots: AppointmentSlot[] = [
    {
        date: new Date('2024-01-25'),
        startTime: '09:00',
        endTime: '09:30',
        available: true,
        veterinarianId: 'vet1'
    },
    {
        date: new Date('2024-01-25'),
        startTime: '09:30',
        endTime: '10:00',
        available: false,
        veterinarianId: 'vet1'
    },
    {
        date: new Date('2024-01-25'),
        startTime: '10:00',
        endTime: '10:30',
        available: false,
        veterinarianId: 'vet1'
    },
    {
        date: new Date('2024-01-25'),
        startTime: '10:30',
        endTime: '11:00',
        available: true,
        veterinarianId: 'vet1'
    },
    {
        date: new Date('2024-01-26'),
        startTime: '14:00',
        endTime: '14:30',
        available: false,
        veterinarianId: 'vet2'
    },
    {
        date: new Date('2024-01-26'),
        startTime: '14:30',
        endTime: '15:00',
        available: true,
        veterinarianId: 'vet2'
    }
];

// Helper function to simulate API delay
export const simulateApiDelay = (ms: number = 500): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

// Helper function to generate random ID
export const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

// Helper function to filter data by search term
export const filterBySearch = <T>(
    data: T[],
    searchTerm: string,
    searchFields: (keyof T)[]
): T[] => {
    if (!searchTerm) return data;

    const term = searchTerm.toLowerCase();
    return data.filter(item =>
        searchFields.some(field => {
            const value = item[field];
            return value && String(value).toLowerCase().includes(term);
        })
    );
};

// Helper function to paginate data
export const paginateData = <T>(
    data: T[],
    page: number,
    limit: number
): { items: T[]; total: number; page: number; limit: number; totalPages: number } => {
    const startIndex = page * limit;
    const endIndex = startIndex + limit;
    const items = data.slice(startIndex, endIndex);
    const total = data.length;
    const totalPages = Math.ceil(total / limit);

    return {
        items,
        total,
        page,
        limit,
        totalPages
    };
};
