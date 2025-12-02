import { JSX } from "react/jsx-dev-runtime";

export enum EmployedStatus {
    Active = 0,
    Inactive = 1,
    OnLicense = 2,
    Dismissed = 3,
    ResignationProcess = 4,
}
export interface LoginRequest {
    email: string;
    password: string;
}
  
export interface LoginResponse {
    userName: string;
    email: string;
    roles: string[];
    token: string;
    employed_Status: EmployedStatus;
}
  
export interface RegisterRequest {
    userName: string;
    name: string;
    lastName: string;
    email: string;
    phoneNumber: string;
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
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
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

export interface SalesStaffDto {
  id: string;
  firstName: string;
  lastName: string;
}