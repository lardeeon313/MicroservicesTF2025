import React from "react";
import { AlertTriangle } from "lucide-react";
import { DeliveryIncidentReport } from "../../../../../types/Report";

interface Props {
  data: DeliveryIncidentReport[];
}

/*const incidentStatusToSpanish: Record<string, string> = {
  Pending: "Pendiente",
  Resolved: "Resuelto",
  Delivered: "Entregado",
};*/

export const DeliveryIncidentsTable: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="flex flex-col items-center">
          <div className="p-3 bg-green-100 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            ¡Sin incidentes!
          </h3>
          <p className="text-gray-600">No se registraron incidentes.</p>
        </div>
      </div>
    );
  }
  

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-red-50 to-orange-50 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Reporte de Incidentes</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Numero del pedido</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Cliente</th>
              
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Descripción del incidente</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Fecha del reporte</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Fecha de resolucion</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nota de resolucion</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">
                ¿Fue resuelto?
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Repartidor</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.logisticOrderId}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{item.customerName}</td>

                <td className="px-6 py-4 text-sm text-gray-700">{item.description}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {new Date(item.reportedAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {item.resolvedAt ? new Date(item.resolvedAt).toLocaleString() : "—"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{item.resolutionNote || "—"}</td>
                <td className="px-6 py-4 text-center">
                  {item.resolvedAt && item.resolutionNote?.trim() !== "" ? "✅" : "❌"}
                </td>
                <td className="px-6 py-4 text-center">
                  {item.fullNameReportedByOperator}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
