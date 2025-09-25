import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// ⚡ Ajustá la IP por la de tu PC en la red WiFi
const API_BASE_URL =
  Platform.OS === "web"
    ? "http://localhost:5000/"          // Para pruebas en navegador
    : "http://192.168.100.10:5000/";    // Para Expo Go en celular (reemplazar IP)

// Crear instancia de axios
const API = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Interceptor request → agrega token automáticamente
API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor response → maneja errores globales
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("token");
      console.log("⚠️ Sesión expirada. Redirigir a Login con React Navigation");
      // Acá podés disparar logout() del AuthContext si lo necesitas
    }
    return Promise.reject(error);
  }
);

export { API_BASE_URL };
export default API;
