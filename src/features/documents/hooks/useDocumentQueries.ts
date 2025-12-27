import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { queryKeys } from '../../../lib/react-query';
import { documentService } from '../services/documentService';

/**
 * Hook to fetch all documents
 */
export function useDocuments(
    page: number = 0,
    size: number = 10,
    options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: [...queryKeys.documents.lists(), page, size],
        queryFn: () => documentService.getAllDocuments(page, size),
        staleTime: 2 * 60 * 1000,
        ...options,
    });
}

/**
 * Hook to fetch a single document by ID
 */
export function useDocument(
    id: number | undefined,
    options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.documents.detail(id!),
        queryFn: () => documentService.getDocumentById(id!),
        enabled: id !== undefined,
        staleTime: 5 * 60 * 1000,
        ...options,
    });
}

/**
 * Hook to fetch documents by animal ID
 */
export function useDocumentsByAnimal(
    animalId: number | undefined,
    options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: [...queryKeys.documents.all, 'animal', animalId],
        queryFn: () => documentService.getDocumentsByAnimal(animalId!),
        enabled: animalId !== undefined,
        staleTime: 2 * 60 * 1000,
        ...options,
    });
}

/**
 * Hook to create a document
 */
export function useCreateDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (document: any) => documentService.createDocument(document),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.documents.lists() });
        },
    });
}

/**
 * Hook to update a document
 */
export function useUpdateDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }: { id: number; updates: any }) =>
            documentService.updateDocument(id, updates),
        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.documents.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.documents.lists() });
        },
    });
}

/**
 * Hook to delete a document
 */
export function useDeleteDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => documentService.deleteDocument(id),
        onSettled: (data, error, id) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.documents.lists() });
            queryClient.removeQueries({ queryKey: queryKeys.documents.detail(id) });
        },
    });
}
