import React from "react";
import { ArrowRight, Clock } from "lucide-react";

/**
 * Tipo exportado para que la Page / Hook lo use.
 * oldStatus/newStatus son opcionales porque la API puede venir
 * con `status` (string combinado) o con old/new numéricos.
 */
export type ArmTime = {
  id: number;
  orderId?: number;
  oldStatus?: number;
  newStatus?: number;
  status?: string;
  changedAt?: string;
  averageDuration: number;
};

interface Props {
  data: ArmTime[];
  loading: boolean;
}

const AverageTimeOrderTable: React.FC<Props> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <span className="text-gray-500">Cargando...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay datos disponibles</h3>
        <p className="text-gray-600">No se encontraron registros de tiempo promedio para mostrar.</p>
      </div>
    );
  }

  const getStatusName = (status?: number | string) => {
    // Si nos pasan número, mapeamos a nombre; si nos pasan string, devolvemos tal cual.
    if (typeof status === "string") return status;
    const statusMap: Record<number, string> = {
      0: "Issued",
      1: "Received",
      2: "Assigned",
      3: "PendingResolution",
      4: "MissingProduct",
      5: "ReReceived",
      6: "SentToBilling",
    };
    return status !== undefined ? statusMap[status] ?? `Status ${status}` : "N/A";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Tiempo Promedio de Pedidos</h2>
            <p className="text-sm text-gray-600">{data.length} registro{data.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pedido</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Transición de Estado</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha de Cambio</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Duración Promedio
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">#{item.id}</div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-blue-600">#{item.orderId ?? "?"}</div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {/* Si la API devuelve `status` combinado, lo mostramos tal cual.
                      Si viene old/new numérico, mostramos badges separados */}
                  {item.status ? (
                    <div className="text-sm text-gray-900">{item.status}</div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-gray-100">
                        {getStatusName(item.oldStatus)}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-gray-100">
                        {getStatusName(item.newStatus)}
                      </span>
                    </div>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(item.changedAt)}</div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-gray-900">{formatDuration(item.averageDuration)}</div>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        item.averageDuration < 30 ? "bg-green-400" : item.averageDuration < 60 ? "bg-yellow-400" : "bg-red-400"
                      }`}
                    />
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
