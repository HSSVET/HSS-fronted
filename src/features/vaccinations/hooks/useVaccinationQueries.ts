import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { queryKeys } from '../../../lib/react-query';
import { VaccinationService } from '../services/vaccinationService';
import type { ApiResponse } from '../../../types/common';
import type {
    Vaccine,
    VaccineStock,
    VaccineStockAlert,
    VaccinationStats,
    VaccinationFilters,
    AnimalVaccinationCard,
    VaccinationRecord,
    VaccinationSchedule
} from '../types/vaccination';

/**
 * Hook to fetch vaccines with optional filters
 */
export function useVaccines(
    filters?: VaccinationFilters,
    options?: Omit<UseQueryOptions<ApiResponse<Vaccine[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.vaccinations.list(filters),
        queryFn: () => VaccinationService.getVaccines(filters),
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options,
    });
}

/**
 * Hook to fetch a single vaccine by ID
 */
export function useVaccine(
    id: string | undefined,
    options?: Omit<UseQueryOptions<ApiResponse<Vaccine>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.vaccinations.detail(id!),
        queryFn: () => VaccinationService.getVaccineById(id!),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        ...options,
    });
}

/**
 * Hook to fetch vaccination records
 */
export function useVaccinationRecords(
    animalId?: string,
    options?: Omit<UseQueryOptions<ApiResponse<VaccinationRecord[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: animalId
            ? [...queryKeys.vaccinations.all, 'records', 'animal', animalId]
            : [...queryKeys.vaccinations.all, 'records'],
        queryFn: () => VaccinationService.getVaccinationRecords(animalId),
        staleTime: 60 * 1000,
        ...options,
    });
}

/**
 * Hook to fetch vaccination schedule for an animal
 */
export function useVaccinationSchedule(
    animalId: string | undefined,
    options?: Omit<UseQueryOptions<ApiResponse<VaccinationSchedule[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: [...queryKeys.vaccinations.all, 'schedule', animalId],
        queryFn: () => VaccinationService.getVaccinationSchedule(animalId!),
        enabled: !!animalId,
        staleTime: 2 * 60 * 1000,
        ...options,
    });
}

/**
 * Hook to fetch animal vaccination card
 */
export function useAnimalVaccinationCard(
    animalId: string | undefined,
    options?: Omit<UseQueryOptions<ApiResponse<AnimalVaccinationCard>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: [...queryKeys.vaccinations.all, 'card', animalId],
        queryFn: () => VaccinationService.getAnimalVaccinationCard(animalId!),
        enabled: !!animalId,
        staleTime: 5 * 60 * 1000,
        ...options,
    });
}

/**
 * Hook to fetch due vaccinations
 */
export function useDueVaccinations(
    options?: Omit<UseQueryOptions<ApiResponse<VaccinationRecord[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: [...queryKeys.vaccinations.all, 'due'],
        queryFn: () => VaccinationService.getDueVaccinations(),
        staleTime: 2 * 60 * 1000,
        ...options,
    });
}

/**
 * Hook to fetch overdue vaccinations
 */
export function useOverdueVaccinations(
    options?: Omit<UseQueryOptions<ApiResponse<VaccinationRecord[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: [...queryKeys.vaccinations.all, 'overdue'],
        queryFn: () => VaccinationService.getOverdueVaccinations(),
        staleTime: 2 * 60 * 1000,
        ...options,
    });
}

/**
 * Hook to fetch upcoming vaccinations (combines due + overdue)
 */
export function useUpcomingVaccinations(
    options?: Omit<UseQueryOptions<ApiResponse<VaccinationRecord[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.vaccinations.upcoming(),
        queryFn: () => VaccinationService.getDueVaccinations(), // Uses due as upcoming
        staleTime: 2 * 60 * 1000,
        ...options,
    });
}

/**
 * Hook to fetch vaccine stock
 */
export function useVaccineStock(
    options?: Omit<UseQueryOptions<ApiResponse<VaccineStock[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: [...queryKeys.vaccinations.all, 'stock'],
        queryFn: () => VaccinationService.getVaccineStock(),
        staleTime: 5 * 60 * 1000,
        ...options,
    });
}

/**
 * Hook to fetch vaccine stock alerts
 */
export function useVaccineStockAlerts(
    options?: Omit<UseQueryOptions<ApiResponse<VaccineStockAlert[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: [...queryKeys.vaccinations.all, 'stock', 'alerts'],
        queryFn: () => VaccinationService.getStockAlerts(),
        staleTime: 5 * 60 * 1000,
        ...options,
    });
}

/**
 * Hook to fetch vaccination statistics
 */
export function useVaccinationStats(
    options?: Omit<UseQueryOptions<ApiResponse<VaccinationStats>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: [...queryKeys.vaccinations.all, 'stats'],
        queryFn: () => VaccinationService.getVaccinationStats(),
        staleTime: 5 * 60 * 1000,
        ...options,
    });
}

/**
 * Hook to create a vaccine
 */
export function useCreateVaccine() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (vaccine: Parameters<typeof VaccinationService.createVaccine>[0]) =>
            VaccinationService.createVaccine(vaccine),

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.vaccinations.lists() });
        },
    });
}

/**
 * Hook to update a vaccine
 */
export function useUpdateVaccine() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<Vaccine> }) =>
            VaccinationService.updateVaccine(id, updates),

        onMutate: async ({ id, updates }) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.vaccinations.detail(id) });
            const previousVaccine = queryClient.getQueryData(queryKeys.vaccinations.detail(id));

            queryClient.setQueryData(queryKeys.vaccinations.detail(id), (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    data: { ...old.data, ...updates },
                };
            });

            return { previousVaccine, id };
        },

        onError: (err, variables, context) => {
            if (context?.previousVaccine) {
                queryClient.setQueryData(
                    queryKeys.vaccinations.detail(context.id),
                    context.previousVaccine
                );
            }
        },

        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.vaccinations.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.vaccinations.lists() });
        },
    });
}

/**
 * Hook to delete a vaccine
 */
export function useDeleteVaccine() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => VaccinationService.deleteVaccine(id),

        onSettled: (data, error, id) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.vaccinations.lists() });
            queryClient.removeQueries({ queryKey: queryKeys.vaccinations.detail(id) });
        },
    });
}

/**
 * Hook to create a vaccination record
 */
export function useCreateVaccinationRecord() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (record: Parameters<typeof VaccinationService.createVaccinationRecord>[0]) =>
            VaccinationService.createVaccinationRecord(record),

        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({ queryKey: [...queryKeys.vaccinations.all, 'records'] });
            queryClient.invalidateQueries({ queryKey: queryKeys.vaccinations.upcoming() });
            if (variables.animalId) {
                queryClient.invalidateQueries({ queryKey: [...queryKeys.vaccinations.all, 'card', variables.animalId] });
            }
        },
    });
}

/**
 * Hook to update a vaccination record
 */
export function useUpdateVaccinationRecord() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<VaccinationRecord> }) =>
            VaccinationService.updateVaccinationRecord(id, updates),

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [...queryKeys.vaccinations.all, 'records'] });
            queryClient.invalidateQueries({ queryKey: queryKeys.vaccinations.upcoming() });
        },
    });
}

/**
 * Hook to create a vaccination schedule
 */
export function useCreateVaccinationSchedule() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (schedule: Parameters<typeof VaccinationService.createVaccinationSchedule>[0]) =>
            VaccinationService.createVaccinationSchedule(schedule),

        onSettled: (data, error, variables) => {
            if (variables.animalId) {
                queryClient.invalidateQueries({ queryKey: [...queryKeys.vaccinations.all, 'schedule', variables.animalId] });
            }
        },
    });
}

/**
 * Hook to update vaccine stock
 */
export function useUpdateVaccineStock() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ vaccineId, quantity }: { vaccineId: string; quantity: number }) =>
            VaccinationService.updateVaccineStock(vaccineId, quantity),

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [...queryKeys.vaccinations.all, 'stock'] });
        },
    });
}
