import React from "react";
import { CustomerIncidentReport } from "../../../../../types/Report";

interface Props {
  customer: CustomerIncidentReport | null;
  onClose: () => void;
}

export const OneCustomerIncidentsDetailTable: React.FC<Props> = ({ customer, onClose }) => {
  if (!customer) return null;

  return (
    <div className="mt-10 bg-white rounded-xl shadow-lg border border-gray-200 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-red-800">
          Detalle del cliente: {customer.customerName}
        </h2>
        <button
          onClick={onClose}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
        >
          Cerrar
        </button>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Pedidos</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Rechazos</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Incidentes</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">% Incidencias</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">% Rechazos</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{customer.customerId}</td>
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{customer.totalOrders}</td>
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{customer.totalRejections}</td>
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{customer.totalIncidents}</td>
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{customer.incidentRatePercent}%</td>
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{customer.rejectionRatePercent}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
