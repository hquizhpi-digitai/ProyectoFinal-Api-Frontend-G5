import { useState } from 'react';
import { dinardapService } from '../services/dinardapService';
import { AuditoriaFilters, AuditLog, AuditoriaPagination } from '../types/dinardap.types';
import { handleApiError } from '../../../config/api/axiosConfig';

export const useAuditoria = () => {
  const [registros, setRegistros] = useState<AuditLog[]>([]);
  const [paginacion, setPaginacion] = useState<AuditoriaPagination | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AuditoriaFilters>({
    page: 1,
    limit: 50,
  });

  const buscar = async (newFilters?: AuditoriaFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const filtersToUse = newFilters || filters;
      const response = await dinardapService.auditoria(filtersToUse);
      
      if (response.success && response.data) {
        setRegistros(response.data.registros);
        setPaginacion(response.data.paginacion);
        setFilters(filtersToUse);
        return { success: true, data: response.data };
      } else {
        const errorMsg = response.message || 'Error al obtener los registros de auditoría';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      setRegistros([]);
      setPaginacion(null);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const cambiarPagina = (page: number) => {
    buscar({ ...filters, page });
  };

  const aplicarFiltros = (newFilters: AuditoriaFilters) => {
    buscar({ ...newFilters, page: 1 });
  };

  const reset = () => {
    setRegistros([]);
    setPaginacion(null);
    setError(null);
    setFilters({ page: 1, limit: 50 });
  };

  return {
    registros,
    paginacion,
    filters,
    isLoading,
    error,
    buscar,
    cambiarPagina,
    aplicarFiltros,
    reset,
  };
};

