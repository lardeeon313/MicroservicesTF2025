import React from "react";
import formatDate from "../../../../../utils/formateDate";
import { Order, OrderStatus } from "../../../types/OrderTypes";
import { OrderStatusBadge } from "../../../../../components/OrderStatusBadge";

type Props = {
  orders: Order[];
};

const ModifiedCanceledOrdersTable: React.FC<Props> = ({ orders }) => {
  const filteredOrders = orders.filter(
    (order) =>
      order.status === OrderStatus.Canceled ||
      order.status === OrderStatus.Issued ||
      order.status === OrderStatus.Pending
  );

  // Estado vacío cuando no hay pedidos filtrados
  if (filteredOrders.length === 0) {
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
              <th className="px-6 py-3 text-left bg-gray-50">N.PEDIDO</th>
              <th className="px-6 py-3 text-left bg-white">CLIENTE</th>
              <th className="px-6 py-3 text-left bg-white">FECHA MODIFICACIÓN</th>
              <th className="px-6 py-3 text-left bg-white">ESTADO</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map(order => (
              <tr
                key={order.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                {/* N° Pedido */}
                <td className="px-6 py-4">
                  <div className="flex items-center min-w-max">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-medium mr-2">
                      #
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        #{order.id}
                      </div>
                      <div className="text-xs text-gray-500">Pedido</div>
                    </div>
                  </div>
                </td>

            {/* Cliente */}
                <td className="px-6 py-4">
                  <div className="flex items-center min-w-max">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                      {order.customerFirstName?.charAt(0).toUpperCase() || "C"}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.customerFirstName} {order.customerLastName}
                      </div>
                      <div className="text-xs text-gray-500">Cliente</div>
                    </div>
                  </div>
                </td>

                {/* Fecha */}
                <td className="px-6 py-4">
                  <div className="flex items-center text-gray-600">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <div className="text-sm text-gray-900">
                        {order.modifiedStatusDate || order.orderDate
                          ? formatDate(order.modifiedStatusDate ?? order.orderDate)
                          : "Desconocido"}
                      </div>
                      <div className="text-xs text-gray-500">Última modificación</div>
                    </div>
                  </div>
                </td>

                {/* Estado */}
                <td className="px-6 py-4 min-w-max">
                  <OrderStatusBadge status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr className="bg-gray-50 border-t border-gray-200">
              <td colSpan={4} className="px-6 py-4">
                <div className="text-sm text-gray-600">
                  Mostrando {filteredOrders.length}{" "}
                  {filteredOrders.length === 1 ? "pedido" : "pedidos"}
                  {filteredOrders.length > 1 && (
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

export default ModifiedCanceledOrdersTable;