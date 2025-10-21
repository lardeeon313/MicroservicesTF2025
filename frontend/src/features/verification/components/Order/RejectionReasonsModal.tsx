import { useState } from 'react';
import { X, AlertTriangle, Calendar, User, RefreshCw, CheckCircle } from 'lucide-react';
import { LogisticOrderDto, DeliveryRejectionReasonDto } from '../../types/OrderTypes';
import formatDate from '../../../../utils/formateDate';
import toast from 'react-hot-toast';

interface Props {
  order: LogisticOrderDto | null;
  isOpen: boolean;
  onClose: () => void;
  onReassign?: (orderId: number) => Promise<boolean>;
}

export default function RejectionReasonsModal({ order, isOpen, onClose, onReassign }: Props) {
  const [isReassigning, setIsReassigning] = useState(false);

  if (!isOpen || !order) return null;

  const handleReassign = async () => {
    if (!onReassign || !order) return;
    
    setIsReassigning(true);
    try {
      const success = await onReassign(order.id);
      if (success) {
        toast.success('Orden reasignada correctamente');
        onClose();
      } else {
        toast.error('Error al reasignar la orden');
      }
    } catch (error) {
      toast.error('Error al reasignar la orden');
    } finally {
      setIsReassigning(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Motivos de Cancelación - Orden L-{order.id}
              </h2>
              <p className="text-sm text-gray-500">
                Cliente: {order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : 'N/A'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {order.rejectionReasons && order.rejectionReasons.length > 0 ? (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <h3 className="text-lg font-medium text-yellow-800">
                    Esta orden fue cancelada por el operador asignado
                  </h3>
                </div>
                <p className="text-sm text-yellow-700 mt-2">
                  Puedes revisar los motivos de cancelación y reasignar la orden a otro operador.
                </p>
              </div>

              {order.rejectionReasons.map((reason, index) => (
                <div key={reason.id} className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white border">
                        Cancelación #{index + 1}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(reason.rejectedAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>Operador: {reason.deliveryOperatorId.slice(0, 8)}...</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Motivo de Cancelación:</label>
                    <p className="text-sm text-gray-700 leading-relaxed bg-white p-3 rounded border min-h-[80px]">
                      {reason.reason}
                    </p>
                  </div>
                </div>
              ))}

              {/* Botón de reasignación */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <h3 className="text-lg font-medium text-green-800">
                        Reasignar Orden
                      </h3>
                      <p className="text-sm text-green-700">
                        Esta orden puede ser reasignada a otro operador para continuar con la entrega.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleReassign}
                    disabled={isReassigning}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <RefreshCw className={`w-4 h-4 ${isReassigning ? 'animate-spin' : ''}`} />
                    <span>{isReassigning ? 'Reasignando...' : 'Reasignar Orden'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Hay Motivos de Cancelación</h3>
              <p className="text-gray-500">
                Esta orden no tiene motivos de cancelación registrados.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
