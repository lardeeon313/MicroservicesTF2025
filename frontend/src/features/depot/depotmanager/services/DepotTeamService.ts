import API from "../../../../api/axios";
import { DepotTeam, CreateTeamRequest, UpdateTeamRequest } from '../types/DepotTeamTypes';
import { AxiosError } from "axios";

//Obtener Todos los equipos

export const getTeams = async (): Promise<DepotTeam[]> => {
    try {
        console.log('Fetching teams from API...');
        const response = await API.get("/depot/depotmanager/get-all-teams");
        console.log('API Response:', response.data);
        console.log('Teams with operators:', response.data.map((team: any) => ({
            id: team.id,
            teamName: team.teamName,
            operatorsCount: team.operators?.length || 0,
            operators: team.operators
        })));
        
        if (!response.data || !Array.isArray(response.data)) {
            console.error('Invalid response format:', response.data);
            throw new Error('Invalid response format from server');
        }

        const teams = response.data.map((team: any) => ({
            id: team.id,
            teamName: team.teamName,
            teamDescription: team.teamDescription || '',
            operators: (team.operators || []).map((operator: any) => {
                console.log('Mapping operator:', operator);
                
                // Intentar obtener el nombre completo si existe (múltiples variaciones)
                const fullName = operator.fullName || operator.operatorName || operator.OperatorName || operator.FullName || '';
                const nameParts = fullName.split(' ');
                const firstName = nameParts[0] || 'Sin nombre';
                const lastName = nameParts.slice(1).join(' ') || 'Sin apellido';
                
                const mappedOperator = {
                    operatorByUserId: operator.operatorByUserId || operator.OperatorByUserId || operator.id || operator.Id || '',
                    operatorName: operator.operatorName || operator.OperatorName || firstName,
                    operatorLastName: operator.operatorLastName || operator.OperatorLastName || lastName,
                    operatorEmail: operator.operatorEmail || operator.OperatorEmail || operator.email || operator.Email || 'Sin email',
                    roleInTeam: operator.roleInTeam || operator.RoleInTeam || 'Sin rol',
                    assignAt: operator.assignAt || operator.AssignAt ? new Date(operator.assignAt || operator.AssignAt) : new Date()
                };
                
                console.log('Mapped operator:', mappedOperator);
                return mappedOperator;
            })
        }));

        console.log('Transformed teams:', teams);
        return teams;
    } catch (error) {
        console.error('Error in getTeams:', error);
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
            console.error(`Error fetching team ${id}:`, error.response?.data);
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
            console.error(`Error fetching team by name ${name}:`, error.response?.data);
            throw new Error(error.response?.data?.message || "Error al obtener el equipo");
        }
        throw error;
    }
};

//Crear equipo
export const createTeam = async (team: CreateTeamRequest): Promise<DepotTeam> => {
    try {
        console.log('Creating team:', team);
        const response = await API.post('/depot/depotmanager/create-team', team);
        console.log('Create team response:', response.data);

        if (!response.data) {
            throw new Error('No data received from server');
        }

        const newTeam: DepotTeam = {
            id: response.data.id,
            teamName: response.data.teamName,
            teamDescription: response.data.teamDescription || '',
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

        console.log('Transformed new team:', newTeam);
        return newTeam;
    } catch (error) {
        console.error('Error in createTeam:', error);
        throw error;
    }
};

//Actualizar equipo
export const updateTeam = async (id: number, team: UpdateTeamRequest): Promise<DepotTeam> => {
    try {
        console.log('Updating team:', { id, team });
        const response = await API.put(`/depot/depotmanager/update-team/${id}`, {
            teamName: team.teamName,
            teamDescription: team.teamDescription
        });
        console.log('Update team response:', response.data);

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

        console.log('Transformed updated team:', updatedTeam);
        return updatedTeam;
    } catch (error) {
        console.error('Error in updateTeam:', error);
        if (error instanceof AxiosError) {
            const errorMessage = error.response?.data?.message || 'Error al actualizar el equipo';
            console.error('Axios error details:', error.response?.data);
            throw new Error(errorMessage);
        }
        throw error;
    }
};

//Eliminar equipo
export const deleteTeam = async (id: number): Promise<void> => {
    try {
        console.log('Deleting team:', id);
        await API.delete(`/depot/depotmanager/delete-team/${id}`);
        console.log('Team deleted successfully');
    } catch (error) {
        console.error('Error in deleteTeam:', error);
        throw error;
    }
};