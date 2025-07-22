import { useState } from 'react';
import { assignOperator } from '../services/orderService';
import { AssignOrderRequest } from '../types/OperatorTypes';
import toast from 'react-hot-toast';

interface AssignOrderToOperatorProps {
  orderId: number;
  operators: Array<{ id: string; fullName: string; email: string }>;
  onAssignSuccess?: () => void;
}

export const AssignOrderToOperator = ({ 
  orderId, 
  operators, 
  onAssignSuccess 
}: AssignOrderToOperatorProps) => {
  const [selectedOperatorId, setSelectedOperatorId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOperatorId) {
      toast.error('Por favor selecciona un operador');
      return;
    }

    try {
      setLoading(true);
      const request: AssignOrderRequest = {
        depotOrderId: orderId,
        operatorUserId: selectedOperatorId
      };
      
      console.log('Before assignment - orderId:', orderId);
      await assignOperator(orderId, request);
      console.log('After assignment - orderId:', orderId);
      toast.success('Orden asignada al operador exitosamente');
      setSelectedOperatorId('');
      onAssignSuccess?.();
    } catch (error) {
      console.error('Error assigning order:', error);
      toast.error('Error al asignar la orden al operador');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Asignar Orden D-{orderId} a Operador
      </h3>
      
      <form onSubmit={handleAssign} className="space-y-4">
        <div>
          <label htmlFor="operator" className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar Operador
          </label>
          <select
            id="operator"
            value={selectedOperatorId}
            onChange={(e) => setSelectedOperatorId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            disabled={loading}
          >
            <option value="">Selecciona un operador...</option>
            {operators.map((operator) => (
              <option key={operator.id} value={operator.id}>
                {operator.fullName} ({operator.email})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !selectedOperatorId}
          className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Asignando...' : 'Asignar Orden'}
        </button>
      </form>
    </div>
  );
};
