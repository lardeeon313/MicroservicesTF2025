import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Detecta la URL base según plataforma
const API_BASE_URL =
  Platform.OS === "web"
    ? import.meta.env.VITE_API_BASE_URL
    : process.env.API_BASE_URL || import.meta.env.VITE_API_BASE_URL;  

  /*
  ? "http://localhost:5000/"
    : "http://192.168.100.206:5000/";
  */

{/* Aqui deberiamos de realizar pruebas, utilizando la variable de entorno
    La cual es, la manera en la que deberia de realizarse, ya que estariamos
    en modo produccion, cuando presentemos la tesis.
    Realizar pruebas, al utilizar el API_BASE_URL del "".env"                */}

// Crear instancia de axios 
const API = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Interceptor request para enviar token automáticamente
API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization =  `Bearer ${token}`;
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
      // Ejemplo: navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
    return Promise.reject(error);
  }
);

export default API;
