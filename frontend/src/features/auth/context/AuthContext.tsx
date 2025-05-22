import { createContext } from "react";
import { authContextType } from "../types/AuthTypes";

export const AuthContext = createContext<authContextType | undefined>(undefined);
