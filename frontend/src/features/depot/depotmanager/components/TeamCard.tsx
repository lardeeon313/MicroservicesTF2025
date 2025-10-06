import { Pencil, Trash2, Calendar, Plus, List } from 'lucide-react';
import { DepotTeam } from '../types/DepotTeamTypes';
import { useState } from 'react';
import { AssignOperatorToTeam } from './AssignOperatorToTeam';
import { RemoveOperatorFromTeam } from './RemoveOperatorFromTeam';
import { OperatorInTeamDto } from '../types/OperatorTypes';
import { TeamOperatorsList } from './TeamOperatorsList';

interface TeamCardProps {
    team: DepotTeam;
    onEdit: (team: DepotTeam) => void;
    onDelete: (team: DepotTeam) => void;
    onRefetch?: () => Promise<void>;
}

export const TeamCard = ({ team, onEdit, onDelete, onRefetch }: TeamCardProps) => {
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
    const [selectedOperator, setSelectedOperator] = useState<OperatorInTeamDto | null>(null);
    const [isOperatorsListOpen, setIsOperatorsListOpen] = useState(false);

    const handleRemoveOperator = (operator: OperatorInTeamDto) => {
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

    const formatDate = (date: Date | string) => {
        const dateObj = date instanceof Date ? date : new Date(date);
        return dateObj.toLocaleDateString('es-ES', {
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

            <AssignOperatorToTeam
                isOpen={isAssignDialogOpen}
                onClose={handleAssignDialogClose}
                team={team}
                onRefetch={onRefetch}
            />

            {selectedOperator && (
                <RemoveOperatorFromTeam
                    isOpen={isRemoveDialogOpen}
                    onClose={handleRemoveDialogClose}
                    operator={selectedOperator}
                    teamId={team.id}
                    onRefetch={onRefetch}
                />
            )}

            <TeamOperatorsList
                isOpen={isOperatorsListOpen}
                onClose={() => setIsOperatorsListOpen(false)}
                teamName={team.teamName}
                operators={team.operators}
                onRemoveOperator={handleRemoveOperator}
            />
        </div>
    );
};
