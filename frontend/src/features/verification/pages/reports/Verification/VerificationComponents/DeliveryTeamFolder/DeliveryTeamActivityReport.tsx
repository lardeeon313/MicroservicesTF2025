import React from "react";
import { AlertTriangle } from "lucide-react";
import { TeamActivityReport } from "../../../../../types/Report";

const DeliveryTeamActivityTable: React.FC<{ data: TeamActivityReport[] }> = ({ data }) => {

    if (!data || data.length === 0) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="flex flex-col items-center">
                <div className="p-3 bg-red-100 rounded-full mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Sin equipos
                </h3>
                <p className="text-gray-600">
                    No se encontraron equipos de reparto para las fechas o filtros seleccionados.
                </p>
            </div>
        </div>
      );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Equipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Total Pedidos
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Entregados
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Incidencias
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Rechazos
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Prom. Tiempo (hs)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            % Éxito
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((team) => (
                    <tr key={team.deliveryTeamId} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            <span className="inline-flex items-center justify-center bg-red-600 text-white rounded-full w-8 h-8 font-bold">
                                {team.deliveryTeamId}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {team.teamName}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {team.totalOrders}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {team.deliveredOrders}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {team.incidentsCount}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {team.rejectionsCount}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {team.averageDeliveryTimeHours}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {team.deliverySuccessRatePercent}%
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    );
};

export default DeliveryTeamActivityTable;
