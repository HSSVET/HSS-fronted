import type { Appointment, AppointmentSlot, CalendarAppointment, CalendarAppointmentPayload } from '../features/appointments/types/appointment';
import type { ApiResponse, PaginatedResponse } from '../types/common';
import {
    generateId,
    mockAppointments,
    mockAppointmentSlots,
    paginateData,
    simulateApiDelay
} from './mockData';

export interface AppointmentRecord {
    id: number;
    animal?: {
        id: number;
        name: string;
    };
    dateTime: string;
    subject?: string;
    veterinarianId?: number;
    veterinarianName?: string;
    owner?: {
        id: number;
        name: string;
    };
    googleCalendarEventId?: string;
    googleCalendarSynced?: boolean;
}

// Convert Appointment to AppointmentRecord format
const convertToAppointmentRecord = (appointment: Appointment): AppointmentRecord => ({
    id: parseInt(appointment.id),
    animal: {
        id: parseInt(appointment.animalId),
        name: appointment.animalName
    },
    dateTime: `${appointment.date.toISOString().split('T')[0]}T${appointment.startTime}:00`,
    subject: appointment.reason,
    veterinarianId: parseInt(appointment.veterinarianId),
    veterinarianName: appointment.veterinarianName,
    owner: {
        id: 1, // Mock owner ID
        name: appointment.ownerName
    },
    googleCalendarEventId: `mock_event_${appointment.id}`,
    googleCalendarSynced: Math.random() > 0.5
});

export class MockAppointmentService {
    // Get all appointments
    async getAllAppointments(): Promise<ApiResponse<AppointmentRecord[]>> {
        await simulateApiDelay();

        const appointments = mockAppointments.map(convertToAppointmentRecord);

        return {
            success: true,
            data: appointments,
            status: 200
        };
    }

    // Get all appointments with pagination
    async getAppointments(
        page: number = 0,
        limit: number = 10,
        status?: string,
        veterinarianId?: string
    ): Promise<ApiResponse<PaginatedResponse<AppointmentRecord>>> {
        await simulateApiDelay();

        let filteredAppointments = mockAppointments;

        if (status) {
            filteredAppointments = filteredAppointments.filter(apt => apt.status === status);
        }

        if (veterinarianId) {
            filteredAppointments = filteredAppointments.filter(apt => apt.veterinarianId === veterinarianId);
        }

        const appointmentRecords = filteredAppointments.map(convertToAppointmentRecord);
        const paginatedData = paginateData(appointmentRecords, page, limit);

        return {
            success: true,
            data: paginatedData,
            status: 200
        };
    }

    // Get basic appointments list for dropdowns
    async getBasicAppointments(): Promise<ApiResponse<any[]>> {
        await simulateApiDelay();

        const basicAppointments = mockAppointments.map(appointment => ({
            id: parseInt(appointment.id),
            animalName: appointment.animalName,
            ownerName: appointment.ownerName,
            dateTime: appointment.date.toISOString(),
            subject: appointment.reason
        }));

        return {
            success: true,
            data: basicAppointments,
            status: 200
        };
    }

    // Get appointment by ID
    async getAppointmentById(id: string): Promise<ApiResponse<AppointmentRecord>> {
        await simulateApiDelay();

        const appointment = mockAppointments.find(a => a.id === id);

        if (!appointment) {
            return {
                success: false,
                data: {} as AppointmentRecord,
                error: 'Appointment not found',
                status: 404
            };
        }

        return {
            success: true,
            data: convertToAppointmentRecord(appointment),
            status: 200
        };
    }

    // Create new appointment
    async createAppointment(appointment: any): Promise<ApiResponse<AppointmentRecord>> {
        await simulateApiDelay();

        const newAppointment: Appointment = {
            id: generateId(),
            animalId: appointment.animalId.toString(),
            animalName: 'New Animal', // This would be fetched from animal service
            ownerName: 'New Owner',
            ownerPhone: '+90 000 000 00 00',
            veterinarianId: appointment.veterinarianId?.toString() || 'vet1',
            veterinarianName: 'Dr. New Veterinarian',
            date: new Date(appointment.dateTime),
            startTime: new Date(appointment.dateTime).toTimeString().slice(0, 5),
            endTime: new Date(new Date(appointment.dateTime).getTime() + 30 * 60000).toTimeString().slice(0, 5),
            type: 'consultation',
            status: 'scheduled',
            reason: appointment.subject || 'New appointment',
            notes: '',
            estimatedDuration: 30,
            cost: 150,
            paid: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        mockAppointments.push(newAppointment);

        return {
            success: true,
            data: convertToAppointmentRecord(newAppointment),
            status: 201
        };
    }

    // Update appointment
    async updateAppointment(id: string, appointment: Partial<Appointment>): Promise<ApiResponse<AppointmentRecord>> {
        await simulateApiDelay();

        const index = mockAppointments.findIndex(a => a.id === id);

        if (index === -1) {
            return {
                success: false,
                data: {} as AppointmentRecord,
                error: 'Appointment not found',
                status: 404
            };
        }

        mockAppointments[index] = {
            ...mockAppointments[index],
            ...appointment,
            updatedAt: new Date()
        };

        return {
            success: true,
            data: convertToAppointmentRecord(mockAppointments[index]),
            status: 200
        };
    }

    // Delete appointment
    async deleteAppointment(id: string): Promise<ApiResponse<void>> {
        await simulateApiDelay();

        const index = mockAppointments.findIndex(a => a.id === id);

        if (index === -1) {
            return {
                success: false,
                data: undefined,
                error: 'Appointment not found',
                status: 404
            };
        }

        mockAppointments.splice(index, 1);

        return {
            success: true,
            data: undefined,
            status: 200
        };
    }

    // Get available slots
    async getAvailableSlots(
        date: Date,
        veterinarianId?: string
    ): Promise<ApiResponse<AppointmentSlot[]>> {
        await simulateApiDelay();

        const dateStr = date.toISOString().split('T')[0];
        let filteredSlots = mockAppointmentSlots.filter(slot =>
            slot.date.toISOString().split('T')[0] === dateStr
        );

        if (veterinarianId) {
            filteredSlots = filteredSlots.filter(slot => slot.veterinarianId === veterinarianId);
        }

        return {
            success: true,
            data: filteredSlots,
            status: 200
        };
    }

    // Cancel appointment
    async cancelAppointment(id: string, reason?: string): Promise<ApiResponse<AppointmentRecord>> {
        await simulateApiDelay();

        const index = mockAppointments.findIndex(a => a.id === id);

        if (index === -1) {
            return {
                success: false,
                data: {} as AppointmentRecord,
                error: 'Appointment not found',
                status: 404
            };
        }

        mockAppointments[index] = {
            ...mockAppointments[index],
            status: 'cancelled',
            notes: reason ? `${mockAppointments[index].notes}\nİptal nedeni: ${reason}` : mockAppointments[index].notes,
            updatedAt: new Date()
        };

        return {
            success: true,
            data: convertToAppointmentRecord(mockAppointments[index]),
            status: 200
        };
    }

    // Complete appointment
    async completeAppointment(id: string, notes?: string): Promise<ApiResponse<AppointmentRecord>> {
        await simulateApiDelay();

        const index = mockAppointments.findIndex(a => a.id === id);

        if (index === -1) {
            return {
                success: false,
                data: {} as AppointmentRecord,
                error: 'Appointment not found',
                status: 404
            };
        }

        mockAppointments[index] = {
            ...mockAppointments[index],
            status: 'completed',
            notes: notes ? `${mockAppointments[index].notes}\nTamamlanma notları: ${notes}` : mockAppointments[index].notes,
            actualDuration: mockAppointments[index].estimatedDuration,
            updatedAt: new Date()
        };

        return {
            success: true,
            data: convertToAppointmentRecord(mockAppointments[index]),
            status: 200
        };
    }

    // Get appointments by animal
    async getAppointmentsByAnimal(animalId: string): Promise<ApiResponse<AppointmentRecord[]>> {
        await simulateApiDelay();

        const filteredAppointments = mockAppointments.filter(apt => apt.animalId === animalId);

        return {
            success: true,
            data: filteredAppointments.map(convertToAppointmentRecord),
            status: 200
        };
    }

    // Get appointments by date range
    async getAppointmentsByDateRange(
        startDate: Date,
        endDate: Date,
        veterinarianId?: string
    ): Promise<ApiResponse<AppointmentRecord[]>> {
        await simulateApiDelay();

        let filteredAppointments = mockAppointments.filter(apt =>
            apt.date >= startDate && apt.date <= endDate
        );

        if (veterinarianId) {
            filteredAppointments = filteredAppointments.filter(apt => apt.veterinarianId === veterinarianId);
        }

        return {
            success: true,
            data: filteredAppointments.map(convertToAppointmentRecord),
            status: 200
        };
    }

    // Get appointments by animal ID
    async getAppointmentsByAnimalId(animalId: string): Promise<ApiResponse<AppointmentRecord[]>> {
        await simulateApiDelay();

        const filteredAppointments = mockAppointments.filter(apt => apt.animalId === animalId);

        return {
            success: true,
            data: filteredAppointments.map(convertToAppointmentRecord),
            status: 200
        };
    }

    // Get appointments by veterinarian ID
    async getAppointmentsByVeterinarianId(veterinarianId: string): Promise<ApiResponse<AppointmentRecord[]>> {
        await simulateApiDelay();

        const filteredAppointments = mockAppointments.filter(apt => apt.veterinarianId === veterinarianId);

        return {
            success: true,
            data: filteredAppointments.map(convertToAppointmentRecord),
            status: 200
        };
    }

    // Get appointments by owner ID
    async getAppointmentsByOwnerId(ownerId: string): Promise<ApiResponse<AppointmentRecord[]>> {
        await simulateApiDelay();

        // Mock implementation - in real app, you'd filter by owner ID
        const filteredAppointments = mockAppointments.filter((_, index) => index % 2 === 0);

        return {
            success: true,
            data: filteredAppointments.map(convertToAppointmentRecord),
            status: 200
        };
    }

    // Get appointments by specific date
    async getAppointmentsByDate(date: Date): Promise<ApiResponse<AppointmentRecord[]>> {
        await simulateApiDelay();

        const dateStr = date.toISOString().split('T')[0];
        const filteredAppointments = mockAppointments.filter(apt =>
            apt.date.toISOString().split('T')[0] === dateStr
        );

        return {
            success: true,
            data: filteredAppointments.map(convertToAppointmentRecord),
            status: 200
        };
    }

    // Get today's appointments
    async getTodayAppointments(): Promise<ApiResponse<AppointmentRecord[]>> {
        await simulateApiDelay();

        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const filteredAppointments = mockAppointments.filter(apt =>
            apt.date.toISOString().split('T')[0] === todayStr
        );

        return {
            success: true,
            data: filteredAppointments.map(convertToAppointmentRecord),
            status: 200
        };
    }

    // Get upcoming appointments
    async getUpcomingAppointments(): Promise<ApiResponse<AppointmentRecord[]>> {
        await simulateApiDelay();

        const today = new Date();
        const filteredAppointments = mockAppointments.filter(apt =>
            apt.date >= today && apt.status === 'scheduled'
        );

        return {
            success: true,
            data: filteredAppointments.map(convertToAppointmentRecord),
            status: 200
        };
    }

    // Search appointments by subject
    async searchAppointmentsBySubject(subject: string): Promise<ApiResponse<AppointmentRecord[]>> {
        await simulateApiDelay();

        const filteredAppointments = mockAppointments.filter(apt =>
            apt.reason.toLowerCase().includes(subject.toLowerCase())
        );

        return {
            success: true,
            data: filteredAppointments.map(convertToAppointmentRecord),
            status: 200
        };
    }

    // Search appointments by animal name
    async searchAppointmentsByAnimalName(animalName: string): Promise<ApiResponse<AppointmentRecord[]>> {
        await simulateApiDelay();

        const filteredAppointments = mockAppointments.filter(apt =>
            apt.animalName.toLowerCase().includes(animalName.toLowerCase())
        );

        return {
            success: true,
            data: filteredAppointments.map(convertToAppointmentRecord),
            status: 200
        };
    }

    // Search appointments by owner name
    async searchAppointmentsByOwnerName(ownerName: string): Promise<ApiResponse<AppointmentRecord[]>> {
        await simulateApiDelay();

        const filteredAppointments = mockAppointments.filter(apt =>
            apt.ownerName.toLowerCase().includes(ownerName.toLowerCase())
        );

        return {
            success: true,
            data: filteredAppointments.map(convertToAppointmentRecord),
            status: 200
        };
    }

    // Get calendar appointments
    async getCalendarAppointments(
        startDate: Date,
        endDate: Date
    ): Promise<ApiResponse<CalendarAppointmentPayload[]>> {
        await simulateApiDelay();

        // Generate some mock appointments for the current month
        const currentDate = new Date();
        const mockCalendarAppointments: CalendarAppointment[] = [
            {
                id: 1,
                title: 'Bella - Rutin Kontrol',
                start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18, 10, 0).toISOString(),
                end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18, 10, 30).toISOString(),
                backgroundColor: '#2196f3',
                textColor: '#ffffff',
                extendedProps: {
                    animalName: 'Bella',
                    ownerName: 'Ahmet Yılmaz',
                    veterinarianName: 'Dr. Mehmet Veteriner',
                    subject: 'Rutin Kontrol'
                }
            },
            {
                id: 2,
                title: 'Maviş - Aşı Uygulaması',
                start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20, 14, 0).toISOString(),
                end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20, 14, 45).toISOString(),
                backgroundColor: '#4caf50',
                textColor: '#ffffff',
                extendedProps: {
                    animalName: 'Maviş',
                    ownerName: 'Fatma Demir',
                    veterinarianName: 'Dr. Ayşe Veteriner',
                    subject: 'Aşı Uygulaması'
                }
            },
            {
                id: 3,
                title: 'Max - Tedavi Kontrolü',
                start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 22, 9, 30).toISOString(),
                end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 22, 10, 0).toISOString(),
                backgroundColor: '#ff9800',
                textColor: '#ffffff',
                extendedProps: {
                    animalName: 'Max',
                    ownerName: 'Ali Çelik',
                    veterinarianName: 'Dr. Mehmet Veteriner',
                    subject: 'Tedavi Kontrolü'
                }
            }
        ];

        // Filter appointments within the date range
        const filteredAppointments = mockCalendarAppointments.filter(apt => {
            const aptDate = new Date(apt.start);
            return aptDate >= startDate && aptDate <= endDate;
        });

        return {
            success: true,
            data: filteredAppointments as CalendarAppointmentPayload[],
            status: 200
        };
    }
}

// Legacy export for compatibility
export const appointmentService = MockAppointmentService;
export default MockAppointmentService;
