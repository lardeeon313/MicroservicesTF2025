import API from "../../../../api/axios";
import { DepotTeam, CreateTeamRequest, UpdateTeamRequest } from '../types/DepotTeamTypes';
import { AxiosError } from "axios";

//Obtener Todos los equipos

export const getTeams = async (): Promise<DepotTeam[]> => {
    try {
        const response = await API.get("/depot/depotmanager/get-all-teams");
        
        if (!response.data || !Array.isArray(response.data)) {
            throw new Error('Invalid response format from server');
        }

        const teams = response.data.map((team: any) => ({
            id: team.id,
            teamName: team.teamName,
            teamDescription: team.teamDescription || '',
            operators: (team.operators || []).map((operator: any) => {
                                
                const mappedOperator = {
                    operatorByUserId: operator.operatorByUserId || operator.OperatorByUserId || operator.id || operator.Id || '',
                    operatorName: operator.firstName || 'Sin nombre',
                    operatorLastName: operator.lastName || 'Sin apellido',
                    operatorEmail: operator.email || operator.Email || 'Sin email',
                    roleInTeam: operator.roleInTeam || operator.RoleInTeam || 'Sin rol',
                    assignAt: operator.assignAt || operator.AssignAt ? new Date(operator.assignAt || operator.AssignAt) : new Date()
                };
                
                return mappedOperator;
            })
        }));
        return teams;
    } catch (error) {
        throw error;
    }
};

//Obtener equipo por su ID
export const getTeamById = async (id: number): Promise<DepotTeam> => {
    try {
        const response = await API.get(`/depot/depotmanager/get-team-by-id/${id}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Error al obtener el equipo");
        }
        throw error;
    }
};

//Obtener equipo por su nombre
export const getTeamByName = async (name: string): Promise<DepotTeam> => {
    try {
        const response = await API.get(`/depot/depotmanager/get-team-by-name?name=${name}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Error al obtener el equipo");
        }
        throw error;
    }
};

//Crear equipo
export const createTeam = async (team: CreateTeamRequest): Promise<DepotTeam> => {
    try {
        const response = await API.post('/depot/depotmanager/create-team', team);

        if (!response.data) {
            throw new Error('No data received from server');
        }

        const newTeam: DepotTeam = {
            id: response.data.id,
            teamName: response.data.teamName,
            teamDescription: response.data.teamDescription || '',
            operators: (response.data.operators || []).map((operator: any) => {
                const fullName = operator.fullName || operator.operatorName || '';
                const nameParts = fullName.split(' ');
                const firstName = nameParts[0] || 'Sin nombre';
                const lastName = nameParts.slice(1).join(' ') || 'Sin apellido';
                
                return {
                    operatorByUserId: operator.operatorByUserId || operator.id || '',
                    operatorName: operator.operatorName || firstName,
                    operatorLastName: operator.operatorLastName || lastName,
                    operatorEmail: operator.operatorEmail || operator.email || 'Sin email',
                    roleInTeam: operator.roleInTeam || 'Sin rol',
                    assignAt: operator.assignAt ? new Date(operator.assignAt) : new Date()
                };
            })
        };

        return newTeam;
    } catch (error) {
        throw error;
    }
};

//Actualizar equipo
export const updateTeam = async (id: number, team: UpdateTeamRequest): Promise<DepotTeam> => {
    try {
        const response = await API.put(`/depot/depotmanager/update-team/${id}`, {
            teamName: team.teamName,
            teamDescription: team.teamDescription
        });

        // Si la respuesta es un mensaje de éxito o no hay datos, devolver el equipo actualizado
        if (!response.data || typeof response.data === 'string') {
            return {
                id,
                teamName: team.teamName,
                teamDescription: team.teamDescription,
                operators: []
            };
        }

        // Si la respuesta es un objeto, usarlo para construir el equipo actualizado
        const updatedTeam: DepotTeam = {
            id,
            teamName: response.data.teamName || team.teamName,
            teamDescription: response.data.teamDescription || team.teamDescription || '',
            operators: (response.data.operators || []).map((operator: any) => {
                // Intentar obtener el nombre completo si existe
                const fullName = operator.fullName || operator.operatorName || '';
                const nameParts = fullName.split(' ');
                const firstName = nameParts[0] || 'Sin nombre';
                const lastName = nameParts.slice(1).join(' ') || 'Sin apellido';
                
                return {
                    operatorByUserId: operator.operatorByUserId || operator.id || '',
                    operatorName: operator.operatorName || firstName,
                    operatorLastName: operator.operatorLastName || lastName,
                    operatorEmail: operator.operatorEmail || operator.email || 'Sin email',
                    roleInTeam: operator.roleInTeam || 'Sin rol',
                    assignAt: operator.assignAt ? new Date(operator.assignAt) : new Date()
                };
            })
        };

        return updatedTeam;
    } catch (error) {
        if (error instanceof AxiosError) {
            const errorMessage = error.response?.data?.message || 'Error al actualizar el equipo';
            throw new Error(errorMessage);
        }
        throw error;
    }
};

//Eliminar equipo
export const deleteTeam = async (id: number): Promise<void> => {
    try {
        await API.delete(`/depot/depotmanager/delete-team/${id}`);
    } catch (error) {
        throw error;
    }
};