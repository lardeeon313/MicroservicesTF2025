import { AxiosError } from "axios";
import { CreateNewPasswordRequest, CreateNewPasswordResponse, ForgotPasswordRequest, ForgotPasswordResponse, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, ResetPasswordRequest, ResetPasswordResponse, SalesStaffDto } from "../types/AuthTypes";
import API from "../../../api/axios";

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {        
        const response = await API.post<LoginResponse>("api/auth/login",credentials);
        return response.data;
    } catch(error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "No ha sido posible iniciar sesión");
        }
        throw new Error("Ha ocurrido un error inesperado" );
    }
};

export const register = async (userData: RegisterRequest): Promise<RegisterResponse> => {
    try{        
        const response = await API.post<RegisterResponse>("api/auth/register", userData);
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Registro fallido");
        }
        throw new Error("Ha ocurrido un error inesperado");
    }
};

export const fetchSalesStaffs = async (): Promise<SalesStaffDto[]> => {
    try {
        const response = await API.get<SalesStaffDto[]>("/api/auth/salesstaffs");
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "No se pudieron obtener los encargados de ventas.");
        }
            throw new Error("Error inesperado al obtener los encargados de ventas.");
    }
}

export const createNewPassword = async (
    data: CreateNewPasswordRequest
): Promise<CreateNewPasswordResponse> => {
    try {
        const response = await API.post<CreateNewPasswordResponse>(
            "/api/auth/create-new-password",
            data
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "No ha sido posible crear la contraseña");
        }
        throw new Error("Error inesperado");
    }
};

export const forgotPassword = async (
    data: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
    try {
        const response = await API.post<ForgotPasswordResponse>(
            "/api/auth/forgot-password",
            data
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Recuperación de contraseña fallida");
        }
        throw new Error("Error inesperado");
    }
};

export const resetPassword = async (
    data: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
    try {
        const response = await API.post<ResetPasswordResponse>(
            "/api/auth/reset-password",
            data
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Reinicio de contraseña fallido");
        }
        throw new Error("Error inesperado");
    }
};