// DeliveryReportOnTimeTable.tsx
import React from "react";
import { DeliveryTimeReportDto } from "../../VerificationHocks/useDeliveryTimesReport";
import { AlertCircle, CheckCircle,User,MapPin,Calendar } from "lucide-react";

interface Props {
  data: DeliveryTimeReportDto[];
}

export const DeliveryReportOnTimeTable: React.FC<Props> = ({ data }) => {
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

  const calculateAdvanceTime = (estimated?: string, actual?: string) => {
    if (!estimated || !actual) return 0;
    const diff = new Date(estimated).getTime() - new Date(actual).getTime();
    return Math.max(0, diff / (1000 * 60 * 60)); // horas de anticipación
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="flex flex-col items-center">
          <div className="p-3 bg-green-100 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Sin pedidos a tiempo
          </h3>
          <p className="text-gray-600">
            No se encontraron pedidos entregados a tiempo para los filtros seleccionados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Pedidos Entregados a Tiempo</h2>
            <p className="text-green-100 text-sm mt-1">Entregas exitosas dentro del plazo</p>
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
              <th className="px-6 py-4 text-center text-xs font-bold text-green-700 uppercase tracking-wider">Anticipación</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-green-700 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, i) => {
              const advanceTime = calculateAdvanceTime(row.estimatedDeliveryDate, row.actualDeliveryDate);
              
              return (
                <tr key={i} className="hover:bg-green-50 transition-all duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-gray-900">#{row.orderId ?? "-"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{row.fullNameDeliveringOperator}</span>
                    </div>
                  </td>
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
                      <span className="font-bold text-lg text-green-600">
                        {advanceTime > 0 ? advanceTime.toFixed(1) : "0.0"}
                      </span>
                      <span className="text-xs text-gray-500">horas antes</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1.5 inline-flex items-center gap-1.5 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      <CheckCircle className="w-3.5 h-3.5" />
                      A tiempo
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};