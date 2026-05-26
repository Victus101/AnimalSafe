/**
 * Custom Authentication Hooks
 */

import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';

/**
 * Hook to check authentication status
 * Returns auth state and user data
 */
export const useAuth = () => {
  const { isAuthenticated, isLoading, user, error } = useAuthStore();
  
  return { 
    isAuthenticated, 
    isLoading, 
    user,
    error,
  };
};

/**
 * Hook to manage login logic
 * Prepared for backend integration
 */
export const useLoginHandler = () => {
  const { setIsLoading, setError, setAuthResponse, error } = useAuthStore();

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Uncomment when backend is ready
      /*
      const apiService = new ApiService();
      const response = await apiService.post('/api/auth/login', {
        email,
        password,
      });

      if (response.data) {
        await setAuthResponse(response.data);
        return { success: true };
      }
      */

      // Demo mode error
      throw new Error('Backend not connected. Demo mode only.');
    } catch (err: any) {
      const message = err.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return { login, error };
};

/**
 * Hook for API loading states
 * Generic hook for any API call
 */
export const useApi = <T,>(
  apiCall: () => Promise<T>,
  immediate = true
) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err: any) {
      const message = err.message || 'An error occurred';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      fetch();
    }
  }, []);

  return { data, error, isLoading, refetch: fetch };
};

