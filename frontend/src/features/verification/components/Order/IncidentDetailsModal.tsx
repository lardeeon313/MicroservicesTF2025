import { X, AlertCircle, Calendar, User, CheckCircle, Clock, XCircle } from 'lucide-react';
import { LogisticOrderDto } from '../../types/OrderTypes';
import { DeliveryIncidentStatusLabels } from '../../constants/DeliveryIncidentStatusLabel';
import formatDate from '../../../../utils/formateDate';

interface Props {
  order: LogisticOrderDto | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function IncidentDetailsModal({ order, isOpen, onClose }: Props) {
  if (!isOpen || !order) return null;

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 0: // Open
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 1: // InProgress
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 2: // Resolved
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 3: // Closed
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0: // Open
        return "bg-red-50 border-red-200";
      case 1: // InProgress
        return "bg-yellow-50 border-yellow-200";
      case 2: // Resolved
        return "bg-green-50 border-green-200";
      case 3: // Closed
        return "bg-gray-50 border-gray-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-orange-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Reporte de Incidentes - Orden L-{order.id}
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
          {order.deliveryIncidents && order.deliveryIncidents.length > 0 ? (
            <div className="space-y-4">
              {order.deliveryIncidents.map((incident, index) => (
                <div key={incident.id} className={`border rounded-lg p-6 ${getStatusColor(incident.deliveryIncidentStatus)}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(incident.deliveryIncidentStatus)}
                      <div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white border">
                          Incidente #{index + 1}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white border ml-2">
                          {DeliveryIncidentStatusLabels[incident.deliveryIncidentStatus]}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(incident.reportedAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>Operador: {incident.reportedByOperatorId.slice(0, 8)}...</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Incidente:</label>
                      <p className="text-sm text-gray-900 font-medium bg-white p-3 rounded border">
                        {incident.incidentType}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estado:</label>
                      <p className="text-sm text-gray-900 font-medium bg-white p-3 rounded border">
                        {DeliveryIncidentStatusLabels[incident.deliveryIncidentStatus]}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción del Incidente:</label>
                    <p className="text-sm text-gray-700 leading-relaxed bg-white p-3 rounded border min-h-[80px]">
                      {incident.description}
                    </p>
                  </div>
                  
                  {incident.resolved && incident.resolutionNote && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nota de Resolución:</label>
                      <p className="text-sm text-gray-700 leading-relaxed bg-white p-3 rounded border min-h-[80px]">
                        {incident.resolutionNote}
                      </p>
                      {incident.resolvedAt && (
                        <p className="text-xs text-gray-500 mt-2">
                          Resuelto el: {formatDate(incident.resolvedAt)}
                        </p>
                      )}
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
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
