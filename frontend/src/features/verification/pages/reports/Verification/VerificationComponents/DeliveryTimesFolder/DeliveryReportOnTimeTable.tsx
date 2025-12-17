import React from "react";
import { AlertCircle, XCircle, User, MapPin, Calendar } from "lucide-react";
import { DeliveryTimeReportDto } from "../../VerificationHocks/useDeliveryTimesReport";

interface Props {
  data: DeliveryTimeReportDto[];
}

export const DeliveryReportLateTable: React.FC<Props> = ({ data }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  };

  const getDelayColor = (hours?: number) => {
    if (!hours) return "text-red-600";
    if (hours >= 48) return "text-red-700";
    if (hours >= 24) return "text-red-600";
    return "text-orange-600";
  };

  const getDelayBadge = (hours?: number) => {
    if (!hours) return { bg: "bg-red-100", text: "text-red-800", label: "Retrasado" };
    if (hours >= 48) return { bg: "bg-red-200", text: "text-red-900", label: "Crítico" };
    if (hours >= 24) return { bg: "bg-red-100", text: "text-red-800", label: "Grave" };
    return { bg: "bg-orange-100", text: "text-orange-800", label: "Moderado" };
  };

  const totalDelayHours = data.reduce((sum, row) => sum + (row.delayInHours || 0), 0);
  const avgDelay = data.length > 0 ? totalDelayHours / data.length : 0;

  return (
    <div className="w-full bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Pedidos Fuera de Tiempo</h2>
            <p className="text-red-100 text-sm mt-1">Entregas con retraso registrado</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-y border-gray-200">
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">N° Pedido</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Repartidor</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Zona</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Fecha Pactada</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Fecha Entrega</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-red-700 uppercase tracking-wider">Retraso</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-red-700 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <XCircle className="w-8 h-8 mb-2 text-red-500" />
                    <p className="text-lg font-semibold">
                      No se encontraron pedidos fuera de tiempo
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, i) => {
                const badge = getDelayBadge(row.delayInHours);
                const delayColor = getDelayColor(row.delayInHours);

                return (
                  <tr key={i} className="hover:bg-red-50 transition-all duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-900">#{row.orderId ?? "-"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{row.fullNameDeliveringOperator}</span>
                      </div>
                    </td>
                    {/* ... (resto de las celdas de la fila) ... */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="px-3 py-1 inline-flex text-sm font-medium rounded-full bg-indigo-100 text-indigo-800">
                          {row.deliveryZoneName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1 text-gray-900 font-medium">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(row.estimatedDeliveryDate)}
                        </div>
                        <span className="text-xs text-gray-500 ml-5">{formatTime(row.estimatedDeliveryDate)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1 text-gray-900 font-medium">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(row.actualDeliveryDate)}
                        </div>
                        <span className="text-xs text-gray-500 ml-5">{formatTime(row.actualDeliveryDate)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`font-bold text-lg ${delayColor}`}>
                          {row.delayInHours?.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-500">horas</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1.5 inline-flex items-center gap-1.5 text-xs font-semibold rounded-full ${badge.bg} ${badge.text}`}>
                        <XCircle className="w-3.5 h-3.5" />
                        {badge.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};