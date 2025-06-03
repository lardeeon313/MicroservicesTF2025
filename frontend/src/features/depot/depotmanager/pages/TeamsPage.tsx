import React, { useState } from "react";
import { DepotTeamDialog } from "../components/DepotTeamDialog";
import { RemoveOperatorDialog } from "../components/RemoveOperatorDialog";
import { AssignOperatorDialog } from "../components/AssignOperatorDialog";
import { useDepotTeams } from "../hooks/useDepotTeams";
import { DepotTeamUpdateDTO, AssignOperatorDTO } from "../types";

export const DepotTeamsPage: React.FC = () => {
  const {
    teams,
    loading,
    error,
    createTeam,
    updateTeam,
    assignOperator,
    removeOperator,
  } = useDepotTeams();

  const [showTeamDialog, setShowTeamDialog] = useState(false);
  const [editingTeam, setEditingTeam] = useState<DepotTeamUpdateDTO | null>(null);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [teamForAssign, setTeamForAssign] = useState<number | null>(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [operatorToRemove, setOperatorToRemove] = useState<{ operatorId: string; teamId: number } | null>(null);

  const openCreateTeamDialog = () => {
    setEditingTeam(null);
    setShowTeamDialog(true);
  };

  const openEditTeamDialog = (team: DepotTeamUpdateDTO) => {
    setEditingTeam(team);
    setShowTeamDialog(true);
  };

  const onSubmitTeam = (data: DepotTeamUpdateDTO | any) => {
    if (editingTeam) updateTeam(data);
    else createTeam(data);
    setShowTeamDialog(false);
  };

  const onAssignOperatorSubmit = (data: AssignOperatorDTO) => {
    if (teamForAssign !== null) {
      assignOperator(teamForAssign, data.operatorUserId);
      setShowAssignDialog(false);
    }
  };

  const onRemoveOperatorConfirm = () => {
    if (operatorToRemove) {
      removeOperator(operatorToRemove.teamId, operatorToRemove.operatorId);
      setOperatorToRemove(null);
      setShowRemoveDialog(false);
    }
  };

  if (loading) return <p>Cargando equipos...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Equipos de Depósito</h1>

      <button
        onClick={openCreateTeamDialog}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Crear Nuevo Equipo
      </button>

      <div className="space-y-6">
        {teams.map((team) => (
          <div key={team.id} className="border p-4 rounded shadow">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">{team.teamName}</h2>
              <button
                onClick={() => openEditTeamDialog(team)}
                className="text-sm text-blue-600 hover:underline"
              >
                Editar
              </button>
            </div>
            {team.teamDescription && <p className="mb-3">{team.teamDescription}</p>}

            <div>
              <h3 className="font-semibold mb-1">Operadores asignados:</h3>
              {team.assignments.length === 0 && <p className="italic">Ninguno</p>}
              <ul>
                {team.assignments.map((assignment) => (
                  <li key={assignment.operatorUserId} className="flex justify-between items-center">
                    <span>{assignment.operatorUserId}</span>
                    <button
                      onClick={() => {
                        setOperatorToRemove({ operatorId: assignment.operatorUserId, teamId: team.id });
                        setShowRemoveDialog(true);
                      }}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Remover
                    </button>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  setTeamForAssign(team.id);
                  setShowAssignDialog(true);
                }}
                className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              >
                Asignar Operador
              </button>
            </div>
          </div>
        ))}
      </div>

      <DepotTeamDialog
        isOpen={showTeamDialog}
        onClose={() => setShowTeamDialog(false)}
        onSubmit={onSubmitTeam}
        initialData={editingTeam || undefined}
      />

      <AssignOperatorDialog
        isOpen={showAssignDialog}
        onClose={() => setShowAssignDialog(false)}
        onSubmit={onAssignOperatorSubmit}
      />

      <RemoveOperatorDialog
        isOpen={showRemoveDialog}
        onClose={() => setShowRemoveDialog(false)}
        onConfirm={onRemoveOperatorConfirm}
        operatorId={operatorToRemove?.operatorId || ""}
      />
    </div>
  );
};
