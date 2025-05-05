import { AxiosError } from "axios";
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../types/AuthTypes";
import API from "../../../api/axios";

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
        const response = await API.post<LoginResponse>("auth/login",credentials);
        return response.data;
    } catch(error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Login failed");
        }
        throw new Error("An unexpected error occurred");
    }
};

export const register = async (userData: RegisterRequest): Promise<RegisterResponse> => {
    try{
        const response = await API.post<RegisterResponse>("auth/register", userData);
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Register failed");
        }
        throw new Error("An unexpected error occurred");
    }
};





















































/*

import axios from "axios"

/*
export type LoginRequest = {
    email: string;
    password: string;
}

export type RegisterRequest = {
    userName: string;
    name: string;
    lastName: string; 
    email: string;
    password: string;
}

export type AuthResponse = {
    token: string;
    userName: string;
    name: string;
    lastName: string;
    email: string;
    roles: string[];
}
    */
/*
const API = axios.create({
    baseURL: "http://localhost:5000/api/auth",
    headers: {
        "Content-Type": "application/json"
    }
})

const handleError = (error: any) => {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error || "Error desconocido");
    } else {
      throw new Error("Error de red o servidor no disponible");
    }
  };

export const login = async (credentials: {email: string; password: string;}) => {
    try{
        const response = await API.post("/login", credentials);
        return response.data;
    } catch (error) {handleError(error)};
}

export const register = async (userData: {userName: string; name: string; lastName: string; email: string; password: string;}) => {
    try {
        const response = await API.post("/register", userData);
        return response.data;
    } catch (error) {handleError(error)};
}
*/