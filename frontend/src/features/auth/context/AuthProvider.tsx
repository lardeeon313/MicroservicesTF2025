import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storeToken = localStorage.getItem("token");
        if (storeToken) {
            setToken(storeToken);
        }
    },[]);

    const login = (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{token, isAuthenticated, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

