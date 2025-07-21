import { useState } from 'react';
import { OperatorDto } from '../types/OperatorTypes';
import { DepotOrderDto } from '../types/OrderTypes';

interface Props {
  order: DepotOrderDto;
  operators: OperatorDto[];
  onAssign: (orderId: number, operatorUserId: string) => Promise<void>;
  onClose: () => void;
}

export default function AssignOrderToOperator({ order, operators, onAssign, onClose }: Props) {
  const [selectedOperator, setSelectedOperator] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOperator) {
      setError('Debe seleccionar un operador');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onAssign(order.DepotOrderId, selectedOperator);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al asignar operador');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Asignar Operador</h2>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Orden #{order.DepotOrderId}</p>
          <p className="text-sm text-gray-600">Cliente: {order.CustomerName}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Operador
            </label>
            <select
              value={selectedOperator}
              onChange={(e) => setSelectedOperator(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={loading}
            >
              <option value="">Seleccione un operador</option>
              {operators.map((operator) => (
                <option key={operator.id} value={operator.id}>
                  {operator.fullName}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !selectedOperator}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Asignando...' : 'Asignar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
