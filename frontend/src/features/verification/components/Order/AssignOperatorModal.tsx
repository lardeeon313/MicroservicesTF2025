import { useState, useEffect } from 'react';
import { useOrderOperations } from '../../hooks/useOrders';
import { AssignOperatorRequest } from '../../types/OrderTypes';
import { OperatorDto } from '../../types/OperatorTypes';
import { DeliveryTeamDto, DeliveryZoneDto } from '../../types/DeliveryTeamTypes';
import { getTeamByDeliveryOperator } from '../../services/OrderService';
import toast from 'react-hot-toast';

interface AssignOperatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  operators: OperatorDto[];
  onSuccess?: () => void;
}

export const AssignOperatorModal = ({ 
  isOpen, 
  onClose, 
  orderId, 
  operators,
  onSuccess 
}: AssignOperatorModalProps) => {
  const [selectedOperatorId, setSelectedOperatorId] = useState<string>('');
  const [selectedZoneId, setSelectedZoneId] = useState<number | undefined>(undefined);
  const [team, setTeam] = useState<DeliveryTeamDto | null>(null);
  const [availableZones, setAvailableZones] = useState<DeliveryZoneDto[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(false);
  const { assignOperatorToOrder, loading } = useOrderOperations();

  // Flujo: Al seleccionar un operador, buscar su equipo y sus zonas activas
  useEffect(() => {
    const fetchTeamAndZones = async () => {
      if (!selectedOperatorId) {
        setTeam(null);
        setAvailableZones([]);
        setSelectedZoneId(undefined);
        return;
      }

      try {
        setLoadingTeam(true);
        
        // Paso 1: Buscar el equipo del operador seleccionado
        const teamData = await getTeamByDeliveryOperator(selectedOperatorId);
        
        if (teamData) {
          setTeam(teamData);
          
          // Paso 2: Obtener las zonas activas del equipo (el backend ya las filtra)
          const zones = (teamData.zoneAssignments || (teamData as any).ZoneAssignments || []);
          
          // Asegurar que solo mostramos zonas activas
          const activeZones = zones.filter((zone: any) => {
            const isActive = zone.isActive !== undefined ? zone.isActive : zone.IsActive;
            return isActive !== false;
          });
          
          setAvailableZones(activeZones);
          
          // Paso 3: Seleccionar automáticamente la primera zona activa
          if (activeZones.length > 0) {
            const firstZone = activeZones[0];
            const zoneId = firstZone.id || (firstZone as any).Id;
            setSelectedZoneId(zoneId);
          } else {
            setSelectedZoneId(undefined);
            toast.error('El equipo del operador no tiene zonas activas asignadas');
          }
        } else {
          setTeam(null);
          setAvailableZones([]);
          setSelectedZoneId(undefined);
          toast.error('No se encontró un equipo asociado al operador seleccionado');
        }
      } catch (error: any) {
        setTeam(null);
        setAvailableZones([]);
        setSelectedZoneId(undefined);
        const errorMessage = error.response?.data?.message || error.message || 'Error al obtener la información del equipo del operador';
        toast.error(errorMessage);
      } finally {
        setLoadingTeam(false);
      }
    };

    fetchTeamAndZones();
  }, [selectedOperatorId]);

  // Paso 4: Asignar la orden al operador, equipo y zona seleccionada
  const handleAssign = async () => {
    if (!selectedOperatorId) {
      toast.error('Por favor selecciona un operador');
      return;
    }

    if (!team) {
      toast.error('El operador seleccionado no tiene un equipo asignado');
      return;
    }

    if (availableZones.length === 0 || !selectedZoneId) {
      toast.error('Debes seleccionar una zona de entrega');
      return;
    }

    // Crear el request con todos los datos necesarios para el comando AssignOrder
    const request: AssignOperatorRequest = {
      logisticOrderId: orderId,
      operatorUserId: selectedOperatorId,
      deliveryZoneId: selectedZoneId
    };
    
    const success = await assignOperatorToOrder(request);
    
    if (success) {
      toast.success('Orden asignada al operador, equipo y zona exitosamente');
      // Limpiar el estado
      setSelectedOperatorId('');
      setSelectedZoneId(undefined);
      setTeam(null);
      setAvailableZones([]);
      onSuccess?.();
      onClose();
    } else {
      toast.error('Error al asignar la orden al operador');
    }
  };

  const handleClose = () => {
    setSelectedOperatorId('');
    setSelectedZoneId(undefined);
    setTeam(null);
    setAvailableZones([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[60]">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Asignar Operador a Orden L-{orderId}
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Operador
            </label>
            <select
              value={selectedOperatorId}
              onChange={(e) => setSelectedOperatorId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              disabled={loading || loadingTeam}
            >
              <option value="">Selecciona un operador...</option>
              {operators.length === 0 ? (
                <option value="" disabled>No hay operadores disponibles</option>
              ) : (
                operators.map((operator) => (
                  <option key={operator.id} value={operator.id}>
                    {operator.fullName} ({operator.email})
                  </option>
                ))
              )}
            </select>
            {operators.length === 0 && (
              <p className="text-sm text-red-600 mt-2">
                No hay operadores disponibles. Verifica que el servicio esté funcionando.
              </p>
            )}
            {loadingTeam && selectedOperatorId && (
              <p className="text-sm text-gray-500 mt-2">
                Cargando información del equipo...
              </p>
            )}
          </div>

          {team && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipo Asignado
              </label>
              <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                <p className="text-sm text-gray-900 font-medium">{team.teamName}</p>
                {team.teamDescription && (
                  <p className="text-xs text-gray-500 mt-1">{team.teamDescription}</p>
                )}
              </div>
            </div>
          )}

          {team && availableZones.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Zona de Entrega
              </label>
              <select
                value={selectedZoneId || ''}
                onChange={(e) => setSelectedZoneId(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                disabled={loading || loadingTeam}
              >
                {availableZones.map((zone) => {
                  const zoneId = zone.id || (zone as any).Id;
                  const zoneName = zone.name || (zone as any).Name || '';
                  const zoneDesc = zone.description || (zone as any).Description;
                  return (
                    <option key={zoneId} value={zoneId}>
                      {zoneName} {zoneDesc ? `- ${zoneDesc}` : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {team && availableZones.length === 0 && !loadingTeam && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-sm text-yellow-800">
                ⚠️ El equipo del operador no tiene zonas activas asignadas. No se puede completar la asignación.
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={handleAssign}
              disabled={loading || loadingTeam || !selectedOperatorId || !team || availableZones.length === 0 || !selectedZoneId}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Asignando...' : 'Asignar Operador'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
