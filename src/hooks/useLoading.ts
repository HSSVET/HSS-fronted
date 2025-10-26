import { useState, useCallback } from 'react';

export interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
  progress?: number;
}

export interface UseLoadingReturn {
  loading: LoadingState;
  setLoading: (isLoading: boolean, message?: string, progress?: number) => void;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
  updateProgress: (progress: number) => void;
  updateMessage: (message: string) => void;
}

export const useLoading = (): UseLoadingReturn => {
  const [loading, setLoadingState] = useState<LoadingState>({
    isLoading: false,
  });

  const setLoading = useCallback((
    isLoading: boolean, 
    message?: string, 
    progress?: number
  ) => {
    setLoadingState({
      isLoading,
      loadingMessage: message,
      progress,
    });
  }, []);

  const startLoading = useCallback((message?: string) => {
    setLoadingState({
      isLoading: true,
      loadingMessage: message,
      progress: 0,
    });
  }, []);

  const stopLoading = useCallback(() => {
    setLoadingState({
      isLoading: false,
    });
  }, []);

  const updateProgress = useCallback((progress: number) => {
    setLoadingState(prev => ({
      ...prev,
      progress: Math.min(100, Math.max(0, progress)),
    }));
  }, []);

  const updateMessage = useCallback((message: string) => {
    setLoadingState(prev => ({
      ...prev,
      loadingMessage: message,
    }));
  }, []);

  return {
    loading,
    setLoading,
    startLoading,
    stopLoading,
    updateProgress,
    updateMessage,
  };
};

export default useLoading;
