import { get, set, del } from 'idb-keyval';
import { PersistedClient, Persister } from '@tanstack/react-query-persist-client';

/**
 * Create an IndexedDB persister for React Query cache
 * This enables offline support by persisting query cache to IndexedDB
 */
export function createIDBPersister(idbValidKey: IDBValidKey = 'reactQueryCache') {
    return {
        persistClient: async (client: PersistedClient) => {
            await set(idbValidKey, client);
        },
        restoreClient: async () => {
            return await get<PersistedClient>(idbValidKey);
        },
        removeClient: async () => {
            await del(idbValidKey);
        },
    } as Persister;
}

/**
 * Cache buster key - increment this to invalidate all persisted cache
 * Useful when API structure changes or you need fresh data
 */
export const CACHE_BUSTER_KEY = 'v1';

/**
 * Maximum cache age in milliseconds (24 hours)
 * Cache older than this will be discarded on restore
 */
export const MAX_CACHE_AGE = 24 * 60 * 60 * 1000;
