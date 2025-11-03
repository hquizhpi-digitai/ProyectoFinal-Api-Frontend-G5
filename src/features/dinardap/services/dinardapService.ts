import { apiClient } from '../../../config/api/axiosConfig';
import {
  DinardapSearchParams,
  DinardapResponse,
  ConsultaCiudadanoResponse,
  ValidacionIdentidadResponse,
  AuditoriaResponse,
  AuditoriaFilters,
} from '../types/dinardap.types';

export const dinardapService = {
  // Búsqueda adaptada: Si solo hay cédula, usa consulta-ciudadano
  // Si hay otros parámetros, lanza error ya que el backend no soporta búsqueda por nombres/apellidos
  search: async (params: DinardapSearchParams): Promise<DinardapResponse> => {
    console.log('🔍 Buscando en DINARDAP:', params);
    
    // Si solo hay cédula, usar el endpoint de consulta-ciudadano directamente
    if (params.cedula && !params.nombres && !params.apellidos) {
      try {
        const url = `/v1/dinardap/consulta-ciudadano/${params.cedula}`;
        const response = await apiClient.get<ConsultaCiudadanoResponse>(url);
        
        if (response.data.success && response.data.data) {
          // Convertir la respuesta de consulta-ciudadano al formato de búsqueda
          return {
            data: [response.data.data as any],
            total: 1,
            message: response.data.message,
          };
        } else {
          return {
            data: [],
            total: 0,
            message: response.data.message || 'No se encontraron resultados',
          };
        }
      } catch (error: any) {
        const status = error.response?.status;
        const responseData = error.response?.data;
        
        console.error('❌ Error en búsqueda DINARDAP:', {
          status,
          statusText: error.response?.statusText,
          data: responseData,
          message: error.message,
        });
        
        throw error;
      }
    }
    
    // Si hay nombres o apellidos pero no hay endpoint para eso, lanzar error informativo
    if (params.nombres || params.apellidos) {
      throw new Error('La búsqueda por nombres o apellidos no está disponible. Por favor, use solo el número de cédula.');
    }
    
    // Si no hay parámetros, lanzar error
    throw new Error('Debe proporcionar al menos un criterio de búsqueda (cédula)');
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/v1/dinardap/${id}`);
    return response.data;
  },

  // Consulta Ciudadano - GET /api/v1/dinardap/consulta-ciudadano/:cedula
  consultaCiudadano: async (cedula: string): Promise<ConsultaCiudadanoResponse> => {
    try {
      const url = `/v1/dinardap/consulta-ciudadano/${cedula}`;
      console.log('🔍 Consultando ciudadano:', {
        cedula,
        url,
        baseURL: apiClient.defaults.baseURL,
        fullUrl: `${apiClient.defaults.baseURL}${url}`,
      });
      
      const response = await apiClient.get<ConsultaCiudadanoResponse>(url);
      
      console.log('✅ Consulta ciudadano exitosa:', {
        status: response.status,
        data: response.data,
      });
      return response.data;
    } catch (error: any) {
      console.error('❌ Error en consulta ciudadano:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      });
      throw error;
    }
  },

  // Validación de Identidad - GET /api/v1/dinardap/validacion-identidad/:cedula
  validacionIdentidad: async (cedula: string): Promise<ValidacionIdentidadResponse> => {
    try {
      const response = await apiClient.get<ValidacionIdentidadResponse>(
        `/v1/dinardap/validacion-identidad/${cedula}`
      );
      console.log('✅ Validación identidad exitosa:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error en validación identidad:', {
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },

  // Auditoría - GET /api/v1/dinardap/auditoria
  auditoria: async (filters: AuditoriaFilters = {}): Promise<AuditoriaResponse> => {
    try {
      const params = new URLSearchParams();
      
      if (filters.fechaInicio) params.append('fechaInicio', filters.fechaInicio);
      if (filters.fechaFin) params.append('fechaFin', filters.fechaFin);
      if (filters.cedula) params.append('cedula', filters.cedula);
      if (filters.usuario) params.append('usuario', filters.usuario);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const queryString = params.toString();
      const url = `/v1/dinardap/auditoria${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get<AuditoriaResponse>(url);
      console.log('✅ Auditoría obtenida exitosamente:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error en auditoría:', {
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },
};
