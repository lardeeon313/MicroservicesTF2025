import { useContext } from "react";
import { authContextType } from "../types/AuthTypes";
import { AuthContext } from "./AuthContext";

export const useAuth = (): authContextType => {
    const context = useContext(AuthContext); 
    if(!context) {
        throw new Error("UseAuth must be used within an AuthProvider.");
    }

    return context;
};

