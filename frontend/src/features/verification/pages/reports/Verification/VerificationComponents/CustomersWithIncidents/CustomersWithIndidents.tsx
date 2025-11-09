// CustomersWithIncidentsComponent.tsx
import React from "react";
import { CustomerIncidentReport } from "../../../../../types/Report";
import { AlertTriangle } from "lucide-react";

interface Props {
  data: CustomerIncidentReport[];
  isLoading: boolean;
  error?: string;
  onSelectCustomer?: (customerId: string) => void; // 👈 nueva prop
}

export const CustomersWithIncidentsComponent: React.FC<Props> = ({ data, onSelectCustomer }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="flex flex-col items-center">
          <div className="p-3 bg-red-100 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sin Clientes</h3>
          <p className="text-gray-600">
            No se encontraron clientes con incidentes para las fechas o filtros seleccionados.
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
              Cliente
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Total Pedidos
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Total Rechazos
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Total Incidentes
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              % Incidencias
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              % Rechazos
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr
              key={item.customerId}
              onClick={() => onSelectCustomer?.(item.customerId)} // 👈 cuando clickeas, avisa al padre
              className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
            >
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center bg-red-600 text-white rounded-full w-8 h-8 font-bold text-xs flex-shrink-0">
                    {item.customerName.split(" ").map(word => word[0]).join("").toUpperCase().slice(0, 2)}
                  </span>
                  <span>{item.customerName}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.totalOrders}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.totalRejections}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.totalIncidents}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.incidentRatePercent}%</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.rejectionRatePercent}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
