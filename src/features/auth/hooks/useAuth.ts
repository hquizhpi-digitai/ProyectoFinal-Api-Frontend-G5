import { useAuthStore } from '../../../store/authStore';
import { authService } from '../services/authService';
import { LoginCredentials } from '../types/auth.types';
import { handleApiError } from '../../../config/api/axiosConfig';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, setAuth, logout: logoutStore, setLoading } = useAuthStore();

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      setAuth(response.user, response.token);
      return { success: true, error: null };
    } catch (error) {
      const errorMessage = handleApiError(error);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logoutStore();
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
};
