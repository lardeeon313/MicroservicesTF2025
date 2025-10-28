import API from "../../services/axios";
import { TeamDeliveryType } from "../types/TeamDeliveryType";

export const getTeamByDeliveryOperator = async (operatorUserId: string): Promise<TeamDeliveryType> => {
  try {
    const response = await API.get(`/logistic/DeliveryOperator/teams/by-delivery/${operatorUserId}`);
    console.log("DeliveryOperator con el equipo: " , response)
    // El backend devuelve: { teamName: "..." }
    return response.data?.teamName ?? null;
  } catch (error: any) {
    console.error("❌ Error al obtener el equipo del operador:", error);
    throw error;
  }
};