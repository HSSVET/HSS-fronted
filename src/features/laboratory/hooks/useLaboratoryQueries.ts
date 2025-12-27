import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { queryKeys } from '../../../lib/react-query';
import { LaboratoryService } from '../services/laboratoryService';
import type { ApiResponse, PaginatedResponse } from '../../../types/common';
import type { LabTest, TestType, CreateLabTestRequest } from '../types/laboratory';

/**
 * Hook to fetch paginated lab tests
 */
export function useLabTests(
    page: number = 1,
    limit: number = 10,
    status?: string,
    category?: string,
    options?: Omit<UseQueryOptions<ApiResponse<PaginatedResponse<LabTest>>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: [...queryKeys.laboratory.tests(), 'list', { page, limit, status, category }],
        queryFn: () => LaboratoryService.getLabTests(page, limit, status, category),
        staleTime: 30 * 1000, // 30 seconds
        ...options,
    });
}

/**
 * Hook to fetch a single lab test by ID
 */
export function useLabTest(
    id: string | undefined,
    options?: Omit<UseQueryOptions<ApiResponse<LabTest>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.laboratory.test(id!),
        queryFn: () => LaboratoryService.getLabTestById(id!),
        enabled: !!id,
        staleTime: 30 * 1000,
        ...options,
    });
}

/**
 * Hook to fetch test types
 */
export function useTestTypes(
    options?: Omit<UseQueryOptions<ApiResponse<TestType[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: [...queryKeys.laboratory.all, 'test-types'],
        queryFn: () => LaboratoryService.getTestTypes(),
        staleTime: 10 * 60 * 1000, // 10 minutes - rarely changes
        ...options,
    });
}

/**
 * Hook to fetch a single test type
 */
export function useTestType(
    id: string | undefined,
    options?: Omit<UseQueryOptions<ApiResponse<TestType>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: [...queryKeys.laboratory.all, 'test-type', id],
        queryFn: () => LaboratoryService.getTestTypeById(id!),
        enabled: !!id,
        staleTime: 10 * 60 * 1000,
        ...options,
    });
}

/**
 * Hook to fetch lab tests by animal
 */
export function useLabTestsByAnimal(
    animalId: string | undefined,
    options?: Omit<UseQueryOptions<ApiResponse<LabTest[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: [...queryKeys.laboratory.tests(), 'animal', animalId],
        queryFn: () => LaboratoryService.getLabTestsByAnimal(animalId!),
        enabled: !!animalId,
        staleTime: 60 * 1000,
        ...options,
    });
}

/**
 * Hook to fetch pending lab tests
 */
export function usePendingTests(
    options?: Omit<UseQueryOptions<ApiResponse<LabTest[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.laboratory.pending(),
        queryFn: () => LaboratoryService.getPendingTests(),
        staleTime: 30 * 1000,
        ...options,
    });
}

/**
 * Hook to fetch urgent lab tests
 */
export function useUrgentTests(
    options?: Omit<UseQueryOptions<ApiResponse<LabTest[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: [...queryKeys.laboratory.all, 'urgent'],
        queryFn: () => LaboratoryService.getUrgentTests(),
        staleTime: 30 * 1000,
        ...options,
    });
}

/**
 * Hook to fetch lab results with filters
 */
export function useLabResults(
    filters?: { animalId?: string; testType?: string },
    options?: Omit<UseQueryOptions<ApiResponse<any[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.laboratory.results(),
        queryFn: () => LaboratoryService.getLabResults(filters),
        staleTime: 60 * 1000,
        ...options,
    });
}

/**
 * Hook to create a lab test with optimistic updates
 */
export function useCreateLabTest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (test: CreateLabTestRequest) =>
            LaboratoryService.createLabTest(test),

        onMutate: async (newTest) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.laboratory.tests() });
            const previousTests = queryClient.getQueryData(queryKeys.laboratory.tests());
            return { previousTests };
        },

        onError: (err, newTest, context) => {
            if (context?.previousTests) {
                queryClient.setQueryData(queryKeys.laboratory.tests(), context.previousTests);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.laboratory.tests() });
            queryClient.invalidateQueries({ queryKey: queryKeys.laboratory.pending() });
        },
    });
}

/**
 * Hook to update a lab test
 */
export function useUpdateLabTest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, test }: { id: string; test: Partial<LabTest> }) =>
            LaboratoryService.updateLabTest(id, test),

        onMutate: async ({ id, test }) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.laboratory.test(id) });
            const previousTest = queryClient.getQueryData(queryKeys.laboratory.test(id));

            queryClient.setQueryData(queryKeys.laboratory.test(id), (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    data: { ...old.data, ...test },
                };
            });

            return { previousTest, id };
        },

        onError: (err, variables, context) => {
            if (context?.previousTest) {
                queryClient.setQueryData(
                    queryKeys.laboratory.test(context.id),
                    context.previousTest
                );
            }
        },

        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.laboratory.test(variables.id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.laboratory.tests() });
            queryClient.invalidateQueries({ queryKey: queryKeys.laboratory.pending() });
        },
    });
}

/**
 * Hook to delete a lab test
 */
export function useDeleteLabTest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => LaboratoryService.deleteLabTest(id),

        onSettled: (data, error, id) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.laboratory.tests() });
            queryClient.invalidateQueries({ queryKey: queryKeys.laboratory.pending() });
            queryClient.removeQueries({ queryKey: queryKeys.laboratory.test(id) });
        },
    });
}

/**
 * Hook to update test results
 */
export function useUpdateTestResults() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, results }: { id: string; results: any[] }) =>
            LaboratoryService.updateTestResults(id, results),

        onMutate: async ({ id, results }) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.laboratory.test(id) });
            const previousTest = queryClient.getQueryData(queryKeys.laboratory.test(id));

            queryClient.setQueryData(queryKeys.laboratory.test(id), (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    data: { ...old.data, results },
                };
            });

            return { previousTest, id };
        },

        onError: (err, variables, context) => {
            if (context?.previousTest) {
                queryClient.setQueryData(
                    queryKeys.laboratory.test(context.id),
                    context.previousTest
                );
            }
        },

        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.laboratory.test(variables.id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.laboratory.results() });
        },
    });
}

/**
 * Hook to complete a lab test
 */
export function useCompleteLabTest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, results, notes }: { id: string; results: any[]; notes?: string }) =>
            LaboratoryService.completeLabTest(id, results, notes),

        onMutate: async ({ id }) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.laboratory.test(id) });
            const previousTest = queryClient.getQueryData(queryKeys.laboratory.test(id));

            queryClient.setQueryData(queryKeys.laboratory.test(id), (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    data: { ...old.data, status: 'COMPLETED' },
                };
            });

            return { previousTest, id };
        },

        onError: (err, variables, context) => {
            if (context?.previousTest) {
                queryClient.setQueryData(
                    queryKeys.laboratory.test(context.id),
                    context.previousTest
                );
            }
        },

        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.laboratory.test(variables.id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.laboratory.tests() });
            queryClient.invalidateQueries({ queryKey: queryKeys.laboratory.pending() });
            queryClient.invalidateQueries({ queryKey: queryKeys.laboratory.results() });
        },
    });
}

/**
 * Hook to cancel a lab test
 */
export function useCancelLabTest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
            LaboratoryService.cancelLabTest(id, reason),

        onMutate: async ({ id }) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.laboratory.test(id) });
            const previousTest = queryClient.getQueryData(queryKeys.laboratory.test(id));

            queryClient.setQueryData(queryKeys.laboratory.test(id), (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    data: { ...old.data, status: 'CANCELLED' },
                };
            });

            return { previousTest, id };
        },

        onError: (err, variables, context) => {
            if (context?.previousTest) {
                queryClient.setQueryData(
                    queryKeys.laboratory.test(context.id),
                    context.previousTest
                );
            }
        },

        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.laboratory.test(variables.id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.laboratory.tests() });
            queryClient.invalidateQueries({ queryKey: queryKeys.laboratory.pending() });
        },
    });
}

/**
 * Hook to create a lab result
 */
export function useCreateLabResult() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (resultData: any) =>
            LaboratoryService.createLabResult(resultData),

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.laboratory.results() });
        },
    });
}
