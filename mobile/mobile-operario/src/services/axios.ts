import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { NetworkInfo } from "react-native-network-info";

let API_BASE_URL =
  Platform.OS === "web" ? "http://localhost:5000" : "http://10.0.2.2:5000"; // default

// Obtener IP local de la PC en background
if (Platform.OS !== "web") {
  NetworkInfo.getGatewayIPAddress().then((ip) => {
    if (ip) {
      API.defaults.baseURL = `http://${ip}:5000`;
      console.log("Base URL ajustada a:", API.defaults.baseURL);
    }
  });
}

// Crear instancia de axios
const API = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Interceptor request
API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor response
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("token");
      console.log("Sesión expirada, redirigir a login");
    }
    return Promise.reject(error);
  }
);

export default API;

