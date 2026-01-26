import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "../features/auth/types/AuthTypes";
import toast from "react-hot-toast";


export const getRoleFromToken = (token: string): string | null => {
  try {
    const decoded = jwtDecode<Record<string, unknown>>(token);
    const roleKeys = [
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role",
      "role"  // por si acaso viene sin namespace
    ];

    for (const key of roleKeys) {
      const role = decoded[key];
      if (role) {
        if (Array.isArray(role)) {
          return role[0] as string;
        }
        return role as string;
      }
    }

    return null;

  } catch (error) {    
    return null;
  }
};

// Esta función devuelve el payload completo del token
export const getTokenPayload = (token: string): JwtPayload | null => {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    toast.error("Token inválido");   
    return null;
  }
};

// Helper para normalizar roles (convierte array en string)
export const getNormalizedRole = (role: string | string[] | undefined): string | null => {
  if (!role) return null;
  return Array.isArray(role) ? role[0] : role;
};

export const getUserIdFromToken = (token: string): string | null => {
  if (!token) return null;
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || null;
  } catch (error) {
    toast.error("Token inválido"); 
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    toast.error("Error al verificar el token");
    return true;
  }
};


