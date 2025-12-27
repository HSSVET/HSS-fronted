import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { queryKeys } from '../../../lib/react-query';
import type { ApiResponse } from '../../../types/common';

// SMS service hooks - update service import when available

/**
 * Hook to fetch SMS messages
 */
export function useSMSMessages(
    options?: Omit<UseQueryOptions<ApiResponse<any[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.sms.lists(),
        queryFn: async () => ({ success: true, data: [] }), // Placeholder
        staleTime: 2 * 60 * 1000,
        ...options,
    });
}

/**
 * Hook to fetch SMS templates
 */
export function useSMSTemplates(
    options?: Omit<UseQueryOptions<ApiResponse<any[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.sms.templates(),
        queryFn: async () => ({ success: true, data: [] }), // Placeholder
        staleTime: 10 * 60 * 1000,
        ...options,
    });
}

/**
 * Hook to send an SMS
 */
export function useSendSMS() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (smsData: any) => ({ success: true, data: smsData }), // Placeholder
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.sms.lists() });
        },
    });
}
