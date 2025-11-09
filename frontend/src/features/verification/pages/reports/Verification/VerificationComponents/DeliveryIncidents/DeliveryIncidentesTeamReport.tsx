import React from "react";
import { Users } from "lucide-react";
import { DeliveryIncidentReport } from "../../../../../types/Report";
import { AlertTriangle } from "lucide-react";

interface Props {
  data: DeliveryIncidentReport[];
}

export const DeliveryIncidentsTeamTable: React.FC<Props> = ({ data }) => {
    if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="flex flex-col items-center">
          <div className="p-3 bg-green-100 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-gray-600">No se encontraron los demas datos.</p>
        </div>
      </div>
    );
  }
  // Agrupar por ID de equipo para no repetir filas
  const uniqueTeams = Array.from(
    new Map(data.map((d) => [d.deliveryTeamId, d])).values()
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-yellow-50 to-red-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <Users className="w-5 h-5 text-red-800" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Información del Equipo</h2>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID del Equipo</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Equipo</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Zona</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Reportada por el repartidor</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {uniqueTeams.map((team) => (
              <tr key={team.deliveryTeamId} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{team.deliveryTeamId}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{team.deliveryTeamName || "—"}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{team.deliveryZoneName || "—"}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{team.assignedOperatorId || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
