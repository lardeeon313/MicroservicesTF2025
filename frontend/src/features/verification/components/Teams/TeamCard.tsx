import { Pencil, Trash2, MapPin, Calendar, Power, PowerOff, Plus, List, X } from 'lucide-react';
import { DeliveryTeamDto, DeliveryZoneDto } from '../../types/DeliveryTeamTypes';
import { useState } from 'react';
import { AssignOperatorToTeam } from './AssignOperatorToTeam';
import { RemoveOperatorFromTeam } from './RemoveOperatorFromTeam';
import { DeliveryOperatorsInTeamDto } from '../../types/OperatorTypes';
import { TeamOperatorsList } from './TeamOperatorsList';
import { AssignZoneModal } from './AssignZoneModal';
import { removeZoneFromTeam } from '../../services/DeliveryTeamService';

interface TeamCardProps {
    team: DeliveryTeamDto;
    onEdit: (team: DeliveryTeamDto) => void;
    onDelete: (team: DeliveryTeamDto) => void;
    onActivate?: (teamId: number) => Promise<void>;
    onDeactivate?: (teamId: number) => Promise<void>;
    onRefetch?: () => Promise<void>;
}

export const TeamCard = ({ team, onEdit, onDelete, onActivate, onDeactivate, onRefetch }: TeamCardProps) => {
    
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
    const [selectedOperator, setSelectedOperator] = useState<DeliveryOperatorsInTeamDto | null>(null);
    const [isOperatorsListOpen, setIsOperatorsListOpen] = useState(false);
    const [isAssignZoneModalOpen, setIsAssignZoneModalOpen] = useState(false);

    const handleRemoveOperator = (operator: DeliveryOperatorsInTeamDto) => {
        setSelectedOperator(operator);
        setIsRemoveDialogOpen(true);
    };

    const handleAssignDialogClose = () => {
        setIsAssignDialogOpen(false);
        setSelectedOperator(null);
    };

    const handleRemoveDialogClose = () => {
        setIsRemoveDialogOpen(false);
        setSelectedOperator(null);
    };

    const handleRemoveZone = async (zone: DeliveryZoneDto) => {
        try {
            await removeZoneFromTeam(team.id, zone.id);
            if (onRefetch) await onRefetch();
        } catch (error) {
            console.error('Error al remover zona:', error);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{team.teamName}</h3>
                    {team.teamDescription && (
                        <p className="text-sm text-gray-500 mt-1">{team.teamDescription}</p>
                    )}
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => onEdit(team)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar equipo"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    {team.isActive ? (
                        <button
                            onClick={() => onDeactivate?.(team.id)}
                            className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Desactivar equipo"
                        >
                            <PowerOff className="h-4 w-4" />
                        </button>
                    ) : (
                        <button
                            onClick={() => onActivate?.(team.id)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Activar equipo"
                        >
                            <Power className="h-4 w-4" />
                        </button>
                    )}
                    <button
                        onClick={() => onDelete(team)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar equipo"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Información del equipo */}
            <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Creado: {formatDate(team.createdAt)}</span>
                </div>

                {team.zoneAssignments.length > 0 && (
                    <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-red-500" />
                        <span>{team.zoneAssignments.length} zona{team.zoneAssignments.length !== 1 ? 's' : ''}</span>
                    </div>
                )}
            </div>

            {/* Zonas asignadas */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700">Zonas Asignadas:</h4>
                    <button
                        onClick={() => setIsAssignZoneModalOpen(true)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Asignar zona"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>
                {team.zoneAssignments.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                        {team.zoneAssignments.map((zone) => (
                            <span
                                key={zone.id}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 group"
                            >
                                {zone.name}
                                <button
                                    onClick={() => handleRemoveZone(zone)}
                                    className="ml-1 text-red-600 hover:text-red-800 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Remover zona"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No hay zonas asignadas</p>
                )}
            </div>

            {/* Operadores */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700">Operadores:</h4>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setIsOperatorsListOpen(true)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver lista de operadores"
                        >
                            <List className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setIsAssignDialogOpen(true)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Asignar operador"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                
                <p className="text-sm text-gray-600">
                    {team.operators.length} operador{team.operators.length !== 1 ? 'es' : ''} asignado{team.operators.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Estado del equipo */}
            <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    team.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                }`}>
                    {team.isActive ? 'Activo' : 'Inactivo'}
                </span>
            </div>

            {/* Dialogs */}
            <AssignOperatorToTeam
                isOpen={isAssignDialogOpen}
                onClose={handleAssignDialogClose}
                teamId={team.id}
                onRefetch={onRefetch}
            />

            <RemoveOperatorFromTeam
                isOpen={isRemoveDialogOpen}
                onClose={handleRemoveDialogClose}
                operator={selectedOperator}
                teamId={team.id}
                onRefetch={onRefetch}
            />

            <TeamOperatorsList
                isOpen={isOperatorsListOpen}
                onClose={() => setIsOperatorsListOpen(false)}
                operators={team.operators}
                teamName={team.teamName}
                onRemoveOperator={handleRemoveOperator}
            />


            <AssignZoneModal
                isOpen={isAssignZoneModalOpen}
                onClose={() => setIsAssignZoneModalOpen(false)}
                teamId={team.id}
                teamName={team.teamName}
                onSuccess={() => onRefetch?.()}
            />

        </div>
    );
};