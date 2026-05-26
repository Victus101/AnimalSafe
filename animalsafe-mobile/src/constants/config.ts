/**
 * Application Configuration
 */

import { API_URL } from '../config/api';

// API Configuration
export const API_CONFIG = {
  // Development
  LOCAL_HOST: API_URL,
  LOCAL_HOST_ANDROID: API_URL,
  // Production
  PROD_HOST: 'https://api.animalsafe.com', // To be updated when deployed

  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

// App Configuration
export const APP_CONFIG = {
  NAME: 'AnimalSafe',
  VERSION: '1.0.0',
  DEBUG: process.env.NODE_ENV === 'development',
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'animalsafe_auth_token',
  USER_DATA: 'animalsafe_user_data',
  REFRESH_TOKEN: 'animalsafe_refresh_token',
  PREFERENCES: 'animalsafe_preferences',
};

// Feature Flags
export const FEATURES = {
  ENABLE_MAP: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_CHAT: false,
  ENABLE_GAMIFICATION: false,
};
