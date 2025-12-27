import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { queryClient } from './queryClient';
import { createIDBPersister, MAX_CACHE_AGE, CACHE_BUSTER_KEY } from './persistor';

interface QueryProviderProps {
    children: React.ReactNode;
    enablePersistence?: boolean;
}

/**
 * React Query Provider Component
 * Wraps the application with QueryClientProvider and optionally enables persistence
 */
export const QueryProvider: React.FC<QueryProviderProps> = ({
    children,
    enablePersistence = true
}) => {
    // Create persister for offline support
    const persister = React.useMemo(() => createIDBPersister(), []);

    // If persistence is enabled, use PersistQueryClientProvider
    if (enablePersistence) {
        return (
            <PersistQueryClientProvider
                client={queryClient}
                persistOptions={{
                    persister,
                    maxAge: MAX_CACHE_AGE,
                    buster: CACHE_BUSTER_KEY,
                }}
            >
                {children}
                {/* Only show devtools in development */}
                {process.env.NODE_ENV === 'development' && (
                    <ReactQueryDevtools
                        initialIsOpen={false}
                    />
                )}
            </PersistQueryClientProvider>
        );
    }

    // Otherwise, use regular QueryClientProvider
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools
                    initialIsOpen={false}
                />
            )}
        </QueryClientProvider>
    );
};
