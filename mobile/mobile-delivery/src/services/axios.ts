import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

let API_BASE_URL: string | undefined;

// 1. Intentar desde app.json (producción web / docker)
API_BASE_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_BASE_URL;

// 2. Fallback a @env (desarrollo mobile)
if (!API_BASE_URL) {
  try {
    // Import dinámico para no romper en web
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const env = require("@env");
    API_BASE_URL = env.EXPO_PUBLIC_API_BASE_URL;
  } catch (e) {
    console.warn("⚠️ No se pudo leer EXPO_PUBLIC_API_BASE_URL desde @env");
  }
}

if (!API_BASE_URL) {
  console.error("❌ EXPO_PUBLIC_API_BASE_URL NO DEFINIDA (ni en app.json ni en .env)");
} else {
  console.log("🔗 API BASE URL:", API_BASE_URL);
}

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
      console.log("Sesión expirada. Redirigir a Login usando React Navigation");
    }
    return Promise.reject(error);
  }
);

export default API;
