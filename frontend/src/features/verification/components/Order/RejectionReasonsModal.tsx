import { useState, useEffect } from 'react';
import { X, AlertTriangle, Calendar, User, RefreshCw, CheckCircle, Loader2 } from 'lucide-react';
import { LogisticOrderDto, DeliveryRejectionReasonDto } from '../../types/OrderTypes';
import { getRejectionReasonsByOrderId } from '../../services/OrderService';
import { useOperators } from '../../hooks/useOperators';
import { AssignOperatorModal } from './AssignOperatorModal';
import formatDate from '../../../../utils/formateDate';
import toast from 'react-hot-toast';

interface Props {
  order: LogisticOrderDto | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RejectionReasonsModal({ order, isOpen, onClose }: Props) {
  const [rejectionReasons, setRejectionReasons] = useState<DeliveryRejectionReasonDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  
  const { operators, fetchOperators } = useOperators();

  useEffect(() => {
    if (isOpen && order) {
      fetchRejectionReasons();
      fetchOperators();
    }
  }, [isOpen, order]);

  const fetchRejectionReasons = async () => {
    if (!order) return;
    
    setLoading(true);
    try {
      const data = await getRejectionReasonsByOrderId(order.id);
      setRejectionReasons(data);
    } catch (error: any) {
      toast.error('Error al cargar los motivos de rechazo');
      console.error('Error fetching rejection reasons:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !order) return null;

  const handleReassign = async () => {
    if (!order) return;
    setShowAssignModal(true);
  };

  const handleAssignSuccess = () => {
    setShowAssignModal(false);
    onClose();
  };

  const handleAssignClose = () => {
    setShowAssignModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  Motivos de Cancelación
                </h2>
                <p className="text-sm text-white/90 mt-1">
                  Orden L-{order.id} • Cliente: {order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : 'N/A'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Cargando motivos de rechazo...</h3>
            </div>
          ) : rejectionReasons && rejectionReasons.length > 0 ? (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-xl p-6 shadow-md">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  <div>
                    <h3 className="text-lg font-bold text-yellow-800">
                      Esta orden fue cancelada por el operador asignado
                    </h3>
                    <p className="text-sm text-yellow-700 mt-1 font-medium">
                      Puedes revisar los motivos de cancelación y reasignar la orden a otro operador.
                    </p>
                  </div>
                </div>
              </div>

              {rejectionReasons.map((reason, index) => (
                <div key={reason.id} className="border-l-4 border-red-500 bg-red-50 rounded-xl p-6 shadow-lg">
                  {/* Header del Rechazo */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-300/50">
                    <div className="flex items-center space-x-4">
                      <div className="bg-white p-3 rounded-xl shadow-md">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Cancelación #{index + 1}
                        </h3>
                        <p className="text-xs font-medium text-gray-500 mt-1">
                          ID: {reason.id}
                        </p>
                      </div>
                    </div>
                    <div className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-bold bg-red-600 text-white shadow-md uppercase tracking-wide">
                      Rechazado
                    </div>
                  </div>
                  
                  {/* Grid de Información */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border-2 shadow-sm">
                      <label className="flex items-center space-x-2 text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>Fecha de Cancelación</span>
                      </label>
                      <p className="text-base font-semibold text-gray-900">
                        {formatDate(reason.rejectedAt)}
                      </p>
                    </div>
                    
                    <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border-2 shadow-sm">
                      <label className="flex items-center space-x-2 text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
                        <User className="w-4 h-4" />
                        <span>Operador que Canceló</span>
                      </label>
                      <p className="text-base font-semibold text-gray-900 font-mono">
                        {typeof reason.deliveryOperatorId === 'string' ? reason.deliveryOperatorId.slice(0, 8) + '...' : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Motivo de Cancelación */}
                  <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border-2 shadow-sm">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
                      Motivo de Cancelación
                    </label>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap font-medium">
                        {reason.reason}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Botón de reasignación */}
              <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 border-2 border-green-300 rounded-xl p-6 mt-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white p-4 rounded-xl shadow-md">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-green-800">
                        Reasignar Orden
                      </h3>
                      <p className="text-sm text-green-700 mt-1 font-medium">
                        Puedes reasignar esta orden a otro operador para continuar con la entrega.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleReassign}
                    className="flex items-center space-x-2 px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-xl font-bold text-base"
                  >
                    <RefreshCw className="w-6 h-6" />
                    <span>Seleccionar Operador</span>
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
            className="px-8 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl font-semibold"
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* Modal de asignación */}
      {order && (
        <AssignOperatorModal
          isOpen={showAssignModal}
          onClose={handleAssignClose}
          orderId={order.id}
          operators={operators}
          onSuccess={handleAssignSuccess}
        />
      )}
    </div>
  );
}