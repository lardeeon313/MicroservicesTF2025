import { DeliveryOperatorsInTeamDto } from '../../types/OperatorTypes';

interface Props {
  operator: DeliveryOperatorsInTeamDto;
  onRemove: () => void;
}

export default function OperatorCard({ operator, onRemove }: Props) {
  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase();
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-semibold text-sm">
            {getInitials(operator.firstName, operator.lastName)}
          </span>
        </div>
        <div>
          <h4 className="font-medium text-gray-900">
            {operator.firstName} {operator.lastName}
          </h4>
          <p className="text-sm text-gray-500">{operator.email}</p>
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