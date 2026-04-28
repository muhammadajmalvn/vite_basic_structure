export interface User {
  id: string;
  email: string;
  full_name: string;
  system_role: string;
  is_active: boolean;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseData {
  access_token: string;
  refresh_token: string;
  expires_at: string;
  user: User;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface RefreshResponseData {
  access_token: string;
  refresh_token: string;
  expires_at: string;
}

export interface RefreshResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
}
