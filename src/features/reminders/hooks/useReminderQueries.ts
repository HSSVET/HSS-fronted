import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { queryKeys } from '../../../lib/react-query';
import type { ApiResponse } from '../../../types/common';

// Note: Reminders service might not exist yet, these are placeholder hooks
// Update the service import path when service is available

/**
 * Hook to fetch all reminders
 */
export function useReminders(
    options?: Omit<UseQueryOptions<ApiResponse<any[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.reminders.lists(),
        queryFn: async () => ({ success: true, data: [] }), // Placeholder
        staleTime: 60 * 1000,
        ...options,
    });
}

/**
 * Hook to fetch upcoming reminders
 */
export function useUpcomingReminders(
    options?: Omit<UseQueryOptions<ApiResponse<any[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.reminders.upcoming(),
        queryFn: async () => ({ success: true, data: [] }), // Placeholder
        staleTime: 30 * 1000,
        ...options,
    });
}

/**
 * Hook to create a reminder
 */
export function useCreateReminder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (reminder: any) => ({ success: true, data: reminder }), // Placeholder
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.reminders.lists() });
            queryClient.invalidateQueries({ queryKey: queryKeys.reminders.upcoming() });
        },
    });
}

/**
 * Hook to delete a reminder
 */
export function useDeleteReminder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => ({ success: true }), // Placeholder
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.reminders.lists() });
            queryClient.invalidateQueries({ queryKey: queryKeys.reminders.upcoming() });
        },
    });
}
