export type UserRole = 'user' | 'admin';

export interface User {
  id?: string;
  nickname: string;
  role: UserRole;
  email?: string;
  tier?: string;
  avatarUrl?: string;
  lastLogin?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  role: UserRole;
  isLoading: boolean;
}

export interface LoginCredentials {
  nickname: string;
  password?: string;
  role?: UserRole;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  message?: string;
}

export interface ApiErrorResponse {
  detail?: string;
  message?: string;
  statusCode?: number;
}
