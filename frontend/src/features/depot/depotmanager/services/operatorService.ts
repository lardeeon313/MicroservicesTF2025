import API from "../../../../api/axios";
import { OperatorDto } from "../types/OperatorTypes";
import { AxiosError } from "axios";

//Traer todos los usuarios registrados como operarios
export const getAllOperators = async (): Promise<OperatorDto[]> => {
    try {
        console.log('Fetching operators from:', '/api/auth/operators');
        console.log('Request headers:', API.defaults.headers);
        console.log('Auth token:', localStorage.getItem('token'));
        const response = await API.get("/api/auth/operators");
        console.log('Operators response status:', response.status);
        console.log('Operators response headers:', response.headers);
        console.log('Operators response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching operators:', error);
        if (error instanceof AxiosError && error.response) {
            console.error('Error response:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
        }
        throw error;
    }
};

//Asignar operador a equipo
export const assignOperatorToTeam = async (teamId: number, operatorUserId: string): Promise<void> => {
    await API.post(`/depot/depotmanager/${teamId}/assign-operator`, { operatorUserId });
};

//Remover operador de equipo
export const removeOperatorFromTeam = async (teamId: number, operatorUserId: string): Promise<void> => {
    await API.delete(`/depot/depotmanager/${teamId}/remove-operator/${operatorUserId}`);
};

