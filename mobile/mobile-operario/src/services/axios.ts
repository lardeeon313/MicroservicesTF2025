import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// URL base inicial (solo para web)
let API_BASE_URL = Platform.OS === "web" ? "http://localhost:5000/" : "http://192.168.100.10:5000/"; // Valor por defecto: IP de tu PC

// Función para obtener la IP local del servidor
async function updateApiBaseUrl() {
  try {
    const TEMP_IP = "http://192.168.100.10:5000/"; // Reemplazá con la IP de tu PC
    const response = await axios.get(`${TEMP_IP}local-ip`, { timeout: 3000 });
    API_BASE_URL = `http://${response.data.ip}:5000/`;
    console.log("IP del servidor detectada automáticamente:", API_BASE_URL);
  } catch (error) {
    console.error("No se pudo obtener la IP automáticamente. Usando fallback:", error);
    // Si falla, API_BASE_URL ya tiene el valor por defecto
  }
}

// Actualizar la IP solo en móvil
if (Platform.OS !== "web") {
  updateApiBaseUrl();
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

