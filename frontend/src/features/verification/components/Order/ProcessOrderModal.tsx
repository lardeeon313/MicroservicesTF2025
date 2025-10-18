import { useState } from 'react';
import { useOrderOperations } from '../../hooks/useOrders';
import { DeliveryPriority } from '../../types/OrderTypes';
import { DeliveryPriorityLabels } from '../../constants/PriorityOrderLabel';
import { normalizePaymentType } from '../../utils/normalize';
import toast from 'react-hot-toast';

interface ProcessOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  currentPriority?: DeliveryPriority;
  paymentType?: string;
  onSuccess?: () => void;
}

export const ProcessOrderModal = ({ 
  isOpen, 
  onClose, 
  orderId, 
  currentPriority, 
  paymentType,
  onSuccess 
}: ProcessOrderModalProps) => {
  const [selectedPriority, setSelectedPriority] = useState<DeliveryPriority>(
    currentPriority || DeliveryPriority.Medium
  );
  const { setOrderPriority, verifyOrderAction, loading } = useOrderOperations();

  const handleProcessOrder = async () => {
    try {
      // 1. Establecer prioridad
      const priorityRequest = {
        logisticOrderId: orderId,
        deliveryPriority: selectedPriority
      };
      
      const prioritySuccess = await setOrderPriority(priorityRequest);
      
      if (!prioritySuccess) {
        toast.error('Error al establecer la prioridad');
        return;
      }

      toast.success('Prioridad establecida correctamente');

      // 2. Verificar la orden (estado pasa a Verificado)
      const verifySuccess = await verifyOrderAction(orderId);
      if (verifySuccess) {
        toast.success('Orden verificada correctamente');
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1000);
      } else {
        toast.error('Error al verificar la orden');
      }
    } catch (error) {
      toast.error('Error al procesar la orden');
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Procesar Orden L-{orderId}
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prioridad de Entrega
            </label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(Number(e.target.value) as DeliveryPriority)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              disabled={loading}
            >
              <option value={DeliveryPriority.Low}>{DeliveryPriorityLabels[DeliveryPriority.Low]}</option>
              <option value={DeliveryPriority.Medium}>{DeliveryPriorityLabels[DeliveryPriority.Medium]}</option>
              <option value={DeliveryPriority.High}>{DeliveryPriorityLabels[DeliveryPriority.High]}</option>
            </select>
          </div>

          {/* La asignación de operador se realiza posteriormente cuando la orden está Verificada */}

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 mb-2">
              <strong>Orden:</strong> L-{orderId}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Prioridad:</strong> {DeliveryPriorityLabels[selectedPriority]}
            </p>
            <p className="text-gray-700">
              <strong>Tipo de Pago:</strong> {normalizePaymentType(paymentType) || 'No especificado'}
            </p>
          </div>

          <p className="text-gray-600 text-sm">
            Al verificar esta orden se establecerá la prioridad y el estado cambiará a "Verificado".
          </p>

          <div className="flex justify-end space-x-4">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={handleProcessOrder}
              disabled={loading}
              className={`px-6 py-2 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                paymentType === 'Efectivo' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loading ? 'Procesando...' : 'Verificar y Establecer Prioridad'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
