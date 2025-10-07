import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getNameFromToken, getRoleFromToken, getUserIdFromToken } from "../Utils/jwlUtils";
import { TeamDepotType } from "../../types/TeamType";
import { AuthContext } from "./AuthContext";
import API from "../../../services/axios";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [team, setTeam] = useState<TeamDepotType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Función para obtener el equipo desde el backend
  const fetchTeam = async (id: string, token: string): Promise<TeamDepotType | null> => {
    try {
      const res = await API.get(`depot/depotoperator/teams/by-operator/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.teamName ?? null;
    } catch (err) {
      if ((err as any).response?.status === 404) {
        console.warn("⚠️ El usuario no tiene equipo asignado (404)");
      } else {
        console.warn("⚠️ No se pudo obtener el equipo:", (err as Error).message);
      }
      return null;
    }
  };

  // Carga inicial desde AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
          const id = getUserIdFromToken(storedToken);
          const name = getNameFromToken(storedToken);
          const role = getRoleFromToken(storedToken);

          setUserId(id);
          setName(name);
          setRole(role);

          // Cargar equipo desde AsyncStorage o API
          const storedUserStr = await AsyncStorage.getItem("user");
          const storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;

          if (storedUser?.team) {
            setTeam(storedUser.team);
          } else if (id) {
            const teamName = await fetchTeam(id, storedToken);
            setTeam(teamName);
          }
        }
      } catch (error) {
        console.error("Error loading stored token:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // Login
  const login = async (newToken: string) => {
    try {
      setToken(newToken);
      const id = getUserIdFromToken(newToken);
      const name = getNameFromToken(newToken);
      const role = getRoleFromToken(newToken);

      if (!id) {
        throw new Error("No se pudo obtener el ID del usuario.");
      }

      setUserId(id);
      setName(name);
      setRole(role);

      // Obtener equipo desde la API
      const teamName = await fetchTeam(id, newToken);
      setTeam(teamName);

      // Guardar en AsyncStorage
      const userData = {
        id,
        name,
        role,
        team: teamName,
        token: newToken,
      };
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      await AsyncStorage.setItem("token", newToken);
    } catch (error) {
      console.error("Error durante el login:", error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      setToken(null);
      setUserId(null);
      setName(null);
      setRole(null);
      setTeam(null);
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");
    } catch (error) {
      console.error("Error durante el logout:", error);
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
        team,
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
