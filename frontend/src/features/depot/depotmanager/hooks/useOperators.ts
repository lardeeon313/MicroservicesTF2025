import { useState, useCallback } from 'react';
import { AssignOperatorRequest, OperatorDto } from '../types/OperatorTypes';
import { assignOperatorToTeam, removeOperatorFromTeam, getAllOperators } from '../services/operatorService';
import { handleFormikError } from '../../../../components/ErrorHandler';
import { AxiosError } from 'axios';

export function useOperators() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [operators, setOperators] = useState<OperatorDto[]>([]);

    const fetchOperators = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Starting to fetch operators...');
            const data = await getAllOperators();
            console.log('Received operators data:', data);
            if (!data || !Array.isArray(data)) {
                console.error('Invalid operators data received:', data);
                throw new Error('Invalid response format from server');
            }
            setOperators(data);
        } catch (error) {
            console.error('Error in fetchOperators:', error);
            if (error instanceof AxiosError) {
                console.error('Axios error details:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    headers: error.response?.headers
                });
                handleFormikError({
                    error,
                    customMessages: {
                        401: "No tienes autorización para ver los operadores.",
                        500: "Error interno del servidor.",
                    },
                });
            }
            setError("Error al cargar los operadores");
        } finally {
            setLoading(false);
        }
    }, []);

    const assignOperator = async (request: AssignOperatorRequest): Promise<void> => {
        try {
            setLoading(true);
            await assignOperatorToTeam(request.teamId, request.operatorUserId);
            setError(null);
        } catch (error) {
            handleFormikError({
                error,
                customMessages: {
                    400: "Datos inválidos, por favor verificá los campos.",
                    404: "Operador o equipo no encontrado.",
                    500: "Error interno del servidor.",
                },
            });
            setError("Error al asignar el operador");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const removeOperator = async (operatorId: string, teamId: string): Promise<void> => {
        try {
            setLoading(true);
            await removeOperatorFromTeam(Number(teamId), operatorId);
            setError(null);
        } catch (error) {
            handleFormikError({
                error,
                customMessages: {
                    404: "Operador o equipo no encontrado.",
                    500: "Error interno del servidor.",
                },
            });
            setError("Error al remover el operador");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        operators,
        fetchOperators,
        assignOperator,
        removeOperator
    };
}
