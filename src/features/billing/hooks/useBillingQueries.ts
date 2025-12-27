import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { queryKeys } from '../../../lib/react-query';
import { BillingService } from '../services/billingService';
import type { ApiResponse } from '../../../types/common';
import type {
    Invoice,
    Payment,
    PaymentPlan,
    Service,
    BillingStatsData,
    InvoiceFilters,
    PaymentFilters,
    POSTerminal
} from '../types';

/**
 * Hook to fetch invoices with optional filters
 */
export function useInvoices(
    filters?: InvoiceFilters,
    options?: Omit<UseQueryOptions<ApiResponse<Invoice[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.billing.invoices(filters),
        queryFn: () => BillingService.getInvoices(filters),
        staleTime: 30 * 1000, // 30 seconds
        ...options,
    });
}

/**
 * Hook to fetch a single invoice by ID
 */
export function useInvoice(
    id: number | undefined,
    options?: Omit<UseQueryOptions<ApiResponse<Invoice>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.billing.invoice(id!),
        queryFn: () => BillingService.getInvoiceById(id!),
        enabled: id !== undefined,
        staleTime: 30 * 1000,
        ...options,
    });
}

/**
 * Hook to fetch payments with optional filters
 */
export function usePayments(
    filters?: PaymentFilters,
    options?: Omit<UseQueryOptions<ApiResponse<Payment[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.billing.payments(filters),
        queryFn: () => BillingService.getPayments(filters),
        staleTime: 30 * 1000,
        ...options,
    });
}

/**
 * Hook to fetch billing statistics
 */
export function useBillingStats(
    options?: Omit<UseQueryOptions<ApiResponse<BillingStatsData>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.billing.stats(),
        queryFn: () => BillingService.getBillingStats(),
        staleTime: 2 * 60 * 1000, // 2 minutes
        ...options,
    });
}

/**
 * Hook to fetch services (for creating invoices)
 */
export function useServices(
    options?: Omit<UseQueryOptions<ApiResponse<Service[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: [...queryKeys.billing.all, 'services'],
        queryFn: () => BillingService.getServices(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options,
    });
}

/**
 * Hook to fetch POS terminals
 */
export function usePOSTerminals(
    options?: Omit<UseQueryOptions<ApiResponse<POSTerminal[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: [...queryKeys.billing.all, 'pos-terminals'],
        queryFn: () => BillingService.getPOSTerminals(),
        staleTime: 10 * 60 * 1000, // 10 minutes
        ...options,
    });
}

/**
 * Hook to fetch payment plans
 */
export function usePaymentPlans(
    invoiceId?: number,
    options?: Omit<UseQueryOptions<ApiResponse<PaymentPlan[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: invoiceId
            ? [...queryKeys.billing.invoice(invoiceId), 'payment-plans']
            : [...queryKeys.billing.all, 'payment-plans'],
        queryFn: () => BillingService.getPaymentPlans(invoiceId),
        staleTime: 60 * 1000,
        ...options,
    });
}

/**
 * Hook to create a new invoice with optimistic updates
 */
export function useCreateInvoice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (invoiceData: Parameters<typeof BillingService.createInvoice>[0]) =>
            BillingService.createInvoice(invoiceData),

        onMutate: async (newInvoice) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.billing.lists() });
            const previousInvoices = queryClient.getQueryData(queryKeys.billing.lists());
            return { previousInvoices };
        },

        onError: (err, newInvoice, context) => {
            if (context?.previousInvoices) {
                queryClient.setQueryData(queryKeys.billing.lists(), context.previousInvoices);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.billing.lists() });
            queryClient.invalidateQueries({ queryKey: queryKeys.billing.stats() });
        },
    });
}

/**
 * Hook to update an invoice with optimistic updates
 */
export function useUpdateInvoice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }: { id: number; updates: Partial<Invoice> }) =>
            BillingService.updateInvoice(id, updates),

        onMutate: async ({ id, updates }) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.billing.invoice(id) });
            const previousInvoice = queryClient.getQueryData(queryKeys.billing.invoice(id));

            queryClient.setQueryData(queryKeys.billing.invoice(id), (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    data: { ...old.data, ...updates },
                };
            });

            return { previousInvoice, id };
        },

        onError: (err, variables, context) => {
            if (context?.previousInvoice) {
                queryClient.setQueryData(
                    queryKeys.billing.invoice(context.id),
                    context.previousInvoice
                );
            }
        },

        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.billing.invoice(variables.id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.billing.lists() });
            queryClient.invalidateQueries({ queryKey: queryKeys.billing.stats() });
        },
    });
}

/**
 * Hook to delete an invoice
 */
export function useDeleteInvoice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => BillingService.deleteInvoice(id),

        onSettled: (data, error, id) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.billing.lists() });
            queryClient.invalidateQueries({ queryKey: queryKeys.billing.stats() });
            queryClient.removeQueries({ queryKey: queryKeys.billing.invoice(id) });
        },
    });
}

/**
 * Hook to create a payment with optimistic updates
 */
export function useCreatePayment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (paymentData: Parameters<typeof BillingService.createPayment>[0]) =>
            BillingService.createPayment(paymentData),

        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.billing.payments() });
            queryClient.invalidateQueries({ queryKey: queryKeys.billing.stats() });
            if (variables.invoiceId) {
                queryClient.invalidateQueries({ queryKey: queryKeys.billing.invoice(variables.invoiceId) });
            }
        },
    });
}

/**
 * Hook to process card payment
 */
export function useProcessCardPayment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ amount, posTerminalId, cardType }: { amount: number; posTerminalId: string; cardType: string }) =>
            BillingService.processCardPayment(amount, posTerminalId, cardType),

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.billing.payments() });
        },
    });
}

/**
 * Hook to mark invoice as paid
 */
export function useMarkInvoiceAsPaid() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => BillingService.markInvoiceAsPaid(id),

        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.billing.invoice(id) });
            const previousInvoice = queryClient.getQueryData(queryKeys.billing.invoice(id));

            queryClient.setQueryData(queryKeys.billing.invoice(id), (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    data: { ...old.data, status: 'PAID' },
                };
            });

            return { previousInvoice, id };
        },

        onError: (err, id, context) => {
            if (context?.previousInvoice) {
                queryClient.setQueryData(
                    queryKeys.billing.invoice(context.id),
                    context.previousInvoice
                );
            }
        },

        onSettled: (data, error, id) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.billing.invoice(id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.billing.lists() });
            queryClient.invalidateQueries({ queryKey: queryKeys.billing.stats() });
        },
    });
}

/**
 * Hook to create a payment plan
 */
export function useCreatePaymentPlan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (planData: Parameters<typeof BillingService.createPaymentPlan>[0]) =>
            BillingService.createPaymentPlan(planData),

        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({ queryKey: [...queryKeys.billing.all, 'payment-plans'] });
            if (variables.invoiceId) {
                queryClient.invalidateQueries({ queryKey: queryKeys.billing.invoice(variables.invoiceId) });
            }
        },
    });
}

/**
 * Hook to fetch monthly report
 */
export function useMonthlyReport(
    year: number,
    month: number,
    options?: Omit<UseQueryOptions<ApiResponse<any>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: [...queryKeys.billing.all, 'reports', 'monthly', year, month],
        queryFn: () => BillingService.getMonthlyReport(year, month),
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options,
    });
}

/**
 * Hook to fetch yearly report
 */
export function useYearlyReport(
    year: number,
    options?: Omit<UseQueryOptions<ApiResponse<any>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: [...queryKeys.billing.all, 'reports', 'yearly', year],
        queryFn: () => BillingService.getYearlyReport(year),
        staleTime: 10 * 60 * 1000, // 10 minutes
        ...options,
    });
}
