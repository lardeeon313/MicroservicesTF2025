import { useState, useCallback, useEffect } from 'react';
import { DepotTeam, CreateTeamRequest, UpdateTeamRequest } from '../types/DepotTeamTypes';
import { getTeams, createTeam, updateTeam, deleteTeam } from '../services/DepotTeamService';
import { handleFormikError } from '../../../../components/ErrorHandler';
import { AxiosError } from 'axios';

export function useTeams() {
    const [teams, setTeams] = useState<DepotTeam[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTeams = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('useTeams: Fetching teams from API...');
            const data = await getTeams();
            console.log('useTeams: Received teams data:', data);
            setTeams(data);
        } catch (error) {
            console.error("useTeams: Error in fetchTeams:", error);
            setError("Error al cargar los equipos");
            // En caso de error, establecer un array vacío
            setTeams([]);
            
            if (error instanceof AxiosError) {
                handleFormikError({
                    error,
                    customMessages: {
                        400: "Datos inválidos, por favor verificá los campos.",
                        401: "No tienes autorización para ver los equipos.",
                        404: "Equipos no encontrados.",
                        500: "Error interno del servidor.",
                    },
                });
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const createNewTeam = async (team: CreateTeamRequest): Promise<void> => {
        try {
            setError(null);
            await createTeam(team);
            await fetchTeams(); // Refresca la lista tras crear
        } catch (error) {
            console.error("Error in createNewTeam:", error);
            if (error instanceof AxiosError) {
                handleFormikError({
                    error,
                    customMessages: {
                        400: "Datos inválidos, por favor verificá los campos.",
                        401: "No tienes autorización para crear equipos.",
                        500: "Error interno del servidor.",
                    },
                });
            }
            throw error;
        }
    };

    const updateExistingTeam = async (team: UpdateTeamRequest): Promise<void> => {
        try {
            setError(null);
            await updateTeam(team);
            await fetchTeams(); // Refresca la lista tras actualizar
        } catch (error) {
            console.error("Error in updateExistingTeam:", error);
            if (error instanceof AxiosError) {
                handleFormikError({
                    error,
                    customMessages: {
                        400: "Datos inválidos, por favor verificá los campos.",
                        401: "No tienes autorización para actualizar equipos.",
                        404: "Equipo no encontrado.",
                        500: "Error interno del servidor.",
                    },
                });
            }
            throw error;
        }
    };

    const removeTeam = async (id: number): Promise<void> => {
        try {
            setError(null);
            await deleteTeam(id);
            setTeams(prevTeams => prevTeams.filter(team => team.id !== id));
        } catch (error) {
            console.error("Error in removeTeam:", error);
            if (error instanceof AxiosError) {
                handleFormikError({
                    error,
                    customMessages: {
                        401: "No tienes autorización para eliminar equipos.",
                        404: "Equipo no encontrado.",
                        500: "Error interno del servidor.",
                    },
                });
            }
            throw error;
        }
    };
    
    useEffect(() => {
        fetchTeams();
    }, [fetchTeams]);

    return {
        teams,
        loading,
        error,
        createNewTeam,
        updateExistingTeam,
        removeTeam,
        refetch: fetchTeams
    };
}
