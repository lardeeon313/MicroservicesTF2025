import React from "react";
import { AlertTriangle,Users } from "lucide-react";
import { OrderStatusHistoryReport } from "../../../../../types/Report";

interface Props {
  data: OrderStatusHistoryReport[];
}

export const OrderByStatusAssigmentReport: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="flex flex-col items-center">
          <div className="p-3 bg-green-100 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se pudieron obtener los pedidos asignados
          </h3>
          <p className="text-gray-600">
            Se obtuvo un error al buscar los pedidos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Encabezado atractivo */}
      <div className="flex items-center justify-between bg-gradient-to-r from-red-100 to-gray-200 px-6 py-3 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Users className="w-6 h-6 text-red-600" />
          <h2 className="text-lg font-semibold text-gray-800">
            Repartidores vinculados a pedidos: 
          </h2>
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold border-2 border-gray-300 bg-gray-50 text-gray-700">
            Total: {data.length} registros
        </span>
      </div>

      <table className="w-full border-collapse text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Pedido ID</th>
            <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Pedido del Cliente</th>
            <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Repartidor asingado</th>
            <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Equipo Asignado</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 transition-colors duration-200">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.orderId}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{row.customerName}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{row.assignedOperatorId ?? "No especificado"}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{row.assignedTeamName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
