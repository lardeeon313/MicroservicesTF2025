import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {"Content-Type": "application/json"},
});

// Interceptor para agregar el token
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API; 

