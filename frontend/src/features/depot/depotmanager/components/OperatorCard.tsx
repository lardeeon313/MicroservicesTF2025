import { Operator } from "../types/DepotTeamTypes";

interface Props {
  operator: Operator;
  onRemove: () => void;
}

export default function OperatorCard({ operator, onRemove }: Props) {
  return (
    <div className="bg-gray-50 rounded-md p-3 flex justify-between items-center shadow-sm">
      <div>
        <p className="font-semibold">{operator.firstName} {operator.lastName}</p>
        {operator.email && <p className="text-xs text-gray-500">{operator.email}</p>}
      </div>
      <button
        onClick={onRemove}
        className="text-red-600 hover:text-red-800 transition"
        title="Eliminar Operador"
      >
        ✕
      </button>
    </div>
  );
}
