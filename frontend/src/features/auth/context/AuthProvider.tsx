import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { isTokenExpired } from "../../../utils/jwtUtils";

export const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                if (!isTokenExpired(storedToken)) {
                    setToken(storedToken);
                } else {
                    localStorage.removeItem("token");
                    setToken(null);
                }
            } else {
                setToken(null);
            }
            setIsLoading(false);
        };

        checkAuth();
        // Verificar el token cada minuto
        const interval = setInterval(checkAuth, 60000);
        return () => clearInterval(interval);
    }, []);

    const login = (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    const isAuthenticated = !!token && !isTokenExpired(token);

    if (isLoading) {
        return null; // o un componente de loading
    }

    return (
        <AuthContext.Provider value={{token, isAuthenticated, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

