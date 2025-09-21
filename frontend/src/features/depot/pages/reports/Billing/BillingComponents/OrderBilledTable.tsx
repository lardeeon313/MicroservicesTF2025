import { File } from "lucide-react";
import type { DepotOrderDtoBilling } from "../BillingHocks/useOrderBilled";
import EmptyState from "../../../../../../components/EmptyState";

type Props = {
  data: DepotOrderDtoBilling[];
};

export default function InvoicedOrdersTable({ data }: Props) {
  if (data.length === 0) {
    return (
      <EmptyState
        icon={File}
        title="No hay pedidos facturados"
        description="No se encontraron pedidos facturados para los filtros seleccionados."        
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="bg-gradient-to-r from-red-50 via-red-100 to-red-50 rounded-xl p-6 border border-red-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Pedidos Facturados</h3>
            <p className="text-gray-600 text-sm mt-1">Resumen de órdenes procesadas</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600 mb-1">Total de pedidos</p>
            <div className="flex items-center justify-end space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <p className="text-3xl font-bold text-red-600">{data.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla mejorada */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Monto Total
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Fecha de Emisión
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((order, index) => (
                <tr 
                  key={order.orderId} 
                  className={`
                    hover:bg-gray-50 transition-colors duration-200
                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                  `}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-100 to-red-500 rounded-full flex items-center justify-center text-white font-medium text-sm mr-3">
                        {order.customerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                        
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      ${order.totalAmount.toLocaleString('es-AR', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })}
                    </div>
                    <div className="text-xs text-gray-500">ARS</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {new Date(order.orderDate).toLocaleDateString('es-AR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(order.orderDate).toLocaleDateString('es-AR', {
                        weekday: 'long'
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer de la tabla */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Mostrando <span className="font-medium">{data.length}</span> pedido{data.length !== 1 ? 's' : ''}
            </p>
            <div className="text-sm text-gray-600">
              Total: <span className="font-semibold text-gray-900">
                ${data.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString('es-AR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}