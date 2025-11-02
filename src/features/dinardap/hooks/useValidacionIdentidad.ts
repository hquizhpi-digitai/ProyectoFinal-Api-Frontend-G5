import { useState } from 'react';
import { dinardapService } from '../services/dinardapService';
import { ValidacionIdentidadData } from '../types/dinardap.types';
import { handleApiError } from '../../../config/api/axiosConfig';

export const useValidacionIdentidad = () => {
  const [validacion, setValidacion] = useState<ValidacionIdentidadData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validar = async (cedula: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setValidacion(null);
      
      const response = await dinardapService.validacionIdentidad(cedula);
      
      if (response.success && response.data) {
        setValidacion(response.data);
        return { success: true, data: response.data };
      } else {
        const errorMsg = response.message || 'Error al validar la identidad';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      setValidacion(null);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setValidacion(null);
    setError(null);
  };

  return {
    validacion,
    isLoading,
    error,
    validar,
    reset,
  };
};

