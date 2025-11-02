import { useState } from 'react';
import { dinardapService } from '../services/dinardapService';
import { CitizenInfo } from '../types/dinardap.types';
import { handleApiError } from '../../../config/api/axiosConfig';

export const useConsultaCiudadano = () => {
  const [citizen, setCitizen] = useState<CitizenInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const consultar = async (cedula: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setCitizen(null);
      
      const response = await dinardapService.consultaCiudadano(cedula);
      
      if (response.success && response.data) {
        setCitizen(response.data);
        return { success: true, data: response.data };
      } else {
        const errorMsg = response.message || 'No se encontró información para la cédula proporcionada';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      setCitizen(null);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setCitizen(null);
    setError(null);
  };

  return {
    citizen,
    isLoading,
    error,
    consultar,
    reset,
  };
};

