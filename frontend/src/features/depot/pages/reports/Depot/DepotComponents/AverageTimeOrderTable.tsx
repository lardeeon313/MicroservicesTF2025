import React from "react";
import { Clock, ArrowRight } from "lucide-react";

export type ArmTime = {
  id: number;
  orderId: number;
  oldStatus: number;
  newStatus: number;
  changedAt: string;
  averageDuration: number;
};

type Props = {
  armTime: ArmTime[];
};

const AverageTimeOrderTable: React.FC<Props> = ({ armTime }) => {
  // Función para convertir minutos a formato legible
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${Math.round(minutes)}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  // Función para obtener el color del estado
  const getStatusColor = (status: number) => {
    const colors = {
      1: "bg-gray-100 text-gray-700 border-gray-200",
      2: "bg-blue-100 text-blue-700 border-blue-200",
      3: "bg-yellow-100 text-yellow-700 border-yellow-200",
      4: "bg-green-100 text-green-700 border-green-200",
      5: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  // Función para obtener el nombre del estado
  const getStatusName = (status: number) => {
    const names = {
      1: "Creado",
      2: "En Proceso",
      3: "Preparando",
      4: "Completado",
      5: "Cancelado",
    };
    return names[status as keyof typeof names] || `Estado ${status}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (!armTime || armTime.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay datos disponibles</h3>
        <p className="text-gray-600">No se encontraron registros de tiempo promedio para mostrar.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Tiempo Promedio de Pedidos</h2>
            <p className="text-sm text-gray-600">{armTime.length} registro{armTime.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Pedido
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Transición de Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Fecha de Cambio
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Duración Promedio
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {armTime.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">#{item.id}</div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-blue-600">#{item.orderId}</div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.oldStatus)}`}>
                      {getStatusName(item.oldStatus)}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.newStatus)}`}>
                      {getStatusName(item.newStatus)}
                    </span>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDate(item.changedAt)}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <div className="text-sm font-medium text-gray-900">
                      {formatDuration(item.averageDuration)}
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      item.averageDuration < 30 ? 'bg-green-400' :
                      item.averageDuration < 60 ? 'bg-yellow-400' : 'bg-red-400'
                    }`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AverageTimeOrderTable;