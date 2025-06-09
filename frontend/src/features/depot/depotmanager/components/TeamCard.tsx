import { Pencil, Trash2, Users, UserMinus } from 'lucide-react';
import { DepotTeam } from '../types/DepotTeamTypes';
import { useState } from 'react';
import { AssignOperatorToTeam } from './AssignOperatorToTeam';
import { RemoveOperatorFromTeam } from './RemoveOperatorFromTeam';
import { OperatorInTeam } from '../types/OperatorTypes';
import { TeamOperatorsList } from './TeamOperatorsList';

interface TeamCardProps {
    team: DepotTeam;
    onEdit: (team: DepotTeam) => void;
    onDelete: (team: DepotTeam) => void;
}

export const TeamCard = ({ team, onEdit, onDelete }: TeamCardProps) => {
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
    const [selectedOperator, setSelectedOperator] = useState<OperatorInTeam | null>(null);
    const [isOperatorsListOpen, setIsOperatorsListOpen] = useState(false);

    const handleRemoveOperator = (operator: OperatorInTeam) => {
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

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{team.teamName}</h3>
                    <p className="text-sm text-gray-500 mt-1">{team.teamDescription}</p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => onEdit(team)}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <Pencil className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => onDelete(team)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-gray-900">Operadores</h4>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setIsOperatorsListOpen(true)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <Users className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setIsAssignDialogOpen(true)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <UserMinus className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                <p className="text-sm text-gray-500">
                    {team.operators.length} operador{team.operators.length !== 1 ? 'es' : ''} asignado{team.operators.length !== 1 ? 's' : ''}
                </p>
            </div>

            <AssignOperatorToTeam
                isOpen={isAssignDialogOpen}
                onClose={handleAssignDialogClose}
                team={team}
            />

            {selectedOperator && (
                <RemoveOperatorFromTeam
                    isOpen={isRemoveDialogOpen}
                    onClose={handleRemoveDialogClose}
                    operator={selectedOperator}
                    teamId={team.id}
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
