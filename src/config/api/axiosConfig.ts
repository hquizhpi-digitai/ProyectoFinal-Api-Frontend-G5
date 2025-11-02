import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { config } from '../env';

const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// URL base para las llamadas API
// En desarrollo, usar el proxy de Vite (/api) para evitar problemas de CORS
// En producción, usar la URL completa del backend con /api incluido
const getApiBaseUrl = (): string => {
  // Si hay una variable de entorno específica para el backend API, usarla
  if (import.meta.env.VITE_API_BACKEND_URL) {
    return import.meta.env.VITE_API_BACKEND_URL;
  }
  // En desarrollo, usar el proxy de Vite
  if (import.meta.env.DEV) {
    return '/api';
  }
  // En producción, usar la URL completa del backend con /api incluido
  // ya que el backend espera rutas como /api/v1/dinardap
  const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://54.175.243.7:3000';
  return `${backendUrl}/api`;
};

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: getApiBaseUrl(),
    timeout: config.api.timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getAuthToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      // Log para debug en desarrollo
      if (import.meta.env.DEV) {
        console.log('📤 Request config:', {
          url: config.url,
          baseURL: config.baseURL,
          method: config.method,
          hasToken: !!token,
          headers: {
            ...config.headers,
            Authorization: token ? `Bearer ${token.substring(0, 20)}...` : 'none',
          },
        });
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        localStorage.removeItem('auth_token');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // Log detallado de errores en desarrollo
      if (import.meta.env.DEV && error.response) {
        const status = error.response.status;
        const message = error.response.data;
        
        console.error('❌ Error en respuesta:', {
          status,
          statusText: error.response.statusText,
          url: originalRequest?.url,
          message: message,
        });
        
        // Log especial para error de IP
        if (status === 403) {
          const errorMessage = typeof message === 'object' && message !== null 
            ? (message as any).message || (message as any).error 
            : message;
          
          if (typeof errorMessage === 'string' && 
              errorMessage.toLowerCase().includes('ip not allowed')) {
            console.warn('⚠️ IP no autorizada. El backend rechazó la solicitud por restricción de IP.');
          }
        }
      }

      if (error.code === 'ECONNABORTED') {
        return Promise.reject(new Error('La solicitud tardó demasiado tiempo. Por favor, intente nuevamente.'));
      }

      if (!error.response) {
        return Promise.reject(new Error('Error de conexión. Verifique su conexión a internet e intente nuevamente.'));
      }

      // Crear un error personalizado con mensaje amigable
      const friendlyError = new Error(handleApiError(error));
      (friendlyError as any).response = error.response;
      (friendlyError as any).status = error.response.status;
      return Promise.reject(friendlyError);
    }
  );

  return instance;
};

export const apiClient = createAxiosInstance();

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const responseData = error.response?.data;
    
    // Extraer el mensaje del backend (puede venir en diferentes formatos)
    let message = '';
    if (typeof responseData === 'object' && responseData !== null) {
      message = (responseData as any).message || (responseData as any).error || '';
    } else if (typeof responseData === 'string') {
      message = responseData;
    }
    
    // Manejo de errores específicos
    if (status === 403) {
      // Verificar si es error de IP no permitida
      const messageLower = message.toLowerCase();
      if (
        messageLower.includes('ip not allowed') || 
        messageLower.includes('ip no permitida') ||
        messageLower.includes('ip no autorizada') ||
        messageLower.includes('dirección ip')
      ) {
        return 'Su dirección IP no está autorizada para acceder a este servicio. Por favor, contacte a su administrador para solicitar soporte.';
      }
      return 'Acceso denegado. No tiene permisos para realizar esta acción.';
    }
    
    if (status === 401) {
      return 'Sesión expirada. Por favor, inicie sesión nuevamente.';
    }
    
    if (status === 404) {
      return 'El recurso solicitado no fue encontrado.';
    }
    
    if (status === 500) {
      return 'Error interno del servidor. Por favor, intente más tarde o contacte al soporte.';
    }
    
    // Mensaje genérico si hay un mensaje del servidor
    if (message) {
      return message;
    }
    
    return error.message || 'Ocurrió un error al procesar la solicitud.';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Ocurrió un error inesperado. Por favor, intente nuevamente.';
};
