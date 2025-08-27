import { AxiosError } from "axios";
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../types/AuthType";
//import { api } from "../../services/api";
//import { identityApi } from "../../services/axios";
import API from "../../services/axios";

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
        const response = await API.post<LoginResponse>('api/auth/login', credentials);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log("Register error status:", error.response?.status);
            throw new Error(error.response?.data?.message || "Register failed");
        }
        console.log("Unexpected login error:", error);
        throw new Error("An unexpected error occurred");
    }
};

export const register = async (userData: RegisterRequest): Promise<RegisterResponse> => {
    try {
        console.log("Enviando datos al backend (register):", userData);
        const response = await API.post<RegisterResponse>('api/auth/register', userData);
        console.log("Respuesta del backend (register):", response.data);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log("Register error response:", error.response?.data);
            console.log("Register error headers:", error.response?.headers);
            console.log("Register error data:", error.response?.data);
            console.log("Register error full:", JSON.stringify(error.toJSON(), null, 2));
            throw new Error(error.response?.data?.message || "Register failed");
        }
        console.log("Unexpected register error:", error);
        throw new Error("An unexpected error occurred");
    }
};
