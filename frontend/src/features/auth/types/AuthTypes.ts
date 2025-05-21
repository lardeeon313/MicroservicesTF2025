import { JSX } from "react/jsx-dev-runtime";


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
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

export interface JwtPayload {
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