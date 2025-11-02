import { useState } from 'react';
import { dinardapService } from '../services/dinardapService';
import { DinardapSearchParams, DinardapResult } from '../types/dinardap.types';
import { handleApiError } from '../../../config/api/axiosConfig';

export const useDinardapSearch = () => {
  const [results, setResults] = useState<DinardapResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (params: DinardapSearchParams) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await dinardapService.search(params);
      setResults(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      setResults([]);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResults([]);
    setError(null);
  };

  return {
    results,
    isLoading,
    error,
    search,
    reset,
  };
};
