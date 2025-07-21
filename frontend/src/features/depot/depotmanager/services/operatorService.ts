import API from "../../../../api/axios";
import { OperatorDto } from "../types/OperatorTypes";

// Traer todos los usuarios registrados como operarios
export const getAllOperators = async (): Promise<OperatorDto[]> => {
    const response = await API.get("/api/auth/operators");
    return response.data;
};

// Asignar operador a equipo
export const assignOperatorToTeam = async (teamId: number, operatorUserId: string): Promise<void> => {
    await API.post(`/api/depotmanager/${teamId}/assign-operator`, { operatorUserId });
};

// Remover operador de equipo
export const removeOperatorFromTeam = async (teamId: number, operatorUserId: string): Promise<void> => {
    await API.delete(`/api/depotmanager/${teamId}/remove-operator/${operatorUserId}`);
};




