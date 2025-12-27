import { QueryClient, DefaultOptions } from '@tanstack/react-query';

/**
 * Default options for React Query
 * These settings apply to all queries and mutations unless overridden
 */
const queryConfig: DefaultOptions = {
    queries: {
        // Time before data is considered stale
        staleTime: 1 * 60 * 1000, // 1 minute

        // Time before inactive queries are garbage collected
        gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)

        // Refetch on window focus
        refetchOnWindowFocus: true,

        // Refetch on reconnect
        refetchOnReconnect: true,

        // Retry failed requests
        retry: 3,

        // Retry delay (exponential backoff)
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

        // Enable network mode
        networkMode: 'online',
    },
    mutations: {
        // Retry failed mutations
        retry: 1,

        // Network mode for mutations
        networkMode: 'online',
    },
};

/**
 * Create and configure the React Query client
 */
export const queryClient = new QueryClient({
    defaultOptions: queryConfig,
});

/**
 * Query key factory for consistent cache keys
 * This helps with cache invalidation and prefetching
 */
export const queryKeys = {
    // Animals
    animals: {
        all: ['animals'] as const,
        lists: () => [...queryKeys.animals.all, 'list'] as const,
        list: (filters?: Record<string, any>) => [...queryKeys.animals.lists(), filters] as const,
        details: () => [...queryKeys.animals.all, 'detail'] as const,
        detail: (id: string | number) => [...queryKeys.animals.details(), id] as const,
        search: (query: string) => [...queryKeys.animals.all, 'search', query] as const,
        withAllergies: () => [...queryKeys.animals.all, 'with-allergies'] as const,
        withChronicDiseases: () => [...queryKeys.animals.all, 'with-chronic-diseases'] as const,
        birthday: (period: 'today' | 'month') => [...queryKeys.animals.all, 'birthday', period] as const,
    },

    // Appointments
    appointments: {
        all: ['appointments'] as const,
        lists: () => [...queryKeys.appointments.all, 'list'] as const,
        list: (filters?: Record<string, any>) => [...queryKeys.appointments.lists(), filters] as const,
        details: () => [...queryKeys.appointments.all, 'detail'] as const,
        detail: (id: string | number) => [...queryKeys.appointments.details(), id] as const,
        calendar: (date: string) => [...queryKeys.appointments.all, 'calendar', date] as const,
        today: () => [...queryKeys.appointments.all, 'today'] as const,
        upcoming: () => [...queryKeys.appointments.all, 'upcoming'] as const,
    },

    // Billing
    billing: {
        all: ['billing'] as const,
        lists: () => [...queryKeys.billing.all, 'list'] as const,
        invoices: (filters?: Record<string, any>) => [...queryKeys.billing.lists(), 'invoices', filters] as const,
        invoice: (id: string | number) => [...queryKeys.billing.all, 'invoice', id] as const,
        payments: (filters?: Record<string, any>) => [...queryKeys.billing.lists(), 'payments', filters] as const,
        stats: () => [...queryKeys.billing.all, 'stats'] as const,
    },

    // Laboratory
    laboratory: {
        all: ['laboratory'] as const,
        tests: () => [...queryKeys.laboratory.all, 'tests'] as const,
        test: (id: string | number) => [...queryKeys.laboratory.tests(), id] as const,
        results: () => [...queryKeys.laboratory.all, 'results'] as const,
        pending: () => [...queryKeys.laboratory.all, 'pending'] as const,
    },

    // Vaccinations
    vaccinations: {
        all: ['vaccinations'] as const,
        lists: () => [...queryKeys.vaccinations.all, 'list'] as const,
        list: (filters?: Record<string, any>) => [...queryKeys.vaccinations.lists(), filters] as const,
        detail: (id: string | number) => [...queryKeys.vaccinations.all, 'detail', id] as const,
        upcoming: () => [...queryKeys.vaccinations.all, 'upcoming'] as const,
    },

    // Stock/Inventory
    stock: {
        all: ['stock'] as const,
        items: () => [...queryKeys.stock.all, 'items'] as const,
        item: (id: string | number) => [...queryKeys.stock.items(), id] as const,
        lowStock: () => [...queryKeys.stock.all, 'low-stock'] as const,
        expiring: () => [...queryKeys.stock.all, 'expiring'] as const,
    },

    // Documents
    documents: {
        all: ['documents'] as const,
        lists: () => [...queryKeys.documents.all, 'list'] as const,
        detail: (id: string | number) => [...queryKeys.documents.all, 'detail', id] as const,
    },

    // Reminders
    reminders: {
        all: ['reminders'] as const,
        lists: () => [...queryKeys.reminders.all, 'list'] as const,
        upcoming: () => [...queryKeys.reminders.all, 'upcoming'] as const,
    },

    // SMS
    sms: {
        all: ['sms'] as const,
        lists: () => [...queryKeys.sms.all, 'list'] as const,
        templates: () => [...queryKeys.sms.all, 'templates'] as const,
    },

    // Reports
    reports: {
        all: ['reports'] as const,
        animals: (filters?: Record<string, any>) => [...queryKeys.reports.all, 'animals', filters] as const,
        appointments: (filters?: Record<string, any>) => [...queryKeys.reports.all, 'appointments', filters] as const,
        financial: (filters?: Record<string, any>) => [...queryKeys.reports.all, 'financial', filters] as const,
    },

    // Settings
    settings: {
        all: ['settings'] as const,
        clinic: () => [...queryKeys.settings.all, 'clinic'] as const,
        user: () => [...queryKeys.settings.all, 'user'] as const,
    },

    // Owners
    owners: {
        all: ['owners'] as const,
        lists: () => [...queryKeys.owners.all, 'list'] as const,
        detail: (id: string | number) => [...queryKeys.owners.all, 'detail', id] as const,
    },

    // Veterinarians
    veterinarians: {
        all: ['veterinarians'] as const,
        lists: () => [...queryKeys.veterinarians.all, 'list'] as const,
        detail: (id: string | number) => [...queryKeys.veterinarians.all, 'detail', id] as const,
    },
};

/**
 * Helper function to invalidate all queries for a specific module
 */
export const invalidateModule = (module: keyof typeof queryKeys) => {
    return queryClient.invalidateQueries({ queryKey: queryKeys[module].all });
};
