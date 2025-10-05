import { useState, useCallback } from 'react';
import { useDeliveryTeams } from '../../hooks/useDeliveryTeams';
import { CreateZoneDialog } from './CreateZoneDialog';
import { UpdateZoneDialog } from './UpdateZoneDialog';
import { DeleteZoneDialog } from './DeleteZoneDialog';
import { ZoneCard } from './ZoneCard';
import { DeliveryZoneDto } from '../../types/DeliveryTeamTypes';
import { CircleAlert, Plus, MapPin } from 'lucide-react';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import EmptyState from '../../../../components/EmptyState';

export const ZoneList = () => {
    const {
        zones,
        zonesLoading,
        zonesError,
        refetchZones,
        reactivateZone,
        deactivateZone
    } = useDeliveryTeams();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedZone, setSelectedZone] = useState<DeliveryZoneDto | null>(null);

    const handleEdit = useCallback((zone: DeliveryZoneDto) => {
        setSelectedZone(zone);
        setIsUpdateDialogOpen(true);
    }, []);

    const handleDelete = useCallback((zone: DeliveryZoneDto) => {
        setSelectedZone(zone);
        setIsDeleteDialogOpen(true);
    }, []);

    const handleDeleteDialogClose = useCallback((success?: boolean) => {
        setIsDeleteDialogOpen(false);
        setSelectedZone(null);
        if (success) {
            refetchZones();
        }
    }, [refetchZones]);

    const handleUpdateDialogClose = useCallback((success?: boolean) => {
        setIsUpdateDialogOpen(false);
        setSelectedZone(null);
        if (success) {
            refetchZones();
        }
    }, [refetchZones]);

    const handleCreateDialogClose = useCallback((success?: boolean) => {
        setIsCreateDialogOpen(false);
        if (success) {
            refetchZones();
        }
    }, [refetchZones]);

    if (zonesLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
            </div>
        );
    }

    if (zonesError) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <CircleAlert className="h-12 w-12 text-red-500" />
                <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900">Error al cargar las zonas</h3>
                    <p className="text-sm text-gray-500 mt-1">{zonesError}</p>
                </div>
                <button
                    onClick={() => refetchZones()}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    const hasZones = zones && zones.length > 0;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Zonas de Entrega</h2>
                <button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Zona
                </button>
            </div>

            {hasZones ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {zones.map((zone) => (
                        <ZoneCard
                            key={zone.id}
                            zone={zone}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onActivate={reactivateZone}
                            onDeactivate={deactivateZone}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState
                    title="No hay zonas de entrega"
                    description="Comienza creando tu primera zona de entrega."
                    actionLabel="Crear Zona"
                    onAction={() => setIsCreateDialogOpen(true)}
                    icon={MapPin}
                />
            )}

            <CreateZoneDialog
                isOpen={isCreateDialogOpen}
                onClose={handleCreateDialogClose}
            />

            <UpdateZoneDialog
                isOpen={isUpdateDialogOpen}
                onClose={handleUpdateDialogClose}
                zone={selectedZone}
            />

            <DeleteZoneDialog
                isOpen={isDeleteDialogOpen}
                onClose={handleDeleteDialogClose}
                zone={selectedZone}
            />
        </div>
    );
};
