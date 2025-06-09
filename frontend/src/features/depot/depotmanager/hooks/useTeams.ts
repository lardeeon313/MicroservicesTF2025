import { useState, useCallback, useEffect } from 'react';
import { DepotTeam, CreateTeamRequest, UpdateTeamRequest } from '../types/DepotTeamTypes';
import { getTeams, createTeam, updateTeam, deleteTeam } from '../services/DepotTeamService';
import { handleFormikError } from '../../../../components/ErrorHandler';
import { AxiosError } from 'axios';
// import { OperatorInTeam } from '../types/OperatorTypes'; // Removed import as it's not used in the original hook

export function useTeams() {
    const [teams, setTeams] = useState<DepotTeam[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Removed dummy state and generateId function
    // const [nextId, setNextId] = useState(1);
    // const generateId = () => {
    //     const id = nextId;
    //     setNextId(nextId + 1);
    //     return id;
    // };

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
            setError("Error al cargar los equipos");
        } finally {
            setLoading(false);
        }
    }, []);

    const createNewTeam = async (team: CreateTeamRequest): Promise<DepotTeam> => {
        try {
            setError(null);
            const newTeam = await createTeam(team);
            setTeams(prevTeams => [...prevTeams, newTeam]);
            return newTeam;
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

    const updateExistingTeam = async (id: number, team: UpdateTeamRequest): Promise<DepotTeam> => {
        try {
            setError(null);
            const updatedTeam = await updateTeam(id, team);
            setTeams(prevTeams => {
                const newTeams = prevTeams.map(t => 
                    t.id === id 
                        ? { ...t, ...updatedTeam, operators: t.operators }
                        : t
                );
                return newTeams;
            });
            return updatedTeam;
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
    
    // Removed dummy operator management functions
    // const assignOperator = async (teamId: number, operator: OperatorInTeam): Promise<void> => { ... };
    // const removeOperator = async (operatorId: string, teamId: number): Promise<void> => { ... };

    // Solo ejecutar fetchTeams al montar el componente
    useEffect(() => {
        fetchTeams();
    }, []); // Removed fetchTeams from dependencies

    return {
        teams,
        loading,
        error,
        createNewTeam,
        updateExistingTeam,
        removeTeam,
        // Removed dummy operator management functions from return
        // assignOperator,
        // removeOperator,
        refetch: fetchTeams // refetch is still useful for manually refreshing the list
    };
}
