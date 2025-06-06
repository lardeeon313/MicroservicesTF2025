
import axios from "axios";
import { DepotTeamUpdateDTO, AssignOperatorDTO } from "../types/DepotTeamTypes";

const API_BASE = "/api/depotmanager/teams";

export const teamService = {
  getAllTeams: async (): Promise<DepotTeamUpdateDTO[]> => {
    const { data } = await axios.get(API_BASE);
    return data;
  },

  updateTeam: async (team: DepotTeamUpdateDTO): Promise<void> => {
    await axios.put(`${API_BASE}/${team.id}`, team);
  },

  createTeam: async (teamName: string): Promise<DepotTeamUpdateDTO> => {
    const { data } = await axios.post(API_BASE, { teamName });
    return data;
  },

  assignOperator: async (teamId: number, operatorId: string): Promise<void> => {
    await axios.post(`${API_BASE}/${teamId}/assignOperator`, { operatorUserId: operatorId });
  },

  removeOperator: async (teamId: number, operatorUserId: string): Promise<void> => {
    await axios.post(`${API_BASE}/${teamId}/removeOperator`, { operatorUserId });
  },
};