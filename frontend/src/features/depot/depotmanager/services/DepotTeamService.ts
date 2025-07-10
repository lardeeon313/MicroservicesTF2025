import API from "../../../../api/axios";
import { DepotTeam, CreateTeamRequest, UpdateTeamRequest } from '../types/DepotTeamTypes';

// Obtener todos los equipos
export const getTeams = async (): Promise<DepotTeam[]> => {
    const response = await API.get("/api/depotmanager/get-all-teams");
    return response.data;
};

// Obtener equipo por su ID
export const getTeamById = async (id: number): Promise<DepotTeam> => {
    const response = await API.get(`/api/depotmanager/get-team-by-id/${id}`);
    return response.data;
};

// Obtener equipo por su nombre
export const getTeamByName = async (name: string): Promise<DepotTeam> => {
    const response = await API.get(`/api/depotmanager/get-team-by-name?name=${name}`);
    return response.data;
};

// Crear equipo
export const createTeam = async (data: CreateTeamRequest): Promise<void> => {
    await API.post("/api/depotmanager/create-team", data);
};

// Actualizar equipo
export const updateTeam = async (data: UpdateTeamRequest): Promise<void> => {
    await API.put(`/api/depotmanager/update-team/${data.teamId}`, data);
};

// Eliminar equipo
export const deleteTeam = async (id: number): Promise<void> => {
    await API.delete(`/api/depotmanager/delete-team/${id}`);
};


