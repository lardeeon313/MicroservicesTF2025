import React from "react";
import { ZonePerformanceReport } from "../../../../../types/Report";
import { Award } from "lucide-react";
import { AlertTriangle } from "lucide-react";

interface Props {
  data: ZonePerformanceReport[];
}

export const ZonePerfomanceTeamTable: React.FC<Props> = ({ data }) => {
      if (!data || data.length === 0) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="flex flex-col items-center">
            <div className="p-3 bg-red-100 rounded-full mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se pudieron obtener los pedidos 
            </h3>
            <p className="text-gray-600">
              Se obtuvo un error al buscar los pedidos.
            </p>
          </div>
        </div>
      );
    }
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white py-4 px-6 flex items-center gap-3">
        <Award className="w-6 h-6" />
        <h2 className="text-lg font-semibold">Equipos destacados por zona</h2>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID Team</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Equipo Top</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Zona</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Promedio de Horas</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Incidentes (%)</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rechazos (%)</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((zone) => (
            <tr key={zone.topTeamId} className="hover:bg-gray-50 transition-colors duration-200">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{zone.topTeamId}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{zone.topTeamName}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{zone.deliveryZoneName || "—"}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{zone.averageDeliveryTimeHours}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{zone.incidentRatePercent}%</td>
              <td className="px-6 py-4 text-sm text-gray-900">{zone.rejectionRatePercent}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
