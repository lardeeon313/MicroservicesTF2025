import { TeamDepotType } from "../types/TeamType";
import API from "../../services/axios";

export const GetTeamNameForOperator = async (operatorId: string): Promise<TeamDepotType> => {
    try {
    const response = await API.get(
      `depot/depotoperator/teams/by-operator/${operatorId}`
    );
    return response.data; // { teamName: "Nombre del equipo" }
  } catch (error: any) {
    console.error("Error al obtener el equipo:", error.response?.data || error.message);
    throw error;
  }
};