import { JSX } from "react/jsx-dev-runtime";
import { TeamDepotType } from "../../types/TeamType";

export interface LoginRequest {
    email: string;
    password: string;
}
  
export interface LoginResponse {
    userName: string;
    email: string;
    roles: string[];
    token: string;
}
  
export interface RegisterRequest {
    userName: string;
    name: string;
    lastName: string;
    email: string;
    password: string;
    role: string; // Temporal!
}

export interface RegisterResponse {
    message: string;
}

export interface authContextType {
    userId:string | null;
    name: string | null;
    role: string | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
    loading: boolean;
    team?: TeamDepotType | null;
}

export interface JwtPayload {
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
    name: string;
    email: string;
    role: string | string[];
    exp: number;
    key: string
}

export interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole?: string;
}

//NUEVO: 

export interface CreateNewPasswordRequest {
  userIdentityId: string;
  newPassword: string;
}

export interface CreateNewPasswordResponse {
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  requiresPasswordCreation: boolean;
  userId?: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

