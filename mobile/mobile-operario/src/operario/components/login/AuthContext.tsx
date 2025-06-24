// src/context/AuthContext.tsx
import React, { createContext, useContext,useEffect, useState } from 'react';
import { GetOperatorById } from '../../services/AuthService';

interface User {
  id: string;
  depotTeamId: number;
  roleInTeam: string;
  assignedAt: string
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean,
  login: (id: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user,setUser] = useState<User | null>(null);
    const [loading,setLoading] = useState<boolean>(true);


  // Simulación de carga inicial del usuario
  useEffect(() => {
    const initialize = async () => {
      // Podés recuperar usuario guardado desde AsyncStorage acá si querés
      setLoading(false); // Simula que terminó de cargar
    };

    initialize();
  }, [user]);

  const login = async (id: string) => {
    setLoading(true);
    try {
      const userData = await GetOperatorById(id);
      setUser(userData);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
    return context;
}