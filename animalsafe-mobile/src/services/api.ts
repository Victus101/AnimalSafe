/**
 * API Service with Axios
 * Base HTTP client configured for AnimalSafe backend
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../constants/config';
import { ApiResponse } from '../types/common';
import { StorageService } from './storage';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    // Use LOCAL_HOST for development (works across all platforms)
    const baseURL = API_CONFIG.LOCAL_HOST;

    this.client = axios.create({
      baseURL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await StorageService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        // Handle 401 - token expired
        if (error.response?.status === 401) {
          await StorageService.clearAuth();
          // TODO: Redirect to login when auth store is set up
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * GET request
   */
  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<T>(url, config);
      return {
        data: response.data,
        message: 'Success',
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * POST request
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return {
        data: response.data,
        message: 'Success',
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.patch<T>(url, data, config);
      return {
        data: response.data,
        message: 'Success',
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * DELETE request
   */
  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<T>(url, config);
      return {
        data: response.data,
        message: 'Success',
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Error handler
   */
  private handleError(error: any): ApiResponse {
    const axiosError = error as AxiosError;
    const errorResponse = axiosError.response?.data as any;

    return {
      error: errorResponse?.message || axiosError.message || 'Unknown error',
      status: axiosError.response?.status,
    };
  }

  /**
   * Set base URL (useful for backend URL switching)
   */
  setBaseURL(url: string) {
    this.client.defaults.baseURL = url;
  }

  /**
   * Get raw axios instance (for advanced usage)
   */
  getClient(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const apiService = new ApiService();
