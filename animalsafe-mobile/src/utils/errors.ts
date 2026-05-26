/**
 * Error Utilities
 */


export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
}

export function getErrorMessage(error: any): string {
  if (!error) {
    return 'Ocurrió un error desconocido';
  }

  // Axios error
  if (error.response) {
    return (
      error.response.data?.message ||
      error.response.data?.error ||
      error.message ||
      'Error en el servidor'
    );
  }

  // Network error
  if (error.code === 'ECONNABORTED') {
    return 'Tiempo de conexión agotado. Intenta de nuevo.';
  }

  // Custom message
  if (error.message) {
    return error.message;
  }

  return 'Ocurrió un error desconocido';
}

export function isNetworkError(error: any): boolean {
  return !error.response && error.code !== undefined;
}

export function isAuthError(error: any): boolean {
  return error.response?.status === 401 || error.response?.status === 403;
}

export function is404Error(error: any): boolean {
  return error.response?.status === 404;
}

export function isValidationError(error: any): boolean {
  return error.response?.status === 422 || error.response?.status === 400;
}
