import React from "react";
import { OperatorProductivityReport } from "../../../../../types/Report";
import { AlertTriangle , PersonStanding} from "lucide-react";

interface Props {
  data: OperatorProductivityReport[];
}

export const OperatorProductivityTable: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="flex flex-col items-center">
          <div className="p-3 bg-green-100 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se pudieron obtener los repartidores 
          </h3>
          <p className="text-gray-600">
            Se obtuvo un error al buscar los repartidores.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

      {/* Encabezado superior bonito */}
<div className="px-6 py-5 border-b bg-gray-50 flex items-center gap-3">
  {/* Ícono decorativo */}
  <div className="p-2 bg-blue-100 rounded-full">
    <PersonStanding className="h-5 w-5 text-blue-600" />
  </div>

  <div className="flex flex-col">
    <h2 className="text-lg font-semibold text-gray-800">
      Reporte de Productividad por Repartidor
    </h2>

    <p className="text-sm text-gray-600">
      Total de repartidores: <span className="font-semibold">{data.length}</span>
    </p>
  </div>
</div>

      <table className="w-full border-collapse text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Repartidor</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total de pedidos</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Entregados</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rechazados</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pendientes</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Asig.Canceladas</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Monto Recaudado</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((op) => (
            <tr key={op.operatorId} className="hover:bg-gray-50 transition-colors duration-200">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{op.fullNameDeliveringOperator}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{op.totalOrders}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{op.deliveredOrders}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{op.rejectedOrders}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{op.pendingOrders}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{op.canceledOrders}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">${op.totalCollectedAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
