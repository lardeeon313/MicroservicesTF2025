import { useState, useCallback, useEffect } from 'react';
import { 
  DeliveryTeamDto, 
  DeliveryZoneDto,
  CreateDeliveryTeamRequest, 
  UpdateDeliveryTeamRequest,
  CreateDeliveryZoneRequest,
  UpdateDeliveryZoneRequest
} from '../types/DeliveryTeamTypes';
import { 
  getAllTeams, 
  createTeam, 
  updateTeam, 
  deleteTeam,
  disableTeam,
  activateTeam,
  getTeamById,
  getAllZones,
  createZone,
  updateZone,
  deleteZone,
  disableZone,
  activateZone,
  getZoneById
} from '../services/DeliveryTeamService';
import { handleFormikError } from '../../../components/ErrorHandler';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

export function useDeliveryTeams() {
    // ========== TEAM STATES ==========
    const [teams, setTeams] = useState<DeliveryTeamDto[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<DeliveryTeamDto | null>(null);
    const [teamsLoading, setTeamsLoading] = useState(true);
    const [teamsError, setTeamsError] = useState<string | null>(null);

    // ========== ZONE STATES ==========
    const [zones, setZones] = useState<DeliveryZoneDto[]>([]);
    const [selectedZone, setSelectedZone] = useState<DeliveryZoneDto | null>(null);
    const [zonesLoading, setZonesLoading] = useState(true);
    const [zonesError, setZonesError] = useState<string | null>(null);
    
    // Estado para trackear zonas modificadas localmente (persistido en localStorage)
    const [modifiedZones, setModifiedZones] = useState<Map<number, boolean>>(() => {
        try {
            const saved = localStorage.getItem('modifiedZones');
            if (saved) {
                const parsed = JSON.parse(saved);
                return new Map(Object.entries(parsed).map(([key, value]) => [Number(key), value as boolean]));
            }
        } catch (error) {
        }
        return new Map();
    });

    // ========== HELPER FUNCTIONS ==========
    
    // Función para actualizar el estado de zonas modificadas y persistirlo
    const updateModifiedZones = (zoneId: number, isActive: boolean) => {
        setModifiedZones(prev => {
            const newMap = new Map(prev.set(zoneId, isActive));
            
            // Guardar en localStorage
            try {
                const toSave = Object.fromEntries(newMap);
                localStorage.setItem('modifiedZones', JSON.stringify(toSave));
            } catch (error) {
            }
            
            return newMap;
        });
    };
    
    // Función para determinar el estado de una zona basándose en la respuesta del API
    const determineZoneStatus = (zone: any, previousZones: DeliveryZoneDto[] = [], isNewZone: boolean = false): boolean => {
        // Si el API devuelve explícitamente el campo isActive, usarlo
        if (zone.isActive !== undefined) return Boolean(zone.isActive);
        if ((zone as any).IsActive !== undefined) return Boolean((zone as any).IsActive);
        if ((zone as any).active !== undefined) return Boolean((zone as any).active);
        if ((zone as any).status !== undefined) return Boolean((zone as any).status);
        
        // Si la zona fue modificada localmente, usar ese estado
        if (modifiedZones.has(zone.id)) {
            const localStatus = modifiedZones.get(zone.id);
            return localStatus!;
        }
        
        // Si es una zona nueva, asumir que está INACTIVA
        if (isNewZone) {
            return false;
        }
        
        // Si no hay campo explícito, buscar en el estado anterior
        const previousZone = previousZones.find(pz => pz.id === zone.id);
        if (previousZone) {
            return previousZone.isActive;
        }
        
        // Si no hay información previa y no es zona nueva, asumir que está activa
        // (para zonas que ya existían pero no tenían estado previo)
        return true;
    };

    // ========== TEAM OPERATIONS ==========

    const fetchTeams = useCallback(async () => {
        try {
            setTeamsLoading(true);
            setTeamsError(null);
            const data = await getAllTeams();
            // Forzar nueva referencia para que React detecte el cambio
            setTeams([...data]);
        } catch (error) {
            setTeamsError("Error al cargar los equipos de entrega");
            setTeams([]);
            
            if (error instanceof AxiosError) {
                handleFormikError({
                    error,
                    customMessages: {
                        400: "Datos inválidos, por favor verificá los campos.",
                        401: "No tienes autorización para ver los equipos de entrega.",
                        404: "Equipos de entrega no encontrados.",
                        500: "Error interno del servidor.",
                    },
                });
            }
        } finally {
            setTeamsLoading(false);
        }
    }, []);

    const fetchTeamById = useCallback(async (teamId: number) => {
        try {
            setTeamsError(null);
            const data = await getTeamById(teamId);
            setSelectedTeam(data);
            return data;
        } catch (error) {
            setTeamsError("Error al cargar el equipo de entrega");
            setSelectedTeam(null);
            
            if (error instanceof AxiosError) {
                handleFormikError({
                    error,
                    customMessages: {
                        400: "ID de equipo inválido.",
                        401: "No tienes autorización para ver este equipo.",
                        404: "Equipo de entrega no encontrado.",
                        500: "Error interno del servidor.",
                    },
                });
            }
            throw error;
        }
    }, []);

    const createNewTeam = async (team: CreateDeliveryTeamRequest): Promise<void> => {
        try {
            setTeamsError(null);
            await createTeam(team);
            await fetchTeams(); // Refresca la lista tras crear
            
        } catch (error) {
            if (error instanceof AxiosError) {
                handleFormikError({
                    error,
                    customMessages: {
                        400: "Datos inválidos, por favor verificá los campos.",
                        401: "No tienes autorización para crear equipos de entrega.",
                        500: "Error interno del servidor.",
                    },
                });
            }
            throw error;
        }
    };

    const updateExistingTeam = async (teamId: number, team: UpdateDeliveryTeamRequest): Promise<void> => {
        try {
            setTeamsError(null);
            await updateTeam(teamId, team);
            await fetchTeams(); // Refresca la lista tras actualizar
            
        } catch (error) {
            if (error instanceof AxiosError) {
                handleFormikError({
                    error,
                    customMessages: {
                        400: "Datos inválidos, por favor verificá los campos.",
                        401: "No tienes autorización para actualizar equipos de entrega.",
                        404: "Equipo de entrega no encontrado.",
                        500: "Error interno del servidor.",
                    },
                });
            }
            throw error;
        }
    };

    const removeTeam = async (teamId: number): Promise<void> => {
        try {
            setTeamsError(null);
            await deleteTeam(teamId);
            setTeams(prevTeams => prevTeams.filter(team => team.id !== teamId));
        } catch (error) {
            if (error instanceof AxiosError) {
                handleFormikError({
                    error,
                    customMessages: {
                        401: "No tienes autorización para eliminar equipos de entrega.",
                        404: "Equipo de entrega no encontrado.",
                        500: "Error interno del servidor.",
                    },
                });
            }
            throw error;
        }
    };

    const deactivateTeam = async (teamId: number): Promise<void> => {
        try {
            setTeamsError(null);
            await disableTeam(teamId);
            await fetchTeams(); // Refresca la lista tras desactivar
            toast.success('Equipo desactivado exitosamente');
        } catch (error) {
            if (error instanceof AxiosError) {
                handleFormikError({
                    error,
                    customMessages: {
                        401: "No tienes autorización para desactivar equipos de entrega.",
                        404: "Equipo de entrega no encontrado.",
                        500: "Error interno del servidor.",
                    },
                });
            } else {
                toast.error('Error al desactivar el equipo');
            }
            throw error;
        }
    };

    const reactivateTeam = async (teamId: number): Promise<void> => {
        try {
            setTeamsError(null);
            await activateTeam(teamId);
            await fetchTeams(); // Refresca la lista tras reactivar
            toast.success('Equipo activado exitosamente');
        } catch (error) {
            if (error instanceof AxiosError) {
                handleFormikError({
                    error,
                    customMessages: {
                        401: "No tienes autorización para reactivar equipos de entrega.",
                        404: "Equipo de entrega no encontrado.",
                        500: "Error interno del servidor.",
                    },
                });
            } else {
                toast.error('Error al activar el equipo');
            }
            throw error;
        }
    };

    // ========== ZONE OPERATIONS ==========

    const fetchZones = useCallback(async () => {
        try {
            setZonesLoading(true);
            setZonesError(null);
            const data = await getAllZones();
            
            // Mapear los datos para asegurar que isActive sea un booleano
            const mappedData = data.map(zone => {
                // Detectar si es una zona nueva (ID más alto que las existentes)
                const maxExistingId = zones.length > 0 ? Math.max(...zones.map(z => z.id)) : 0;
                const isNewZone = zone.id > maxExistingId;
                
                // Usar la función helper para determinar el estado
                const isActiveValue = determineZoneStatus(zone, zones, isNewZone);
                
                return {
                    ...zone,
                    isActive: isActiveValue
                };
            });
            
            // Forzar nueva referencia para que React detecte el cambio
            setZones([...mappedData]);
        } catch (error) {
            setZonesError("Error al cargar las zonas de entrega");
            setZones([]);
            
            if (error instanceof AxiosError) {
                handleFormikError({
                    error,
                    customMessages: {
                        400: "Datos inválidos, por favor verificá los campos.",
                        401: "No tienes autorización para ver las zonas de entrega.",
                        404: "Zonas de entrega no encontradas.",
                        500: "Error interno del servidor.",
                    },
                });
            }
        } finally {
            setZonesLoading(false);
        }
    }, []);

    const fetchZoneById = useCallback(async (zoneId: number) => {
        try {
            setZonesError(null);
            const data = await getZoneById(zoneId);
            
            // Mapear los datos para asegurar que isActive sea un booleano
            // Detectar si es una zona nueva (ID más alto que las existentes)
            const maxExistingId = zones.length > 0 ? Math.max(...zones.map(z => z.id)) : 0;
            const isNewZone = data.id > maxExistingId;
            
            // Usar la función helper para determinar el estado
            const isActiveValue = determineZoneStatus(data, zones, isNewZone);
            
            const mappedData = {
                ...data,
                isActive: isActiveValue
            };
            setSelectedZone(mappedData);
            return mappedData;
        } catch (error) {
            setZonesError("Error al cargar la zona de entrega");
            setSelectedZone(null);
            
            if (error instanceof AxiosError) {
                handleFormikError({
                    error,
                    customMessages: {
                        400: "ID de zona inválido.",
                        401: "No tienes autorización para ver esta zona.",
                        404: "Zona de entrega no encontrada.",
                        500: "Error interno del servidor.",
                    },
                });
            }
            throw error;
        }
    }, []);

    const createNewZone = async (zone: CreateDeliveryZoneRequest): Promise<void> => {
        try {
            setZonesError(null);
            await createZone(zone);
            
            // Refrescar la lista tras crear
            await fetchZones();
            
            // Mostrar mensaje de éxito
            toast.success('Zona creada exitosamente');
        } catch (error) {
            if (error instanceof AxiosError) {
                handleFormikError({
                    error,
                    customMessages: {
                        400: "Datos inválidos, por favor verificá los campos.",
                        401: "No tienes autorización para crear zonas de entrega.",
                        500: "Error interno del servidor.",
                    },
                });
            } else {
                toast.error('Error al crear la zona');
            }
            throw error;
        }
    };

    const updateExistingZone = async (zoneId: number, zone: UpdateDeliveryZoneRequest): Promise<boolean> => {
        try {
            setZonesError(null);
            const success = await updateZone(zoneId, zone);
            if (success) {
                await fetchZones(); // Refresca la lista tras actualizar
            }
            return success;
        } catch (error) {
            if (error instanceof AxiosError) {
                handleFormikError({
                    error,
                    customMessages: {
                        400: "Datos inválidos, por favor verificá los campos.",
                        401: "No tienes autorización para actualizar zonas de entrega.",
                        404: "Zona de entrega no encontrada.",
                        500: "Error interno del servidor.",
                    },
                });
            }
            throw error;
        }
    };

    const removeZone = async (zoneId: number): Promise<boolean> => {
        try {
            setZonesError(null);
            const success = await deleteZone(zoneId);
            if (success) {
                setZones(prevZones => prevZones.filter(zone => zone.id !== zoneId));
            }
            return success;
        } catch (error) {
            if (error instanceof AxiosError) {
                handleFormikError({
                    error,
                    customMessages: {
                        401: "No tienes autorización para eliminar zonas de entrega.",
                        404: "Zona de entrega no encontrada.",
                        500: "Error interno del servidor.",
                    },
                });
            }
            throw error;
        }
    };

    const deactivateZone = async (zoneId: number): Promise<void> => {
        try {
            setZonesError(null);
            
            // Verificar que la zona existe antes de intentar desactivarla
            const zoneToDeactivate = zones.find(zone => zone.id === zoneId);
            if (!zoneToDeactivate) {
                toast.error('Zona no encontrada');
                return;
            }
            
            if (!zoneToDeactivate.isActive) {
                toast.success('La zona ya está desactivada');
                return;
            }
            
            await disableZone(zoneId);
            
            // Actualizar el estado local inmediatamente
            setZones(prevZones => 
                prevZones.map(zone => 
                    zone.id === zoneId 
                        ? { ...zone, isActive: false }
                        : zone
                )
            );
            
            // Guardar el estado modificado para persistir entre recargas
            updateModifiedZones(zoneId, false);
            
            toast.success('Zona desactivada exitosamente');
        } catch (error) {
            
            if (error instanceof AxiosError) {
                
                handleFormikError({
                    error,
                    customMessages: {
                        401: "No tienes autorización para desactivar zonas de entrega.",
                        404: "Zona de entrega no encontrada.",
                        500: "Error interno del servidor.",
                    },
                });
            } else {
                toast.error('Error al desactivar la zona');
            }
            throw error;
        }
    };

    const reactivateZone = async (zoneId: number): Promise<void> => {
        try {
            setZonesError(null);
            
            // Verificar que la zona existe antes de intentar reactivarla
            const zoneToReactivate = zones.find(zone => zone.id === zoneId);
            if (!zoneToReactivate) {
                toast.error('Zona no encontrada');
                return;
            }
            
            if (zoneToReactivate.isActive) {
                toast.success('La zona ya está activa');
                return;
            }
            
            await activateZone(zoneId);
            
            // Actualizar el estado local inmediatamente
            setZones(prevZones => 
                prevZones.map(zone => 
                    zone.id === zoneId 
                        ? { ...zone, isActive: true }
                        : zone
                )
            );
            
            // Guardar el estado modificado para persistir entre recargas
            updateModifiedZones(zoneId, true);
            
            toast.success('Zona activada exitosamente');
        } catch (error) {
            
            if (error instanceof AxiosError) {
                
                handleFormikError({
                    error,
                    customMessages: {
                        401: "No tienes autorización para reactivar zonas de entrega.",
                        404: "Zona de entrega no encontrada.",
                        500: "Error interno del servidor.",
                    },
                });
            } else {
                toast.error('Error al activar la zona');
            }
            throw error;
        }
    };

    // ========== EFFECTS ==========
    
    useEffect(() => {
        fetchTeams();
    }, [fetchTeams]);

    useEffect(() => {
        fetchZones();
    }, [fetchZones]);

    // ========== RETURN ==========

    return {
        // Team states
        teams,
        selectedTeam,
        teamsLoading,
        teamsError,

        // Zone states
        zones,
        selectedZone,
        zonesLoading,
        zonesError,

        // Team operations
        createNewTeam,
        updateExistingTeam,
        removeTeam,
        deactivateTeam,
        reactivateTeam,
        fetchTeamById,
        refetchTeams: fetchTeams,

        // Zone operations
        createNewZone,
        updateExistingZone,
        removeZone,
        deactivateZone,
        reactivateZone,
        fetchZoneById,
        refetchZones: fetchZones,

        // Combined operations
        refetchAll: () => {
            fetchTeams();
            fetchZones();
        }
    };
}
