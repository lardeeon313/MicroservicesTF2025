import { useState, useCallback, useEffect } from 'react';
import {
  DeliveryOperatorDto,
} from '../types/OperatorTypes';
import {
  getAllOperators,
  assignOperatorToTeam,
  removeOperatorFromTeam,
} from '../services/OperatorService';
import { handleFormikError } from '../../../components/ErrorHandler';
import { AxiosError } from 'axios';

export function useOperators() {
    // ========== STATES ==========
    const [operators, setOperators] = useState<DeliveryOperatorDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ========== OPERATIONS ==========

    const fetchOperators = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllOperators();
            setOperators(data);
        } catch (error) {
            setError("Error al cargar los operadores");
            setOperators([]);

            if (error instanceof AxiosError) {
                handleFormikError({
                    error,
                    customMessages: {
                        400: "Datos inválidos, por favor verificá los campos.",
                        401: "No tienes autorización para ver los operadores.",
                        404: "Operadores no encontrados.",
                        500: "Error interno del servidor.",
                    },
                });
            }
        } finally {
            setLoading(false);
        }
    }, []);


    const assignOperator = async (teamId: number, operatorUserId: string): Promise<void> => {
        try {
            setError(null);
            await assignOperatorToTeam(teamId, operatorUserId);
            // Refrescar la lista de operadores disponibles
            await fetchOperators();
        } catch (error) {
            if (error instanceof AxiosError) {
                handleFormikError({
                    error,
                    customMessages: {
                        400: "Datos inválidos, por favor verificá los campos.",
                        401: "No tienes autorización para asignar operadores.",
                        404: "Equipo u operador no encontrado.",
                        409: "El operador ya está asignado a este equipo.",
                        500: "Error interno del servidor.",
                    },
                });
            }
            throw error;
        }
    };

    const removeOperator = async (teamId: number, operatorUserId: string): Promise<void> => {
        try {
            setError(null);
            await removeOperatorFromTeam(teamId, operatorUserId);
            // Refrescar la lista de operadores
            await fetchOperators();
        } catch (error) {
            if (error instanceof AxiosError) {
                handleFormikError({
                    error,
                    customMessages: {
                        400: "Datos inválidos, por favor verificá los campos.",
                        401: "No tienes autorización para remover operadores.",
                        404: "Equipo u operador no encontrado.",
                        500: "Error interno del servidor.",
                    },
                });
            }
            throw error;
        }
    };


    // ========== EFFECTS ==========

    useEffect(() => {
        fetchOperators();
    }, [fetchOperators]);

    // ========== RETURN ==========

    return {
        // States
        operators,
        loading,
        error,

        // Operations
        assignOperator,
        removeOperator,
        fetchOperators,
    };
}
