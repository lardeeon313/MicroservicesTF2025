import { AxiosError } from "axios";
import {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse ,
    CreateNewPasswordRequest,
    CreateNewPasswordResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
    ResetPasswordResponse
} 
from "../types/AuthType";

import API from "../../../services/axios";

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

//NUEVOS SERVICES: 

export const createNewPassword = async (
  data: CreateNewPasswordRequest
): Promise<CreateNewPasswordResponse> => {
  try {
    const response = await API.post("api/auth/create-new-password", data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message);
    }
    throw new Error("Unexpected error");
  }
};

export const forgotPassword = async (
  data: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
  try {
    const response = await API.post("api/auth/forgot-password", data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message);
    }
    throw new Error("Unexpected error");
  }
};

export const resetPassword = async (
  data: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  try {
    const response = await API.post("api/auth/reset-password", data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message);
    }
    throw new Error("Unexpected error");
  }
};