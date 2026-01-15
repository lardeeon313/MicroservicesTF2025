import React from "react";
import { ModifiedCanceledOrder } from "../../../../admin/pages/AdminDashboardFeatures/ReportsSales/Types/ModifiedCanceledReportType";
import { ModifiedCanceledOrderStatusBadge } from "../../../../admin/pages/AdminDashboardFeatures/ReportsSales/Types/ModifiedCanceledOrdersBadge";

type Props = {
  orders: ModifiedCanceledOrder[];
};

export const ModifiedCanceledOrdersTable: React.FC<Props> = ({ orders }) => {
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
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <thead>
            <tr className="text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">
              <th className="px-6 py-3 text-left bg-gray-50">
                N.PEDIDO
              </th>
              <th className="px-6 py-3 text-left bg-white">
                CLIENTE
              </th>
              <th className="px-6 py-3 text-left bg-white">
                FECHA MODIFICACION
              </th>
              <th className="px-6 py-3 text-left bg-white">
                ESTADO
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                {/* N° Pedido */}
                <td className="px-6 py-4">
                  <div className="flex items-center min-w-max">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-medium mr-2">
                      #
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        #{order.orderId}
                      </div>
                      <div className="text-xs text-gray-500">Pedido</div>
                    </div>
                  </div>
                </td>

                {/* Cliente */}
                <td className="px-6 py-4">
                  <div className="flex items-center min-w-max">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                      {order.customerFullName?.charAt(0).toUpperCase() || "C"}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.customerFullName}
                      </div>
                      <div className="text-xs text-gray-500">Cliente</div>
                    </div>
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

          <tfoot>
            <tr className="bg-gray-50 border-t border-gray-200">
              <td colSpan={4} className="px-6 py-4">
                <div className="text-sm text-gray-600">
                  Mostrando {orders.length}{" "}
                  {orders.length === 1 ? "pedido" : "pedidos"}
                  {orders.length > 1 && (
                    <span className="ml-2 text-xs">
                      • Cancelados, emitidos o pendientes
                    </span>
                  )}
                </div>
              </td>
            </tr>
          </tfoot>
      </table>
      </div>
    </div>
  );
};