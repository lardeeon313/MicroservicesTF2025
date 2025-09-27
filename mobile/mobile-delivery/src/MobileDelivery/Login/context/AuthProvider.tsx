import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "./AuthContext";
import {
  getUserIdFromToken,
  getRoleFromToken,
  getNameFromToken,
} from "../Utils/jwlUtils";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 🔑 Este state fuerza siempre a pedir login al iniciar
  useEffect(() => {
    const resetAuth = async () => {
      try {
        await AsyncStorage.removeItem("token"); // 🔥 Borro cualquier token previo
        setToken(null);
        setUserId(null);
        setRole(null);
        setName(null);
      } catch (error) {
        console.error("Error clearing token:", error);
      } finally {
        setLoading(false);
      }
    };

    resetAuth();
  }, []);

  const login = async (newToken: string) => {
    try {
      await AsyncStorage.setItem("token", newToken);
      setToken(newToken);
      setUserId(getUserIdFromToken(newToken));
      setRole(getRoleFromToken(newToken));
      setName(getNameFromToken(newToken));
    } catch (error) {
      console.error("Error saving token:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      setToken(null);
      setUserId(null);
      setRole(null);
      setName(null);
    } catch (error) {
      console.error("Error removing token:", error);
      throw error;
    }
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        name,
        role,
        team: null,
        isAuthenticated,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
