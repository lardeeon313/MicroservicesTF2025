import type { Operator } from "../types/DepotTeamTypes";
import OperatorCard from "./OperatorCard";

interface Props {
  operators: Operator[];
  onRemoveOperator: (operatorId: string) => void;
}

export default function OperatorList({ operators, onRemoveOperator }: Props) {
  if (operators.length === 0)
    return <p className="text-gray-500 text-sm italic">No hay operadores asignados.</p>;

  return (
    <div className="space-y-2">
      {operators.map((op) => (
        <OperatorCard
          key={op.id}
          operator={op}
          onRemove={() => onRemoveOperator(op.id)}
        />
      ))}
    </div>
  );
}