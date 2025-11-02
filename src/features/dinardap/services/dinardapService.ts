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
  search: async (params: DinardapSearchParams): Promise<DinardapResponse> => {
    console.log('🔍 Buscando en DINARDAP:', params);
    try {
      const response = await apiClient.post<DinardapResponse>('/v1/dinardap', params);
      console.log('✅ Respuesta DINARDAP:', response.data);
      return response.data;
    } catch (error: any) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      
      console.error('❌ Error en búsqueda DINARDAP:', {
        status,
        statusText: error.response?.statusText,
        data: responseData,
        message: error.message,
      });
      
      // Log especial para error de IP no permitida
      if (status === 403) {
        const errorMessage = typeof responseData === 'object' && responseData !== null
          ? (responseData as any).message || (responseData as any).error
          : responseData;
        
        if (typeof errorMessage === 'string' && 
            errorMessage.toLowerCase().includes('ip not allowed')) {
          console.warn('⚠️ IP no autorizada detectada:', {
            mensajeBackend: errorMessage,
            mensajeUsuario: 'Su dirección IP no está autorizada para acceder a este servicio. Por favor, contacte a su administrador para solicitar soporte.',
          });
        }
      }
      
      throw error;
    }
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/v1/dinardap/${id}`);
    return response.data;
  },

  // Consulta Ciudadano - GET /api/v1/dinardap/consulta-ciudadano/:cedula
  consultaCiudadano: async (cedula: string): Promise<ConsultaCiudadanoResponse> => {
    try {
      const response = await apiClient.get<ConsultaCiudadanoResponse>(
        `/v1/dinardap/consulta-ciudadano/${cedula}`
      );
      console.log('✅ Consulta ciudadano exitosa:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error en consulta ciudadano:', {
        status: error.response?.status,
        data: error.response?.data,
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
