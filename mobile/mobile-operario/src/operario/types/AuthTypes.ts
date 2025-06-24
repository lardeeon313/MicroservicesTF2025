// src/types/AuthTypes.ts

export interface RegisterRequest {
  userName: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string; // Podrías cambiar a un enum si querés más control
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}
