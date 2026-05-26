/**
 * API Endpoints
 */

export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
  },

  // Users
  USERS: {
    GET_PROFILE: '/api/users/{id}',
    UPDATE_PROFILE: '/api/users/{id}',
    DELETE_ACCOUNT: '/api/users/{id}',
    GET_ALL: '/api/users',
  },

  // Reports
  REPORTS: {
    GET_ALL: '/api/reports',
    GET_BY_ID: '/api/reports/{id}',
    CREATE: '/api/reports',
    UPDATE_STATUS: '/api/reports/{id}/status',
    GET_BY_USER: '/api/reports/user/{userId}',
    GET_BY_STATUS: '/api/reports/status/{status}',
    GET_NEARBY: '/api/reports/nearby',
  },

  // Images
  IMAGES: {
    GET_BY_REPORT: '/api/images/report/{reportId}',
    GET_BY_ID: '/api/images/{imageId}',
    UPLOAD: '/api/images',
    DELETE: '/api/images/{imageId}',
  },
};
