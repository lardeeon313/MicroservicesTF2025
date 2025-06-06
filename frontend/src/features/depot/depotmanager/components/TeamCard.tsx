import { DepotTeamUpdateDTO } from "../types/DepotTeamTypes";

interface Props {
  team: DepotTeamUpdateDTO;
  onAssignOperator: (teamId: number) => void;
}

export default function TeamCard({ team, onAssignOperator }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-2">
      <h3 className="text-lg font-semibold">{team.teamName}</h3>
      {team.teamDescription && <p className="text-sm text-gray-600">{team.teamDescription}</p>}
      <p className="text-sm text-gray-800 font-medium">Operadores: {team.operators.length}</p>
      <button
        onClick={() => onAssignOperator(team.id)}
        className="mt-2 px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        Asignar Operador
      </button>
    </div>
  );
}
