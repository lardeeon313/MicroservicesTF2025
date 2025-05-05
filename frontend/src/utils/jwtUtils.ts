import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "../features/auth/types/AuthTypes";


export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    console.error("Token inválido:", error);
    return null;
  }
};
