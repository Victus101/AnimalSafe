/**
 * Auth Types
 */

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends AuthCredentials {
  name: string;
  passwordConfirm: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  userId: number;
  email: string;
  role: 'USER' | 'VOLUNTEER' | 'ADMIN';
  message?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'VOLUNTEER' | 'ADMIN';
  userType?: 'VOLUNTARIO' | 'RESCATISTA' | 'ACOGIDA';
  reportCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
