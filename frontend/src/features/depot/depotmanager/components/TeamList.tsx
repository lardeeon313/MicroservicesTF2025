import React from "react";
import TeamCard from "./TeamCard";
import { Loader2, PlusCircle } from "lucide-react";
import { DepotTeamUpdateDTO } from "../types/DepotTeamTypes";

interface TeamListProps {
  teams: DepotTeamUpdateDTO[];
  loading: boolean;
  error: string | null;
  onRefetch: () => void;
  onEditTeam: (team: DepotTeamUpdateDTO) => void;
  onAssignOperator: (teamId: number) => void;
  onRemoveOperator: (teamId: number, operatorId: string) => void;
  onCreateTeam: () => void;
}

export default function TeamList({
  teams,
  loading,
  error,
  onRefetch,
  onEditTeam,
  onAssignOperator,
  onRemoveOperator,
  onCreateTeam,
}: TeamListProps) {
  if (loading)
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin w-8 h-8 text-gray-600" />
        <span className="ml-2 text-gray-700">Cargando equipos...</span>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={onRefetch}
          className="btn-primary px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Reintentar
        </button>
      </div>
    );

  if (teams.length === 0)
    return (
      <div className="text-center py-8 text-gray-500">
        No hay equipos registrados.
        <button
          onClick={onCreateTeam}
          className="ml-3 inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          <PlusCircle className="w-5 h-5 mr-1" /> Crear equipo
        </button>
      </div>
    );

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {teams.map((team) => (
        <TeamCard
          key={team.id}
          team={team}
          onEdit={() => onEditTeam(team)}
          onAssignOperator={() => onAssignOperator(team.id)}
          onRemoveOperator={onRemoveOperator}
        />
      ))}
    </div>
  );
}
