import React from "react";
import { ModifiedCanceledOrder } from "../Types/ModifiedCanceledReportType";
import { ModifiedCanceledOrderStatusBadge } from "../Types/ModifiedCanceledOrdersBadge";

type Props = {
  orders: ModifiedCanceledOrder[];
};

export const AdminModifiedCanceledOrdersTable: React.FC<Props> = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-600 text-lg">No hay pedidos cancelados o modificados</p>
        <p className="text-gray-400 text-sm mt-2">Los pedidos con estado cancelado, emitido o pendiente aparecerán aquí</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Pedido
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Cliente
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Fecha
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Estado
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white">
          {orders.map((order) => (
            <tr key={order.orderId} className="hover:bg-gray-50">
              {/* Pedido */}
              <td className="px-6 py-4 text-sm font-medium text-gray-800">
                #{order.orderId}
              </td>

              {/* Cliente */}
              <td className="px-6 py-4 text-sm text-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-semibold">
                    {order.customerFullName?.charAt(0).toUpperCase() || "C"}
                  </div>
                  <span>{order.customerFullName}</span>
                </div>
              </td>

              {/* Fecha */}
              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(
                  order.modifiedDate ?? order.orderDate
                ).toLocaleDateString()}
              </td>

              {/* Estado */}
              <td className="px-6 py-4">
                <ModifiedCanceledOrderStatusBadge status={order.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};