// API endpoints
export const API_ENDPOINTS = {
  ANIMALS: '/api/animals',
  APPOINTMENTS: '/api/appointments',
  LABORATORY: '/api/laboratory',
  USERS: '/api/users',
} as const;

// Application routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  ANIMALS: '/animals',
  APPOINTMENTS: '/appointments',
  LABORATORY: '/laboratory',
} as const;

// Status types
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  COMPLETED: 'completed',
} as const;

// Animal species
export const ANIMAL_SPECIES = [
  'Köpek',
  'Kedi',
  'Kuş',
  'Tavşan',
  'Hamster',
  'Diğer'
] as const;

// Appointment status
export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const; 