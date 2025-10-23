import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// 💡 Definí directamente la URL correcta acá
const API_BASE_URL =
  Platform.OS === "web"
    ? "http://localhost:5000/"          // si estás probando desde el navegador
    : "http://192.168.100.10:5000/";    // si usás Expo Go en el celular

console.log("✅ API_BASE_URL inicializada:", API_BASE_URL);

// Crear instancia de axios
const API = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Interceptor → agrega token automáticamente
API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  console.log("🔑 Token actual:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor → maneja errores globales
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("token");
      console.log("⚠️ Sesión expirada. Redirigir a Login.");
    }
    return Promise.reject(error);
  }
);

export { API_BASE_URL };
export default API;
