// API endpoints
export const API_ENDPOINTS = {
  // Animal endpoints
  ANIMALS: '/api/animals',
  ANIMALS_PAGED: '/api/animals/paged',
  ANIMALS_BASIC: '/api/animals/basic',
  ANIMALS_SEARCH_NAME: '/api/animals/search/name',
  ANIMALS_SEARCH_OWNER: '/api/animals/search/owner',
  ANIMALS_SEARCH_MICROCHIP: '/api/animals/search/microchip',
  ANIMALS_WITH_ALLERGIES: '/api/animals/with-allergies',
  ANIMALS_WITH_CHRONIC_DISEASES: '/api/animals/with-chronic-diseases',
  ANIMALS_BIRTHDAY_TODAY: '/api/animals/birthday-today',
  ANIMALS_BIRTHDAY_THIS_MONTH: '/api/animals/birthday-this-month',

  // Appointment endpoints
  APPOINTMENTS: '/api/appointments',
  APPOINTMENTS_PAGED: '/api/appointments/paged',
  APPOINTMENTS_BASIC: '/api/appointments/basic',
  APPOINTMENTS_CALENDAR: '/api/appointments/calendar',
  APPOINTMENTS_TODAY: '/api/appointments/today',
  APPOINTMENTS_UPCOMING: '/api/appointments/upcoming',
  APPOINTMENTS_DATE_RANGE: '/api/appointments/date-range',
  APPOINTMENTS_SEARCH_SUBJECT: '/api/appointments/search/subject',
  APPOINTMENTS_SEARCH_ANIMAL: '/api/appointments/search/animal',
  APPOINTMENTS_SEARCH_OWNER: '/api/appointments/search/owner',

  // Veterinarian endpoints
  VETERINARIANS: '/api/veterinarians',
  VETERINARIANS_BASIC: '/api/veterinarians/basic',

  // Owner endpoints
  OWNERS: '/api/owners',

  // Species and Breed endpoints
  SPECIES: '/api/species',
  BREEDS: '/api/breeds',

  // Medical records endpoints
  CLINICAL_EXAMINATIONS: '/api/clinical-examinations',
  DISEASE_HISTORY: '/api/disease-history',
  LAB_RESULTS: '/api/lab-results',
  LAB_TESTS: '/api/lab-tests',
  PATHOLOGY_FINDINGS: '/api/pathology-findings',
  RADIOLOGICAL_IMAGING: '/api/radiological-imaging',

  // Medication and Vaccine endpoints
  MEDICATIONS: '/api/medications',
  VACCINES: '/api/vaccines',
  VACCINATIONS: '/api/vaccinations',

  // Invoice endpoints
  INVOICES: '/api/invoices',
  INVOICE_RULES: '/api/invoice-rules',

  // Document endpoints
  DOCUMENTS: '/api/documents',

  // File endpoints
  FILES: '/api/files',

  // Communication and Reminder endpoints
  COMMUNICATIONS: '/api/communications',
  REMINDERS: '/api/reminders',

  // Stock Alert endpoints
  STOCK_ALERTS: '/api/stock-alerts',

  // Vaccination Schedule endpoints
  VACCINATION_SCHEDULES: '/api/vaccination-schedules',

  // Report Schedule endpoints
  REPORT_SCHEDULES: '/api/report-schedules',

  // Statistics endpoints
  STATISTICS: '/api/statistics',

  // Backup endpoints
  BACKUPS: '/api/backups',

  // User management endpoints
  USERS: '/api/users',


  // Stock endpoints
  STOCK: '/api/stock',
  // STOCK_ALERTS: '/api/stock/alerts', // Removed duplicate


  // Test endpoints
  TEST: '/api/test',
  SMS: '/api/sms',
} as const;

// Application routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  ANIMALS: '/animals',
  APPOINTMENTS: '/appointments',
  LABORATORY: '/laboratory',
  BILLING: '/billing',
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
