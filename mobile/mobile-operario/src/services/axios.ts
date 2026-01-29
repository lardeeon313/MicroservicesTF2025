import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform } from "react-native";

// 🔧 Detectar URL base según plataforma
const API_BASE_URL = (() => {
  const base = Constants.expoConfig?.extra?.VITE_API_BASE_URL;
  
  if (!base) {
    throw new Error(
      "VITE_API_BASE_URL no está definido. Revisar app.json -> extra"
    );
  }

  if (Platform.OS === "web") {
    // Desde navegador web apuntamos al puerto mapeado
    // Reemplaza 5000 con el puerto que mapeaste en docker-compose
    return "http://localhost:5000";
  }

  // Desde mobile / Expo Go / contenedor Docker
  return base;
})();

console.log("API BASE URL:", API_BASE_URL);

// Crear instancia de axios
const API = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Interceptor request para enviar token automáticamente
API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor response para manejar 401
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("token");
      console.log(
        "Sesión expirada. Redirigir a Login usando React Navigation"
      );
      // navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    }
    return Promise.reject(error);
  }
);

export default API;
