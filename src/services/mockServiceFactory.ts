import { OFFLINE_MODE } from '../config/offline';
import { AnimalService } from '../features/animals/services/animalService';
import { AppointmentService } from '../features/appointments/services/appointmentService';
import { MockAnimalService } from './mockAnimalService';
import { MockAppointmentService } from './mockAppointmentService';
import { MockOwnerService } from './mockOwnerService';

// Create singleton instances
const mockAnimalService = new MockAnimalService();
const mockAppointmentService = new MockAppointmentService();
const mockOwnerService = new MockOwnerService();

// Service factory that returns mock services when offline mode is enabled
export class ServiceFactory {
    static getAnimalService() {
        return OFFLINE_MODE ? mockAnimalService : AnimalService;
    }

    static getAppointmentService() {
        return OFFLINE_MODE ? mockAppointmentService : AppointmentService;
    }

    static getOwnerService() {
        return mockOwnerService; // Always use mock for now since we don't have real owner service
    }
}

// Export individual services for easy access
export const animalService = ServiceFactory.getAnimalService();
export const appointmentService = ServiceFactory.getAppointmentService();
export const ownerService = ServiceFactory.getOwnerService();

// Export mock services directly for testing
export { MockAnimalService, MockAppointmentService, MockOwnerService };

export default ServiceFactory;
