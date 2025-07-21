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
            const data = await getAllOperators();
            setOperators(Array.isArray(data) ? data : []);
        } catch (error) {
            if (error instanceof AxiosError) {
                handleFormikError({
                    error,
                    customMessages: {
                        401: "No tienes autorización para ver los operadores.",
                        500: "Error interno del servidor.",
                    },
                });
            }
            setError("Error al cargar los operadores");
            setOperators([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const assignOperator = async (request: AssignOperatorRequest): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            await assignOperatorToTeam(request.teamId, request.operatorUserId);
            await fetchOperators();
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

    const removeOperator = async (operatorId: string, teamId: number): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            await removeOperatorFromTeam(teamId, operatorId);
            await fetchOperators();
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
