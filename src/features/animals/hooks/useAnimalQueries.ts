import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { queryKeys } from '../../../lib/react-query';
import { AnimalService, AnimalRecord, BasicAnimalRecord } from '../services/animalService';
import type { ApiResponse, PaginatedResponse } from '../../../types/common';
import type { Animal } from '../types/animal';

const animalService = new AnimalService();

/**
 * Hook to fetch paginated list of animals
 */
export function useAnimals(
    page: number = 0,
    limit: number = 10,
    search?: string,
    options?: Omit<UseQueryOptions<ApiResponse<PaginatedResponse<AnimalRecord>>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.animals.list({ page, limit, search }),
        queryFn: () => animalService.getAnimals(page, limit, search),
        staleTime: 30 * 1000, // 30 seconds
        ...options,
    });
}

/**
 * Hook to fetch all animals (non-paginated)
 */
export function useAllAnimals(
    options?: Omit<UseQueryOptions<ApiResponse<AnimalRecord[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.animals.all,
        queryFn: () => animalService.getAllAnimals(),
        staleTime: 60 * 1000, // 1 minute
        ...options,
    });
}

/**
 * Hook to fetch basic animals list (for dropdowns)
 */
export function useBasicAnimals(
    options?: Omit<UseQueryOptions<ApiResponse<BasicAnimalRecord[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.animals.lists(),
        queryFn: () => animalService.getBasicAnimals(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options,
    });
}

/**
 * Hook to fetch a single animal by ID
 */
export function useAnimal(
    id: string | undefined,
    options?: Omit<UseQueryOptions<ApiResponse<AnimalRecord>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.animals.detail(id!),
        queryFn: () => animalService.getAnimalById(id!),
        enabled: !!id,
        staleTime: 30 * 1000, // 30 seconds
        ...options,
    });
}

/**
 * Hook to create a new animal with optimistic updates
 */
export function useCreateAnimal() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (animal: Parameters<typeof animalService.createAnimal>[0]) =>
            animalService.createAnimal(animal),

        // Optimistic update
        onMutate: async (newAnimal) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: queryKeys.animals.lists() });

            // Snapshot previous value
            const previousAnimals = queryClient.getQueryData(queryKeys.animals.lists());

            // Optimistically update (optional - could show as "creating...")
            // We'll skip this for now and let the query refetch on success

            return { previousAnimals };
        },

        // On error, rollback
        onError: (err, newAnimal, context) => {
            if (context?.previousAnimals) {
                queryClient.setQueryData(queryKeys.animals.lists(), context.previousAnimals);
            }
        },

        // Always refetch after error or success
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.animals.lists() });
            queryClient.invalidateQueries({ queryKey: queryKeys.animals.all });
        },
    });
}

/**
 * Hook to update an existing animal with optimistic updates
 */
export function useUpdateAnimal() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Animal> }) =>
            animalService.updateAnimal(id, data),

        // Optimistic update
        onMutate: async ({ id, data }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: queryKeys.animals.detail(id) });

            // Snapshot previous value
            const previousAnimal = queryClient.getQueryData(queryKeys.animals.detail(id));

            // Optimistically update
            queryClient.setQueryData(queryKeys.animals.detail(id), (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    data: { ...old.data, ...data },
                };
            });

            return { previousAnimal, id };
        },

        // On error, rollback
        onError: (err, variables, context) => {
            if (context?.previousAnimal) {
                queryClient.setQueryData(
                    queryKeys.animals.detail(context.id),
                    context.previousAnimal
                );
            }
        },

        // Always refetch after error or success
        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.animals.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.animals.lists() });
            queryClient.invalidateQueries({ queryKey: queryKeys.animals.all });
        },
    });
}

/**
 * Hook to delete an animal with optimistic updates
 */
export function useDeleteAnimal() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => animalService.deleteAnimal(id),

        // Optimistic update
        onMutate: async (id) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: queryKeys.animals.lists() });

            // Snapshot previous value
            const previousAnimals = queryClient.getQueryData(queryKeys.animals.lists());

            // Optimistically remove from lists
            queryClient.setQueriesData({ queryKey: queryKeys.animals.lists() }, (old: any) => {
                if (!old?.data?.items) return old;
                return {
                    ...old,
                    data: {
                        ...old.data,
                        items: old.data.items.filter((animal: AnimalRecord) => animal.id.toString() !== id),
                    },
                };
            });

            return { previousAnimals, id };
        },

        // On error, rollback
        onError: (err, id, context) => {
            if (context?.previousAnimals) {
                queryClient.setQueryData(queryKeys.animals.lists(), context.previousAnimals);
            }
        },

        // Always refetch after error or success
        onSettled: (data, error, id) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.animals.lists() });
            queryClient.invalidateQueries({ queryKey: queryKeys.animals.all });
            queryClient.removeQueries({ queryKey: queryKeys.animals.detail(id) });
        },
    });
}

/**
 * Hook to search animals by name
 */
export function useSearchAnimalsByName(
    name: string,
    options?: Omit<UseQueryOptions<ApiResponse<AnimalRecord[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.animals.search(name),
        queryFn: () => animalService.searchByName(name),
        enabled: name.length > 0,
        staleTime: 10 * 1000, // 10 seconds
        ...options,
    });
}

/**
 * Hook to search animals by owner
 */
export function useSearchAnimalsByOwner(
    ownerName: string,
    options?: Omit<UseQueryOptions<ApiResponse<AnimalRecord[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.animals.search(`owner:${ownerName}`),
        queryFn: () => animalService.searchByOwner(ownerName),
        enabled: ownerName.length > 0,
        staleTime: 10 * 1000,
        ...options,
    });
}

/**
 * Hook to get animals with allergies
 */
export function useAnimalsWithAllergies(
    options?: Omit<UseQueryOptions<ApiResponse<AnimalRecord[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.animals.withAllergies(),
        queryFn: () => animalService.getAnimalsWithAllergies(),
        staleTime: 60 * 1000, // 1 minute
        ...options,
    });
}

/**
 * Hook to get animals with chronic diseases
 */
export function useAnimalsWithChronicDiseases(
    options?: Omit<UseQueryOptions<ApiResponse<AnimalRecord[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.animals.withChronicDiseases(),
        queryFn: () => animalService.getAnimalsWithChronicDiseases(),
        staleTime: 60 * 1000,
        ...options,
    });
}

/**
 * Hook to get animals with birthday today
 */
export function useAnimalsBirthdayToday(
    options?: Omit<UseQueryOptions<ApiResponse<AnimalRecord[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.animals.birthday('today'),
        queryFn: () => animalService.getAnimalsWithBirthdayToday(),
        staleTime: 60 * 60 * 1000, // 1 hour
        ...options,
    });
}

/**
 * Hook to get animals with birthday this month
 */
export function useAnimalsBirthdayThisMonth(
    options?: Omit<UseQueryOptions<ApiResponse<AnimalRecord[]>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.animals.birthday('month'),
        queryFn: () => animalService.getAnimalsWithBirthdayThisMonth(),
        staleTime: 60 * 60 * 1000, // 1 hour
        ...options,
    });
}
