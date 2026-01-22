import React from "react";
import { PendingCashVerificationReport } from "../../../../../../verification/types/Report";
import { AlertTriangle,DollarSign } from "lucide-react";

interface Props {
  data: PendingCashVerificationReport[];
}

export const AdminPendingCashVerificationTable: React.FC<Props> = ({ data }) => {

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="flex flex-col items-center">
          <div className="p-3 bg-green-100 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-green-600" />
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Encabezado superior */}
      <div className="px-6 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100/50 flex items-center gap-4">
        <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm">
          <DollarSign className="h-5 w-5 text-white" />
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
            Reporte de Efectivo Pendiente de Verificación
          </h2>

          <p className="text-sm text-gray-600">
            Total de pedidos pendientes:{" "}
            <span className="font-semibold text-blue-600">{data.length}</span>
          </p>
        </div>
      </div>

      <table className="w-full border-collapse text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pedido</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cliente</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Monto total</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha de pedido</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Operador asignado</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Equipo asignado</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.orderId} className="hover:bg-gray-50 transition-colors duration-200">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.orderId}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.customerName}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">${item.totalAmount.toFixed(2)}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {new Date(item.orderDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.fullNameDeliveringOperator}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.assignedTeamName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
