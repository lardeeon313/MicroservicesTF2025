import { useState } from 'react';
import { useOrderOperations } from '../../hooks/useOrders';
import { AssignOperatorRequest } from '../../types/OrderTypes';
import { OperatorDto } from '../../types/OperatorTypes';
import toast from 'react-hot-toast';

interface AssignOperatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  operators: OperatorDto[];
  onSuccess?: () => void;
}

export const AssignOperatorModal = ({ 
  isOpen, 
  onClose, 
  orderId, 
  operators,
  onSuccess 
}: AssignOperatorModalProps) => {
  const [selectedOperatorId, setSelectedOperatorId] = useState<string>('');
  const { assignOperatorToOrder, loading } = useOrderOperations();

  const handleAssign = async () => {
    if (!selectedOperatorId) {
      toast.error('Por favor selecciona un operador');
      return;
    }

    const request: AssignOperatorRequest = {
      logisticOrderId: orderId,
      operatorUserId: selectedOperatorId
    };
    
    const success = await assignOperatorToOrder(request);
    
    if (success) {
      toast.success('Orden asignada al operador exitosamente');
      setSelectedOperatorId('');
      onSuccess?.();
      onClose();
    } else {
      toast.error('Error al asignar la orden al operador');
    }
  };

  const handleClose = () => {
    setSelectedOperatorId('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Asignar Operador a Orden L-{orderId}
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Operador
            </label>
            <select
              value={selectedOperatorId}
              onChange={(e) => setSelectedOperatorId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="">Selecciona un operador...</option>
              {operators.length === 0 ? (
                <option value="" disabled>No hay operadores disponibles</option>
              ) : (
                operators.map((operator) => (
                  <option key={operator.id} value={operator.id}>
                    {operator.fullName} ({operator.email})
                  </option>
                ))
              )}
            </select>
            {operators.length === 0 && (
              <p className="text-sm text-red-600 mt-2">
                No hay operadores disponibles. Verifica que el servicio esté funcionando.
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={handleAssign}
              disabled={loading || !selectedOperatorId}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Asignando...' : 'Asignar Operador'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
