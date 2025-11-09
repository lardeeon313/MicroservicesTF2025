// DeliveryTimesTable.tsx
import React from "react";
import { DeliveryTimeReportItem } from "../../../../../types/Report";
import { AlertTriangle } from "lucide-react";

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
                        Sin pedidos
                    </h3>
                    <p className="text-gray-600">
                        No se encontraron pedidos para las fechas o filtros seleccionados.
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
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Zona Id</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Zona</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Operador</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Entregas</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Promedio (hrs)</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Máx (hrs)</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Min (hrs)</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
                <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-sm text-gray-500">
                    No hay datos para los filtros seleccionados.
                </td>
                </tr>
            ) : (
                data.map((row) => (
                <tr key={`${row.deliveryZoneId}-${row.operatorId}`} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {row.deliveryZoneId}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {row.deliveryZoneName}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {row.operatorId}
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
                ))
            )}
            </tbody>
        </table>
        </div>
    );
};

export default DeliveryTimesTable;
