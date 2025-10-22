import { OFFLINE_MODE } from '../config/offline';
import { AnimalService } from '../features/animals/services/animalService';
import { MockAnimalService } from './mockAnimalService';
import { MockAppointmentService } from './mockAppointmentService';
import { MockOwnerService } from './mockOwnerService';

// Create singleton instances
const mockAnimalService = new MockAnimalService();
const mockAppointmentService = new MockAppointmentService();
const mockOwnerService = new MockOwnerService();
const realAnimalService = new AnimalService();

// Service factory that returns mock services when offline mode is enabled
export class ServiceFactory {
    static getAnimalService() {
        return OFFLINE_MODE ? mockAnimalService : realAnimalService;
    }

    static getAppointmentService() {
        if (OFFLINE_MODE) {
            return mockAppointmentService;
        } else {
            // Lazy load AppointmentService to avoid circular dependency
            const { AppointmentService } = require('../features/appointments/services/appointmentService');
            return new AppointmentService();
        }
    }

    static getOwnerService() {
        return mockOwnerService; // Always use mock for now since we don't have real owner service
    }
}

// Export individual services for easy access
export const animalService = ServiceFactory.getAnimalService();
export const ownerService = ServiceFactory.getOwnerService();

// Lazy export for appointmentService to avoid circular dependency
export const getAppointmentService = () => ServiceFactory.getAppointmentService();

// Export mock services directly for testing
export { MockAnimalService, MockAppointmentService, MockOwnerService };

export default ServiceFactory;
