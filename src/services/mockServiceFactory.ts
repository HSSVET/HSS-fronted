// Import types only to avoid circular dependency
import type { AnimalService as AnimalServiceType } from '../features/animals/services/animalService';
import type { AppointmentService as AppointmentServiceType } from '../features/appointments/services/appointmentService';

// Lazy import to avoid circular dependency
let realAnimalService: AnimalServiceType | null = null;
let realAppointmentService: AppointmentServiceType | null = null;

// Service factory that returns real services
export class ServiceFactory {
    static getAnimalService(): AnimalServiceType {
        if (!realAnimalService) {
            // Lazy load to avoid circular dependency
            const { AnimalService } = require('../features/animals/services/animalService');
            realAnimalService = new AnimalService();
        }
        return realAnimalService!;
    }

    static getAppointmentService(): AppointmentServiceType {
        if (!realAppointmentService) {
            // Lazy load to avoid circular dependency
            const { AppointmentService } = require('../features/appointments/services/appointmentService');
            realAppointmentService = new AppointmentService();
        }
        return realAppointmentService!;
    }

    static getOwnerService() {
        // Owner service doesn't exist yet, return null
        return null;
    }
}

// Export individual services for easy access (lazy loaded)
export const getAnimalService = () => ServiceFactory.getAnimalService();
export const getOwnerService = () => ServiceFactory.getOwnerService();
export const getAppointmentService = () => ServiceFactory.getAppointmentService();

export default ServiceFactory;
