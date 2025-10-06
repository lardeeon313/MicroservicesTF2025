import API from "../../../api/axios";
import { OperatorDto, AssignOperatorToTeamRequest } from "../types/OperatorTypes";

// ========== OPERATOR OPERATIONS ==========

// Obtener todos los delivery operators
export const getAllDeliveryOperators = async (): Promise<OperatorDto[]> => {
  const response = await API.get("/api/auth/deliveryoperators");
  return response.data;
};

// Alias para compatibilidad con el hook existente
export const getAllOperators = getAllDeliveryOperators;


// Asignar operador a equipo
export const assignOperatorToTeam = async (teamId: number, data: AssignOperatorToTeamRequest): Promise<void> => {
  const requestData = {
    TeamId: data.teamId,
    OperatorUserId: data.operatorUserId,
    RoleInTeam: data.roleInTeam || "Delivery Operator"
  };
  await API.post(`/logistic/VerificationManager/${teamId}/assign-operator`, requestData);
};

// Remover operador de equipo
export const removeOperatorFromTeam = async (teamId: number, operatorUserId: string): Promise<void> => {
  await API.delete(`/logistic/VerificationManager/${teamId}/remove-operator/${operatorUserId}`);
};