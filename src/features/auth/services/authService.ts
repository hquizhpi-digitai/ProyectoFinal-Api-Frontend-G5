import axios from 'axios';
import { apiClient } from '../../../config/api/axiosConfig';
import { LoginCredentials, LoginResponse, OAuthTokenResponse } from '../types/auth.types';
import { config } from '../../../config/env';

// URL del backend de autenticación OAuth
// En desarrollo, usar el proxy de Vite para evitar problemas de CORS
// En producción, usar la URL completa
const getOAuthUrl = () => {
  if (import.meta.env.VITE_OAUTH_BACKEND_URL) {
    return `${import.meta.env.VITE_OAUTH_BACKEND_URL}/oauth/token`;
  }
  // En desarrollo, usar el proxy de Vite
  if (import.meta.env.DEV) {
    return '/oauth/token';
  }
  // En producción, usar la URL completa
      return 'http://54.175.243.7:3000/oauth/token';
};

// Función para convertir errores de OAuth en mensajes amigables
const getFriendlyAuthError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    const errorCode = error.response?.data?.error;
    const errorDescription = error.response?.data?.error_description;
    
    // Manejar errores específicos de OAuth
    if (errorCode === 'invalid_client') {
      return 'Usuario o contraseña incorrectos. Por favor, verifique sus credenciales e intente nuevamente.';
    }
    
    if (errorCode === 'unsupported_grant_type') {
      return 'Tipo de autenticación no soportado. Por favor, contacte al soporte técnico.';
    }
    
    if (errorCode === 'invalid_request') {
      return 'Solicitud inválida. Por favor, verifique que todos los campos estén completos.';
    }
    
    // Si hay una descripción del error, usarla si es útil
    if (errorDescription) {
      return errorDescription;
    }
    
    // Mensaje genérico según el código de estado
    if (error.response?.status === 401) {
      return 'Credenciales inválidas. Por favor, verifique su usuario y contraseña.';
    }
    
    if (error.response?.status === 400) {
      return 'Solicitud inválida. Por favor, verifique los datos ingresados.';
    }
    
    if (error.response?.status === 500) {
      return 'Error en el servidor. Por favor, intente más tarde o contacte al soporte.';
    }
    
    // Mensaje genérico
    return error.message || 'Error al iniciar sesión. Por favor, intente nuevamente.';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Error inesperado al iniciar sesión. Por favor, intente nuevamente.';
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const formData = new URLSearchParams();
      formData.append('grant_type', 'client_credentials');
      formData.append('client_id', credentials.email);
      formData.append('client_secret', credentials.password);

      const url = getOAuthUrl();
      const body = formData.toString();
      
      console.log('🔐 Intentando autenticación OAuth...');
      console.log('📍 URL:', url);
      console.log('📤 Body:', body.replace(/client_secret=[^&]*/, 'client_secret=***'));

      // Conexión usando proxy en desarrollo o directa en producción
      const response = await axios.post<OAuthTokenResponse>(
        url,
        body,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
          timeout: 30000,
        }
      );

      console.log('✅ Respuesta recibida:', {
        status: response.status,
        hasToken: !!response.data?.access_token,
        tokenType: response.data?.token_type,
        expiresIn: response.data?.expires_in,
      });

      return {
        token: response.data.access_token,
        user: {
          id: credentials.email,
          email: credentials.email,
          name: credentials.email,
        },
      };
    } catch (error) {
      console.error('❌ Error en autenticación:', error);
      
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorCode = error.response?.data?.error;
        const errorData = error.response?.data;
        
        console.error('📋 Detalles del error:', {
          status,
          statusText: error.response?.statusText,
          errorCode,
          data: errorData,
          message: error.message,
        });
        
        // Log especial para error de credenciales inválidas
        if (errorCode === 'invalid_client' || status === 401) {
          console.warn('⚠️ Credenciales inválidas detectadas:', {
            errorCode,
            mensajeUsuario: 'Usuario o contraseña incorrectos. Por favor, verifique sus credenciales e intente nuevamente.',
          });
        }
        
        // Obtener mensaje amigable
        const friendlyMessage = getFriendlyAuthError(error);
        throw new Error(friendlyMessage);
      }
      
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  refreshToken: async (): Promise<string> => {
    const response = await apiClient.post<{ token: string }>('/auth/refresh');
    return response.data.token;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};
