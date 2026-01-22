import React from "react";

import { ZonePerformanceReport } from "../../../../../../verification/types/Report";
import { BarChart3 } from "lucide-react";
import { AlertTriangle } from "lucide-react";

interface Props {
  data: ZonePerformanceReport[];
}

export const AdminZonePerformanceTable: React.FC<Props> = ({ data }) => {
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
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 flex items-center gap-3">
        <BarChart3 className="w-6 h-6" />
        <h2 className="text-lg font-semibold">Eficiencia general por zona</h2>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Numero de Zona</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Zona</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Órdenes Totales</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Órdenes Entregadas</th> 
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Órdenes con incidentes</th>
            
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((zone) => (
            <tr key={zone.deliveryZoneId} className="hover:bg-gray-50 transition-colors duration-200">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{zone.deliveryZoneId}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{zone.deliveryZoneName || "Sin nombre"}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{zone.totalOrders}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{zone.deliveredOrders}</td>
              
              <td className="px-6 py-4 text-sm text-gray-900">{zone.incidentsCount}</td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
