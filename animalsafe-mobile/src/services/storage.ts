/**
 * Secure Storage Service
 * Platform-aware: uses expo-secure-store on native, localStorage on web
 */

import { Platform } from 'react-native';
import { STORAGE_KEYS } from '../constants/config';
import { User } from '../types/auth';

// Only import SecureStore on native platforms
import * as SecureStore from 'expo-secure-store';
// Helper to check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  } catch {
    return false;
  }
};

class StorageServiceClass {
  private isWeb = Platform.OS === 'web';
  private hasLocalStorage = isLocalStorageAvailable();

  /**
   * Save JWT token
   */
  async setToken(token: string): Promise<void> {
    try {
      if (this.isWeb && this.hasLocalStorage) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      } else if (!this.isWeb) {
        await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, token);
      }
    } catch (error) {
      console.error('Error saving token:', error);
    }
  }

  /**
   * Get JWT token
   */
  async getToken(): Promise<string | null> {
    try {
      if (this.isWeb && this.hasLocalStorage) {
        return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || null;
      } else if (!this.isWeb) {
        const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
        return token || null;
      }
      return null;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  /**
   * Save user data
   */
  async setUser(user: User): Promise<void> {
    try {
      const userStr = JSON.stringify(user);
      if (this.isWeb && this.hasLocalStorage) {
        localStorage.setItem(STORAGE_KEYS.USER_DATA, userStr);
      } else if (!this.isWeb) {
        await SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, userStr);
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }

  /**
   * Get user data
   */
  async getUser(): Promise<User | null> {
    try {
      let userStr: string | null = null;
      if (this.isWeb && this.hasLocalStorage) {
        userStr = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      } else if (!this.isWeb) {
        userStr = await SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA);
      }
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  /**
   * Save refresh token
   */
  async setRefreshToken(token: string): Promise<void> {
    try {
      if (this.isWeb && this.hasLocalStorage) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
      } else if (!this.isWeb) {
        await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, token);
      }
    } catch (error) {
      console.error('Error saving refresh token:', error);
    }
  }

  /**
   * Get refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    try {
      if (this.isWeb && this.hasLocalStorage) {
        return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) || null;
      } else if (!this.isWeb) {
        const token = await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
        return token || null;
      }
      return null;
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated (has valid token)
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  /**
   * Clear all auth data
   */
  async clearAuth(): Promise<void> {
    try {
      if (this.isWeb && this.hasLocalStorage) {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      } else if (!this.isWeb) {
        await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
        await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
        await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
      }
    } catch (error) {
      console.error('Error clearing auth:', error);
    }
  }

  /**
   * Clear all storage
   */
  async clearAll(): Promise<void> {
    try {
      const keys = Object.values(STORAGE_KEYS);
      if (this.isWeb && this.hasLocalStorage) {
        for (const key of keys) {
          localStorage.removeItem(key);
        }
      } else if (!this.isWeb) {
        for (const key of keys) {
          await SecureStore.deleteItemAsync(key);
        }
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}

// Export singleton instance
export const StorageService = new StorageServiceClass();
