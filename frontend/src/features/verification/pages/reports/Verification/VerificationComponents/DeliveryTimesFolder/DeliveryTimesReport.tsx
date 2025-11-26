// DeliveryTimesTable.tsx
import React from "react";
import { DeliveryTimeReportItem } from "../../../../../types/Report";
import { AlertTriangle, Clock } from "lucide-react";

interface Props {
  data: DeliveryTimeReportItem[];
}

export const DeliveryTimesTable: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="flex flex-col items-center">
          <div className="p-3 bg-red-100 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Sin resultados
          </h3>
          <p className="text-gray-600">
            No se encontraron resultados para las fechas o filtros seleccionados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Encabezado superior */}
      <div className="px-6 py-5 border-b bg-gray-50 flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-full">
          <Clock className="h-5 w-5 text-blue-600" />
        </div>

        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-gray-800">
            Reporte de Tiempos de Entrega por Zona
          </h2>

          <p className="text-sm text-gray-600">
            Total de registros:{" "}
            <span className="font-semibold">{data.length}</span>
          </p>
        </div>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Numero de zona
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Zona
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Numero de equipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Equipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Repartidor
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Total Entregas
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Promedio (hrs)
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Máx (hrs)
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Min (hrs)
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr
              key={`${row.deliveryZoneId}-${row.operatorId}`}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {row.deliveryZoneId}
              </td>

              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {row.deliveryZoneName}
              </td>

              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {row.teamId}
              </td>

              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {row.teamName}
              </td>

              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {row.fullNameDeliveringOperator}
              </td>

              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {row.totalDeliveredOrders}
              </td>

              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {row.averageDeliveryTimeInHours?.toFixed(2)}
              </td>

              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {row.maxDeliveryTimeInHours?.toFixed(2)}
              </td>

              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {row.minDeliveryTimeInHours?.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryTimesTable;
