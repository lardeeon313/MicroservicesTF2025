import type { DeliveryOperatorsInTeamDto } from "../../types/OperatorTypes";
import OperatorCard from "./OperatorCard";

interface Props {
  operators: DeliveryOperatorsInTeamDto[];
  onRemoveOperator: (operator: DeliveryOperatorsInTeamDto) => void;
}

export default function OperatorsList({ operators, onRemoveOperator }: Props) {
  if (operators.length === 0)
    return <p className="text-gray-500 text-sm italic">No hay operadores asignados.</p>;

  return (
    <div className="space-y-2">
      {operators.map((op) => (
        <OperatorCard
          key={op.operatorByUserId}
          operator={op}
          onRemove={() => onRemoveOperator(op)}
        />
      ))}
    </div>
  );
}