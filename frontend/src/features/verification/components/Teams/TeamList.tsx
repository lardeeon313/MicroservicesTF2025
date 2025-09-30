import { useState, useCallback } from 'react';
import { useDeliveryTeams } from '../../hooks/useDeliveryTeams';
import { TeamCard } from './TeamCard';
import { CreateTeamDialog } from './CreateTeamDialog';
import { DeliveryTeamDto } from '../../types/DeliveryTeamTypes';
import { CircleAlert, Plus, Users } from 'lucide-react';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import EmptyState from '../../../../components/EmptyState';
import { UpdateTeamDialog } from './UpdateTeamDialog';
import { DeleteTeamDialog } from './DeleteTeamDialog';

export const TeamList = () => {
    const {
        teams,
        teamsLoading,
        teamsError,
        refetchTeams,
        reactivateTeam,
        deactivateTeam
    } = useDeliveryTeams();


    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<DeliveryTeamDto | null>(null);

    const handleEdit = useCallback((team: DeliveryTeamDto) => {
        setSelectedTeam(team);
        setIsUpdateDialogOpen(true);
    }, []);

    const handleDelete = useCallback((team: DeliveryTeamDto) => {
        setSelectedTeam(team);
        setIsDeleteDialogOpen(true);
    }, []);

    const handleDeleteDialogClose = useCallback((success?: boolean) => {
        setIsDeleteDialogOpen(false);
        setSelectedTeam(null);
        if (success) {
            refetchTeams();
        }
    }, [refetchTeams]);

    const handleUpdateDialogClose = useCallback((success?: boolean) => {
        setIsUpdateDialogOpen(false);
        setSelectedTeam(null);
        if (success) {
            refetchTeams();
        }
    }, [refetchTeams]);

    const handleCreateDialogClose = useCallback((success?: boolean) => {
        setIsCreateDialogOpen(false);
        if (success) {
            refetchTeams();
        }
    }, [refetchTeams]);

    if (teamsLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
            </div>
        );
    }

    if (teamsError) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <CircleAlert className="h-12 w-12 text-red-500" />
                <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900">Error al cargar los equipos</h3>
                    <p className="text-sm text-gray-500 mt-1">{teamsError}</p>
                </div>
                <button
                    onClick={() => refetchTeams()}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    const hasTeams = teams && teams.length > 0;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Equipos de Entrega</h2>
                <button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Equipo
                </button>
            </div>

            {hasTeams ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teams.map((team) => (
                        <TeamCard
                            key={team.id}
                            team={team}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onActivate={reactivateTeam}
                            onDeactivate={deactivateTeam}
                            onRefetch={refetchTeams}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState
                    title="No hay equipos de entrega"
                    description="Comienza creando tu primer equipo de entrega."
                    actionLabel="Crear Equipo"
                    onAction={() => setIsCreateDialogOpen(true)}
                    icon={Users}
                />
            )}

            <CreateTeamDialog
                isOpen={isCreateDialogOpen}
                onClose={handleCreateDialogClose}
            />

            <UpdateTeamDialog
                isOpen={isUpdateDialogOpen}
                onClose={handleUpdateDialogClose}
                team={selectedTeam}
            />

            <DeleteTeamDialog
                isOpen={isDeleteDialogOpen}
                onClose={handleDeleteDialogClose}
                team={selectedTeam}
            />
        </div>
    );
};