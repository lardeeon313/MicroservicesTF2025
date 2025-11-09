// components/OrdersByStatusTable.tsx
import React from "react";
import { OrdersByStatusDtoReport } from "../../../../../types/Report";
import { AlertTriangle } from "lucide-react";
import { STATUS_TRANSLATIONS } from "../../../../../types/Report";

interface Props {
  data: OrdersByStatusDtoReport[];
}

export const translateStatus = (status: string) =>
  STATUS_TRANSLATIONS[status] ?? status;

export const OrdersByStatusTable: React.FC<Props> = ({ data }) => {
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
      <table className="w-full border-collapse text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cantidad</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50 transition-colors duration-200">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {translateStatus(row.status)}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {row.count}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
