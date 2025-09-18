import { useState, useCallback } from 'react';
import { useTeams } from '../hooks/useTeams';
import { TeamCard } from './TeamCard';
import { CreateTeamDialog } from './CreateTeamDialog';
import { UpdateTeamDialog } from './UpdateTeamDialog';
import { DeleteTeamDialog } from './DeleteTeamDialog';
import { DepotTeam } from '../types/DepotTeamTypes';
import { CircleAlert, Plus } from 'lucide-react';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import EmptyState from '../../../../components/EmptyState';

export const TeamList = () => {
    const { teams, loading, error, refetch } = useTeams();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<DepotTeam | null>(null);

    const handleEdit = useCallback((team: DepotTeam) => {
        setSelectedTeam(team);
        setIsUpdateDialogOpen(true);
    }, []);

    const handleDelete = useCallback((team: DepotTeam) => {
        setSelectedTeam(team);
        setIsDeleteDialogOpen(true);
    }, []);

    const handleDeleteDialogClose = useCallback((success?: boolean) => {
        setIsDeleteDialogOpen(false);
        setSelectedTeam(null);
        if (success) {
            refetch();
        }
    }, [refetch]);

    const handleUpdateDialogClose = useCallback((success?: boolean) => {
        setIsUpdateDialogOpen(false);
        setSelectedTeam(null);
        if (success) {
            refetch();
        }
    }, [refetch]);

    const handleCreateDialogClose = useCallback((success?: boolean) => {
        setIsCreateDialogOpen(false);
        if (success) {
            refetch();
        }
    }, [refetch]);

    if (loading) {
        return (
            <LoadingSpinner message="Cargando equipos..." height='h-screen' />
        );
    }

    if (error) {
        return (
            <EmptyState
                icon={CircleAlert}
                title="Error al cargar equipos"
                description="Ocurrió un error al cargar los equipos. Intenta nuevamente."
                actionLabel="Reintentar"
                onAction={refetch}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Equipos</h2>
                <button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Nuevo Equipo
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {teams.map((team) => (
                    <TeamCard
                        key={team.id}
                        team={team}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onRefetch={refetch}
                    />
                ))}
            </div>

            <CreateTeamDialog
                isOpen={isCreateDialogOpen}
                onClose={handleCreateDialogClose}
            />

            {selectedTeam && (
                <>
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
                </>
            )}
        </div>
    );
};
