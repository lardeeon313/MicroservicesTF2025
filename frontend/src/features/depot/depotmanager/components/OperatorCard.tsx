
import { Operator } from '../types/DepotTeamTypes';

interface Props {
  operator: Operator;
  onRemove: () => void;
}

export default function OperatorCard({ operator, onRemove }: Props) {
  return (
    <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-semibold text-sm">
            {operator.operatorName.charAt(0)}{operator.operatorLastName.charAt(0)}
          </span>
        </div>
        <div>
          <h4 className="font-medium text-gray-900">
            {operator.operatorName} {operator.operatorLastName}
          </h4>
          <p className="text-sm text-gray-500">{operator.operatorEmail}</p>
          <p className="text-xs text-gray-400">Rol: {operator.roleInTeam}</p>
        </div>
      </div>
      <button
        onClick={onRemove}
        className="text-red-600 hover:text-red-800 text-sm font-medium"
      >
        Remover
      </button>
    </div>
  );
} 