import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "./AuthContext";
import {
  getUserIdFromToken,
  getRoleFromToken,
  getNameFromToken,
} from "../Utils/jwlUtils";
import { TeamDepotType } from "../../types/TeamType";
import { GetTeamNameForOperator } from "../../services/GetTeamNameService"; // 👈 tu service

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [team, setTeam] = useState<TeamDepotType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [updateKey, setUpdateKey] = useState(0);

  // 🔹 Carga inicial de usuario + equipo
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);

          const id = getUserIdFromToken(storedToken);
          const role = getRoleFromToken(storedToken);
          const name = getNameFromToken(storedToken);

          setUserId(id);
          setRole(role);
          setName(name);

          // 👉 traer equipo si hay id
          if (id) {
            try {
              const teamData = await GetTeamNameForOperator(id);
              setTeam(teamData);
            } catch (err) {
              console.error("Error al obtener equipo:", err);
              setTeam(null);
            }
          }
        }
      } catch (error) {
        console.error("Error loading token:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [updateKey]);

  // 🔹 Login
  const login = async (newToken: string) => {
    try {
      await AsyncStorage.setItem("token", newToken);
      setToken(newToken);
      setUserId(getUserIdFromToken(newToken));
      setRole(getRoleFromToken(newToken));
      setName(getNameFromToken(newToken));
      setUpdateKey((prevKey) => prevKey + 1); // 👈 refetch team
    } catch (error) {
      console.error("Error saving token:", error);
      throw error;
    }
  };

  // 🔹 Logout
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      setToken(null);
      setUserId(null);
      setRole(null);
      setName(null);
      setTeam(null); // 👈 limpiar también el equipo
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
        team, // 👈 agregado al contexto
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