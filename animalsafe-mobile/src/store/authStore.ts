/**
 * Auth Store - Zustand State Management
 * Centralized authentication state
 */

import { create } from 'zustand';
import { StorageService } from '../services/storage';
import { AuthResponse, AuthState, User } from '../types/auth';

interface AuthStore extends AuthState {
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  setAuthResponse: (response: AuthResponse) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: true }),
  
  setToken: (token) => set({ token }),
  
  setIsLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),

  logout: async () => {
    await StorageService.clearAuth();
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false,
      error: null 
    });
  },

  hydrate: async () => {
    try {
      const token = await StorageService.getToken();
      const user = await StorageService.getUser();
      set({ 
        token, 
        user, 
        isAuthenticated: !!token, 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error hydrating auth store:', error);
      set({ isLoading: false });
    }
  },

  setAuthResponse: async (response: AuthResponse) => {
    const user: User = {
      id: response.userId,
      email: response.email,
      name: '', // Backend should provide this
      role: response.role,
    };
    
    // Save to storage
    await StorageService.setToken(response.token);
    await StorageService.setUser(user);
    
    // Update store
    set({ 
      token: response.token,
      user,
      isAuthenticated: true,
      error: null,
    });
  },
}));
