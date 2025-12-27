import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { queryKeys } from '../../../lib/react-query';
import { StockService } from '../services/stockService';
import type { ApiResponse } from '../../../types/common';

/**
 * Hook to fetch all stock items
 */
export function useStock(
    options?: Omit<UseQueryOptions<ApiResponse<any[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.stock.items(),
        queryFn: () => StockService.getStock(),
        staleTime: 2 * 60 * 1000, // 2 minutes
        ...options,
    });
}

/**
 * Hook to fetch a single stock item by ID
 */
export function useStockItem(
    id: string | undefined,
    options?: Omit<UseQueryOptions<ApiResponse<any>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.stock.item(id!),
        queryFn: () => StockService.getStockById(id!),
        enabled: !!id,
        staleTime: 2 * 60 * 1000,
        ...options,
    });
}

/**
 * Hook to fetch products with filters
 */
export function useProducts(
    filters?: { category?: string; status?: string },
    options?: Omit<UseQueryOptions<ApiResponse<any[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: [...queryKeys.stock.all, 'products', filters],
        queryFn: () => StockService.getProducts(filters),
        staleTime: 2 * 60 * 1000,
        ...options,
    });
}

/**
 * Hook to fetch stock alerts
 */
export function useStockAlerts(
    options?: Omit<UseQueryOptions<ApiResponse<any[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: [...queryKeys.stock.all, 'alerts'],
        queryFn: () => StockService.getStockAlerts(),
        staleTime: 60 * 1000, // 1 minute
        ...options,
    });
}

/**
 * Hook to fetch stock movements
 */
export function useStockMovements(
    options?: Omit<UseQueryOptions<ApiResponse<any[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: [...queryKeys.stock.all, 'movements'],
        queryFn: () => StockService.getStockMovements(),
        staleTime: 60 * 1000,
        ...options,
    });
}

/**
 * Hook to fetch stock settings
 */
export function useStockSettings(
    options?: Omit<UseQueryOptions<ApiResponse<any>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: [...queryKeys.stock.all, 'settings'],
        queryFn: () => StockService.getStockSettings(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options,
    });
}

/**
 * Hook to fetch stock dashboard data
 */
export function useStockDashboard(
    options?: Omit<UseQueryOptions<ApiResponse<any>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: [...queryKeys.stock.all, 'dashboard'],
        queryFn: () => StockService.getStockDashboard(),
        staleTime: 2 * 60 * 1000,
        ...options,
    });
}

/**
 * Hook to fetch stock statistics
 */
export function useStockStats(
    options?: Omit<UseQueryOptions<ApiResponse<any>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: [...queryKeys.stock.all, 'stats'],
        queryFn: () => StockService.getStats(),
        staleTime: 2 * 60 * 1000,
        ...options,
    });
}

/**
 * Hook to fetch stock reports
 */
export function useStockReports(
    options?: Omit<UseQueryOptions<ApiResponse<any>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: [...queryKeys.stock.all, 'reports'],
        queryFn: () => StockService.getStockReports(),
        staleTime: 5 * 60 * 1000,
        ...options,
    });
}

/**
 * Hook to create a stock item
 */
export function useCreateStockItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (item: any) => StockService.createStockItem(item),

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.stock.items() });
            queryClient.invalidateQueries({ queryKey: [...queryKeys.stock.all, 'dashboard'] });
            queryClient.invalidateQueries({ queryKey: [...queryKeys.stock.all, 'stats'] });
        },
    });
}

/**
 * Hook to update a stock item
 */
export function useUpdateStockItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: any }) =>
            StockService.updateStockItem(id, updates),

        onMutate: async ({ id, updates }) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.stock.item(id) });
            const previousItem = queryClient.getQueryData(queryKeys.stock.item(id));

            queryClient.setQueryData(queryKeys.stock.item(id), (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    data: { ...old.data, ...updates },
                };
            });

            return { previousItem, id };
        },

        onError: (err, variables, context) => {
            if (context?.previousItem) {
                queryClient.setQueryData(
                    queryKeys.stock.item(context.id),
                    context.previousItem
                );
            }
        },

        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.stock.item(variables.id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.stock.items() });
            queryClient.invalidateQueries({ queryKey: [...queryKeys.stock.all, 'dashboard'] });
        },
    });
}

/**
 * Hook to delete a stock item
 */
export function useDeleteStockItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => StockService.deleteStockItem(id),

        onSettled: (data, error, id) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.stock.items() });
            queryClient.removeQueries({ queryKey: queryKeys.stock.item(id) });
            queryClient.invalidateQueries({ queryKey: [...queryKeys.stock.all, 'dashboard'] });
        },
    });
}

/**
 * Hook to create a product
 */
export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (product: any) => StockService.createProduct(product),

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [...queryKeys.stock.all, 'products'] });
        },
    });
}

/**
 * Hook to delete a product
 */
export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => StockService.deleteProduct(id),

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [...queryKeys.stock.all, 'products'] });
        },
    });
}

/**
 * Hook to record a stock movement
 */
export function useRecordMovement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (movement: any) => StockService.recordMovement(movement),

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [...queryKeys.stock.all, 'movements'] });
            queryClient.invalidateQueries({ queryKey: queryKeys.stock.items() });
            queryClient.invalidateQueries({ queryKey: [...queryKeys.stock.all, 'dashboard'] });
            queryClient.invalidateQueries({ queryKey: [...queryKeys.stock.all, 'stats'] });
        },
    });
}

/**
 * Hook to update stock settings
 */
export function useUpdateStockSettings() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (settings: any) => StockService.updateStockSettings(settings),

        onMutate: async (newSettings) => {
            await queryClient.cancelQueries({ queryKey: [...queryKeys.stock.all, 'settings'] });
            const previousSettings = queryClient.getQueryData([...queryKeys.stock.all, 'settings']);

            queryClient.setQueryData([...queryKeys.stock.all, 'settings'], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    data: { ...old.data, ...newSettings },
                };
            });

            return { previousSettings };
        },

        onError: (err, newSettings, context) => {
            if (context?.previousSettings) {
                queryClient.setQueryData(
                    [...queryKeys.stock.all, 'settings'],
                    context.previousSettings
                );
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [...queryKeys.stock.all, 'settings'] });
        },
    });
}
