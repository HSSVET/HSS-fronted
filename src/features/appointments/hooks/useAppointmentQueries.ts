import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { queryKeys } from '../../../lib/react-query';
import { AppointmentService, AppointmentRecord } from '../services/appointmentService';
import type { ApiResponse, PaginatedResponse } from '../../../types/common';
import type { Appointment, AppointmentSlot, CalendarAppointmentPayload, CreateAppointmentRequest } from '../types/appointment';

const appointmentService = new AppointmentService();

/**
 * Hook to fetch paginated appointments
 */
export function useAppointments(
    page: number = 0,
    limit: number = 10,
    status?: string,
    veterinarianId?: string,
    options?: Omit<UseQueryOptions<ApiResponse<PaginatedResponse<AppointmentRecord>>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.appointments.list({ page, limit, status, veterinarianId }),
        queryFn: () => appointmentService.getAppointments(page, limit, status, veterinarianId),
        staleTime: 30 * 1000, // 30 seconds
        ...options,
    });
}

/**
 * Hook to fetch all appointments (non-paginated)
 */
export function useAllAppointments(
    options?: Omit<UseQueryOptions<ApiResponse<AppointmentRecord[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.appointments.all,
        queryFn: () => appointmentService.getAllAppointments(),
        staleTime: 30 * 1000,
        ...options,
    });
}

/**
 * Hook to fetch a single appointment by ID
 */
export function useAppointment(
    id: string | undefined,
    options?: Omit<UseQueryOptions<ApiResponse<AppointmentRecord>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.appointments.detail(id!),
        queryFn: () => appointmentService.getAppointmentById(id!),
        enabled: !!id,
        staleTime: 30 * 1000,
        ...options,
    });
}

/**
 * Hook to fetch today's appointments
 */
export function useTodayAppointments(
    options?: Omit<UseQueryOptions<ApiResponse<AppointmentRecord[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.appointments.today(),
        queryFn: () => appointmentService.getTodayAppointments(),
        staleTime: 60 * 1000, // 1 minute
        ...options,
    });
}

/**
 * Hook to fetch upcoming appointments
 */
export function useUpcomingAppointments(
    options?: Omit<UseQueryOptions<ApiResponse<AppointmentRecord[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.appointments.upcoming(),
        queryFn: () => appointmentService.getUpcomingAppointments(),
        staleTime: 60 * 1000,
        ...options,
    });
}

/**
 * Hook to fetch calendar appointments for date range
 */
export function useCalendarAppointments(
    startDate: Date,
    endDate: Date,
    options?: Omit<UseQueryOptions<ApiResponse<CalendarAppointmentPayload[]>>, 'queryKey' | 'queryFn'>
) {
    const dateKey = `${startDate.toISOString()}_${endDate.toISOString()}`;

    return useQuery({
        queryKey: queryKeys.appointments.calendar(dateKey),
        queryFn: () => appointmentService.getCalendarAppointments(startDate, endDate),
        staleTime: 2 * 60 * 1000, // 2 minutes
        ...options,
    });
}

/**
 * Hook to fetch appointments by date range
 */
export function useAppointmentsByDateRange(
    startDate: Date,
    endDate: Date,
    veterinarianId?: string,
    options?: Omit<UseQueryOptions<ApiResponse<AppointmentRecord[]>>, 'queryKey' | 'queryFn'>
) {
    const dateKey = `${startDate.toISOString()}_${endDate.toISOString()}_${veterinarianId || 'all'}`;

    return useQuery({
        queryKey: [...queryKeys.appointments.all, 'date-range', dateKey],
        queryFn: () => appointmentService.getAppointmentsByDateRange(startDate, endDate, veterinarianId),
        staleTime: 60 * 1000,
        ...options,
    });
}

/**
 * Hook to fetch appointments by animal
 */
export function useAppointmentsByAnimal(
    animalId: string | undefined,
    options?: Omit<UseQueryOptions<ApiResponse<AppointmentRecord[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: [...queryKeys.appointments.all, 'animal', animalId],
        queryFn: () => appointmentService.getAppointmentsByAnimalId(animalId!),
        enabled: !!animalId,
        staleTime: 60 * 1000,
        ...options,
    });
}

/**
 * Hook to fetch available time slots
 */
export function useAvailableSlots(
    date: Date,
    veterinarianId?: string,
    options?: Omit<UseQueryOptions<ApiResponse<AppointmentSlot[]>>, 'queryKey' | 'queryFn'>
) {
    const dateKey = `${date.toISOString().split('T')[0]}_${veterinarianId || 'all'}`;

    return useQuery({
        queryKey: [...queryKeys.appointments.all, 'slots', dateKey],
        queryFn: () => appointmentService.getAvailableSlots(date, veterinarianId),
        staleTime: 2 * 60 * 1000, // 2 minutes
        ...options,
    });
}

/**
 * Hook to create a new appointment with optimistic updates
 */
export function useCreateAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (appointment: CreateAppointmentRequest) =>
            appointmentService.createAppointment(appointment),

        onMutate: async (newAppointment) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: queryKeys.appointments.lists() });

            // Snapshot previous value
            const previousAppointments = queryClient.getQueryData(queryKeys.appointments.lists());

            return { previousAppointments };
        },

        onError: (err, newAppointment, context) => {
            if (context?.previousAppointments) {
                queryClient.setQueryData(queryKeys.appointments.lists(), context.previousAppointments);
            }
        },

        onSettled: () => {
            // Invalidate all appointment queries
            queryClient.invalidateQueries({ queryKey: queryKeys.appointments.lists() });
            queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.appointments.today() });
            queryClient.invalidateQueries({ queryKey: queryKeys.appointments.upcoming() });
        },
    });
}

/**
 * Hook to update an appointment with optimistic updates
 */
export function useUpdateAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Appointment> }) =>
            appointmentService.updateAppointment(id, data),

        onMutate: async ({ id, data }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: queryKeys.appointments.detail(id) });

            // Snapshot previous value
            const previousAppointment = queryClient.getQueryData(queryKeys.appointments.detail(id));

            // Optimistically update
            queryClient.setQueryData(queryKeys.appointments.detail(id), (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    data: { ...old.data, ...data },
                };
            });

            return { previousAppointment, id };
        },

        onError: (err, variables, context) => {
            if (context?.previousAppointment) {
                queryClient.setQueryData(
                    queryKeys.appointments.detail(context.id),
                    context.previousAppointment
                );
            }
        },

        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.appointments.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.appointments.lists() });
            queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.appointments.today() });
            queryClient.invalidateQueries({ queryKey: queryKeys.appointments.upcoming() });
        },
    });
}

/**
 * Hook to delete an appointment with optimistic updates
 */
export function useDeleteAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => appointmentService.deleteAppointment(id),

        onMutate: async (id) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: queryKeys.appointments.lists() });

            // Snapshot previous value
            const previousAppointments = queryClient.getQueryData(queryKeys.appointments.lists());

            // Optimistically remove from lists
            queryClient.setQueriesData({ queryKey: queryKeys.appointments.lists() }, (old: any) => {
                if (!old?.data?.items) return old;
                return {
                    ...old,
                    data: {
                        ...old.data,
                        items: old.data.items.filter((apt: AppointmentRecord) => apt.appointmentId.toString() !== id),
                    },
                };
            });

            return { previousAppointments, id };
        },

        onError: (err, id, context) => {
            if (context?.previousAppointments) {
                queryClient.setQueryData(queryKeys.appointments.lists(), context.previousAppointments);
            }
        },

        onSettled: (data, error, id) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.appointments.lists() });
            queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.appointments.today() });
            queryClient.invalidateQueries({ queryKey: queryKeys.appointments.upcoming() });
            queryClient.removeQueries({ queryKey: queryKeys.appointments.detail(id) });
        },
    });
}

/**
 * Hook to cancel an appointment
 */
export function useCancelAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
            appointmentService.cancelAppointment(id, reason),

        onMutate: async ({ id }) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.appointments.detail(id) });
            const previousAppointment = queryClient.getQueryData(queryKeys.appointments.detail(id));

            // Optimistically update status
            queryClient.setQueryData(queryKeys.appointments.detail(id), (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    data: { ...old.data, status: 'CANCELLED' },
                };
            });

            return { previousAppointment, id };
        },

        onError: (err, variables, context) => {
            if (context?.previousAppointment) {
                queryClient.setQueryData(
                    queryKeys.appointments.detail(context.id),
                    context.previousAppointment
                );
            }
        },

        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.appointments.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.appointments.lists() });
            queryClient.invalidateQueries({ queryKey: queryKeys.appointments.today() });
        },
    });
}

/**
 * Hook to complete an appointment
 */
export function useCompleteAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
            appointmentService.completeAppointment(id, notes),

        onMutate: async ({ id }) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.appointments.detail(id) });
            const previousAppointment = queryClient.getQueryData(queryKeys.appointments.detail(id));

            // Optimistically update status
            queryClient.setQueryData(queryKeys.appointments.detail(id), (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    data: { ...old.data, status: 'COMPLETED' },
                };
            });

            return { previousAppointment, id };
        },

        onError: (err, variables, context) => {
            if (context?.previousAppointment) {
                queryClient.setQueryData(
                    queryKeys.appointments.detail(context.id),
                    context.previousAppointment
                );
            }
        },

        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.appointments.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.appointments.lists() });
            queryClient.invalidateQueries({ queryKey: queryKeys.appointments.today() });
        },
    });
}

/**
 * Hook to search appointments by subject
 */
export function useSearchAppointmentsBySubject(
    subject: string,
    options?: Omit<UseQueryOptions<ApiResponse<AppointmentRecord[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: [...queryKeys.appointments.all, 'search', 'subject', subject],
        queryFn: () => appointmentService.searchAppointmentsBySubject(subject),
        enabled: subject.length > 0,
        staleTime: 10 * 1000,
        ...options,
    });
}

/**
 * Hook to search appointments by animal name
 */
export function useSearchAppointmentsByAnimalName(
    animalName: string,
    options?: Omit<UseQueryOptions<ApiResponse<AppointmentRecord[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: [...queryKeys.appointments.all, 'search', 'animal', animalName],
        queryFn: () => appointmentService.searchAppointmentsByAnimalName(animalName),
        enabled: animalName.length > 0,
        staleTime: 10 * 1000,
        ...options,
    });
}
