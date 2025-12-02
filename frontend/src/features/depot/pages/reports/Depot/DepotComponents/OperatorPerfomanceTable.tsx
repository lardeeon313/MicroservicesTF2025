import React from "react";
import { DepotTeamPerformanceDto } from "../DepotHocks/useTeamProdictivity";
import { AlertTriangle } from "lucide-react";

interface Props {
  data: DepotTeamPerformanceDto[];
}

export const OperatorPerformanceTable: React.FC<Props> = ({ data }) => {
  const ops = data.filter((x) => !x.isTeam);

    if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="flex flex-col items-center">
          <div className="p-3 bg-green-100 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sin operarios</h3>
          <p className="text-gray-600">No hay datos de los operarios para los filtros selecciados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md mt-10 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50">
        <h2 className="text-xl font-bold text-gray-700">Rendimiento por Operario</h2>
        <p className="text-sm text-gray-500">Detalle individual de productividad</p>
      </div>

      <table className="w-full">
        <thead className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wide">
          <tr>
            <th className="p-4 text-left">Operario</th>
            <th className="p-4 text-center">Pedidos Armados</th>
            <th className="p-4 text-center">Faltantes</th>
          </tr>
        </thead>

        <tbody>
          {ops.map((o) => (
            <tr
              key={o.operatorId}
              className="hover:bg-gray-50 transition cursor-pointer"
            >
              <td className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                  {o.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800">{o.name}</span>
                  <span className="text-xs text-gray-500">Operario</span>
                </div>
              </td>

              <td className="p-4 text-center text-sm font-semibold text-gray-800">
                {o.ordersHandled}
              </td>

              <td className="p-4 text-center">
                <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700 font-semibold">
                  {o.missingItemsReported}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
