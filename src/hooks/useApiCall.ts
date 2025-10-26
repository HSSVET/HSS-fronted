import { useState, useCallback } from 'react';
import { useError } from '../context/ErrorContext';
import type { ApiResponse } from '../types/common';

// Import useLoading as named export
import { useLoading as useLoadingHook } from './useLoading';

export interface UseApiCallOptions {
  successMessage?: string;
  errorMessage?: string;
  showLoading?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

/**
 * Custom hook that wraps API calls with automatic loading and error handling
 * 
 * @example
 * const { call: createAnimal, loading, error } = useApiCall(animalService.createAnimal);
 * 
 * const handleCreate = async () => {
 *   const result = await createAnimal(
 *     { name: 'Max', ... },
 *     { 
 *       successMessage: 'Hayvan başarıyla oluşturuldu!',
 *       errorMessage: 'Hayvan oluşturulamadı!'
 *     }
 *   );
 * };
 */
export function useApiCall<T = any>(
  apiCall: (...args: any[]) => Promise<ApiResponse<T>>,
  options: UseApiCallOptions = {}
) {
  const { startLoading, stopLoading } = useLoadingHook();
  const { showSuccess, showError } = useError();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const call = useCallback(
    async (...args: any[]) => {
      setLoading(true);
      setError(null);

      const {
        successMessage,
        errorMessage,
        showLoading: showLoadingSpinner = true,
        onSuccess,
        onError,
      } = options;

      try {
        if (showLoadingSpinner) {
          startLoading();
        }

        const response = await apiCall(...args);

        if (response.success) {
          setData(response.data);
          
          if (successMessage) {
            showSuccess(successMessage);
          }
          
          if (onSuccess) {
            onSuccess(response.data);
          }

          return response;
        } else {
          const error = new Error(response.error || 'Bir hata oluştu');
          setError(error);
          
          if (errorMessage || response.error) {
            showError(errorMessage || response.error || 'İşlem başarısız!');
          }
          
          if (onError) {
            onError(error);
          }

          return response;
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Bilinmeyen bir hata oluştu');
        setError(error);
        
        if (errorMessage || error.message) {
          showError(errorMessage || error.message);
        }
        
        if (onError) {
          onError(error);
        }

        throw error;
      } finally {
        setLoading(false);
        if (showLoadingSpinner) {
          stopLoading();
        }
      }
    },
    [apiCall, options, startLoading, stopLoading, showSuccess, showError]
  );

  const reset = useCallback(() => {
    setError(null);
    setData(null);
    setLoading(false);
  }, []);

  return {
    call,
    loading,
    error,
    data,
    reset,
  };
}

export default useApiCall;
