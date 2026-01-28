import { useState, useEffect, useCallback } from 'react';
import { queueApi } from '../services/queueApi';
import type { QueueEntry } from '../types/queue.types';

interface UseQueueResult {
  queue: QueueEntry[];
  loading: boolean;
  error: string | null;
  refreshQueue: () => Promise<void>;
}

/**
 * Hook to fetch and manage queue data with auto-refresh
 */
export const useQueue = (refreshInterval: number = 30000): UseQueueResult => {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQueue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await queueApi.getActiveQueue();

      if (response.success && response.data) {
        setQueue(response.data);
      } else {
        setError(response.error || 'Failed to fetch queue');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  // Auto-refresh
  useEffect(() => {
    if (refreshInterval <= 0) return;

    const intervalId = setInterval(() => {
      fetchQueue();
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [refreshInterval, fetchQueue]);

  return {
    queue,
    loading,
    error,
    refreshQueue: fetchQueue,
  };
};
