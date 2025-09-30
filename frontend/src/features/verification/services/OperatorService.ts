import API from "../../../api/axios";
import {DeliveryOperatorDto} from "../types/OperatorTypes";

// Traer todos los usuarios registrados como operarios
export const getAllOperators = async (): Promise<DeliveryOperatorDto[]> => {
    const response = await API.get("/api/auth/operators");
    return response.data;
};

// Asignar operador a equipo
export const assignOperatorToTeam = async (teamId: number, operatorUserId: string): Promise<void> => {
    await API.post(`/logistic/VerificationManager/${teamId}/assign-operator`, { operatorUserId });
};

// Remover operador de equipo
export const removeOperatorFromTeam = async (teamId: number, operatorUserId: string): Promise<void> => {
    await API.delete(`/logistic/VerificationManager/${teamId}/remove-operator/${operatorUserId}`);
};