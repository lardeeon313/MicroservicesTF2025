import React from "react";
import { ArrowRight, Clock } from "lucide-react";

export type ArmTime = {
  id: number;
  orderId?: number;
  customerName?:string;
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

  // ⭐ NUEVO: Diccionario completo basado en tu enum OrderStatus
  const getStatusName = (status?: number | string) => {
    const map: Record<string, string> = {
      Received: "Recibido",
      ReReceived: "Re-recibido",
      Assigned: "Asignado",
      InPreparation: "En preparación",
      MissingProduct: "Faltante notificado",
      SentToBilling: "Enviado a facturar",
      PendingResolution: "Pendiente de resolución",
      Prepared: "Preparado",
      Invoiced: "Facturado",
      Issued: "Emitido por ventas",
      Cancelled: "Cancelado",
      Deleted: "Eliminado",
      Verify: "Verificado",
      OnTheWay: "En camino",
      Delivered: "Entregado",
      PendingVerification: "Pendiente de verificación",
      AssignedDelivery: "Asignado a reparto",
      PendingDelivered: "Pendiente de reparto",
      PendingIncidentResolution: "Pendiente de incidente",
      IncidentResolved: "Incidente resuelto",
    };

    
    if (typeof status === "string") {
      if (status.includes("→")) {
        const [from, to] = status.split("→").map(s => s.trim());
        return `${map[from] ?? from} → ${map[to] ?? to}`;
      }
      return map[status] ?? status;
    }

    
    const numericMap: Record<number, string> = {
      0: map.Received,
      1: map.ReReceived,
      2: map.Assigned,
      3: map.InPreparation,
      4: map.MissingProduct,
      5: map.SentToBilling,
      6: map.PendingResolution,
      7: map.Prepared,
      8: map.Invoiced,
      9: map.Issued,
      10: map.Cancelled,
      11: map.Deleted,
      12: map.Verify,
      13: map.OnTheWay,
      14: map.Delivered,
      15: map.PendingVerification,
      16: map.AssignedDelivery,
      17: map.PendingDelivered,
      18: map.PendingIncidentResolution,
      19: map.IncidentResolved,
    };

    return status !== undefined ? numericMap[status] ?? `Estado ${status}` : "N/A";
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
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">
                Nº Pedido
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cliente</th>
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
                  <span className="text-sm font-medium text-blue-600">#{item.orderId ?? "?"}</span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-600">{item.customerName}</span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {item.status ? (
                    <span className="text-sm text-gray-900">{getStatusName(item.status)}</span>
                  ) : (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 rounded border bg-gray-100">{getStatusName(item.oldStatus)}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="px-2 py-1 rounded border bg-gray-100">{getStatusName(item.newStatus)}</span>
                    </div>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(item.changedAt)}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{formatDuration(item.averageDuration)}</span>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        item.averageDuration < 30 ? "bg-green-400"
                        : item.averageDuration < 60 ? "bg-yellow-400"
                        : "bg-red-400"
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
