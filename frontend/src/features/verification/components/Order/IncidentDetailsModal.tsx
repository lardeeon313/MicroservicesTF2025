import { useState, useEffect } from 'react';
import { X, AlertCircle, Calendar, User, CheckCircle, Loader2 } from 'lucide-react';
import { LogisticOrderDto, DeliveryIncidentDto, DeliveryIncidentStatus } from '../../types/OrderTypes';
import { DeliveryIncidentStatusLabels } from '../../constants/DeliveryIncidentStatusLabel';
import { getDeliveryIncidentsByOrderId } from '../../services/OrderService';
import formatDate from '../../../../utils/formateDate';
import toast from 'react-hot-toast';

interface Props {
  order: LogisticOrderDto | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function IncidentDetailsModal({ order, isOpen, onClose }: Props) {
  const [incidents, setIncidents] = useState<DeliveryIncidentDto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && order) {
      fetchIncidents();
    }
  }, [isOpen, order]);

  const fetchIncidents = async () => {
    if (!order) return;
    
    setLoading(true);
    try {
      const data = await getDeliveryIncidentsByOrderId(order.id);
      setIncidents(data);
    } catch (error: any) {
      toast.error('Error al cargar los incidentes');
      console.error('Error fetching incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !order) return null;

  const getStatusIcon = (status: DeliveryIncidentStatus) => {
    switch (status) {
      case DeliveryIncidentStatus.Pending:
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case DeliveryIncidentStatus.Resolved:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case DeliveryIncidentStatus.Delivered:
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: DeliveryIncidentStatus) => {
    switch (status) {
      case DeliveryIncidentStatus.Pending:
        return "bg-red-50 border-red-300";
      case DeliveryIncidentStatus.Resolved:
        return "bg-green-50 border-green-300";
      case DeliveryIncidentStatus.Delivered:
        return "bg-blue-50 border-blue-300";
      default:
        return "bg-gray-50 border-gray-300";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  Reporte de Incidentes
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Cargando incidentes...</h3>
            </div>
          ) : incidents && incidents.length > 0 ? (
            <div className="space-y-6">
              {incidents.map((incident, index) => (
                <div key={incident.id} className={`border-l-4 rounded-xl p-6 shadow-lg ${getStatusColor(incident.deliveryIncidentStatus)}`}>
                  {/* Header del Incidente */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-300/50">
                    <div className="flex items-center space-x-4">
                      <div className="bg-white p-3 rounded-xl shadow-md">
                        {getStatusIcon(incident.deliveryIncidentStatus)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Incidente #{index + 1}
                        </h3>
                        <p className="text-xs font-medium text-gray-500 mt-1">
                          ID: {incident.id}
                        </p>
                      </div>
                    </div>
                    <div className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-bold bg-white shadow-md border-2 uppercase tracking-wide">
                      {DeliveryIncidentStatusLabels[incident.deliveryIncidentStatus]}
                    </div>
                  </div>
                  
                  {/* Grid de Información */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border-2 shadow-sm">
                      <label className="flex items-center space-x-2 text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>Fecha del Reporte</span>
                      </label>
                      <p className="text-base font-semibold text-gray-900">
                        {formatDate(incident.reportedAt)}
                      </p>
                    </div>
                    
                    <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border-2 shadow-sm">
                      <label className="flex items-center space-x-2 text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
                        <User className="w-4 h-4" />
                        <span>Operador Reportante</span>
                      </label>
                      <p className="text-base font-semibold text-gray-900 font-mono">
                        {typeof incident.reportedByOperatorId === 'string' ? incident.reportedByOperatorId.slice(0, 8) + '...' : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Tipo de Incidente */}
                  <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border-2 shadow-sm mb-6">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
                      Tipo de Incidente
                    </label>
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg border border-orange-300">
                      <p className="text-sm font-bold text-gray-900 capitalize">
                        {incident.incidentType}
                      </p>
                    </div>
                  </div>
                  
                  {/* Descripción */}
                  <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border-2 shadow-sm mb-6">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
                      Descripción del Incidente
                    </label>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {incident.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Nota de Resolución */}
                  {incident.resolved ? (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border-2 border-green-300 shadow-md">
                      <div className="flex items-center space-x-3 mb-3">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <label className="text-xs font-bold text-green-800 uppercase tracking-wider">
                          Nota de Resolución
                        </label>
                      </div>
                      {incident.resolutionNote ? (
                        <div className="bg-white p-4 rounded-lg border border-green-200">
                          <p className="text-sm text-green-900 leading-relaxed whitespace-pre-wrap font-medium">
                            {incident.resolutionNote}
                          </p>
                          {incident.resolvedAt && (
                            <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-green-200">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <p className="text-xs font-bold text-green-700 uppercase tracking-wide">
                                Resuelto el: {formatDate(incident.resolvedAt)}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-green-700 italic font-medium">
                          Sin nota de resolución registrada.
                        </p>
                      )}
                    </div>
                  ) : incident.resolutionNote && (
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-5 rounded-xl border-2 border-yellow-300 shadow-md">
                      <div className="flex items-center space-x-3 mb-3">
                        <AlertCircle className="w-6 h-6 text-yellow-600" />
                        <label className="text-xs font-bold text-yellow-800 uppercase tracking-wider">
                          Nota de Resolución (Pendiente de Confirmación)
                        </label>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-yellow-200">
                        <p className="text-sm text-yellow-900 leading-relaxed whitespace-pre-wrap font-medium">
                          {incident.resolutionNote}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {!incident.resolved && !incident.resolutionNote && (
                    <div className="bg-gray-100 p-5 rounded-xl border-2 border-gray-300 shadow-sm">
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="w-5 h-5 text-gray-500" />
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Estado: Pendiente de Resolución
                        </label>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 ml-8">
                        Este incidente aún no ha sido resuelto.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Hay Incidentes Reportados</h3>
              <p className="text-gray-500">
                Esta orden no tiene incidentes reportados actualmente.
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
    </div>
  );
}