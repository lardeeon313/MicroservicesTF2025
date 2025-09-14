import { Order } from "../DepotHocks/useOrderCompletedDay";
import { Package, User, Mail, Calendar, CheckCircle } from "lucide-react";

// Función utilitaria para formatear la fecha
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleString("es-AR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface Props {
  data: Order[];
}

export default function OrderCompletedDayTable({ data }: Props) {
  return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID Pedido</th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sales Order</th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cliente</th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha Pedido</th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha Entrega</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.map((order) => (
              <tr
                key={order.depotOrderId}
                className="border-b border-gray-50 hover:bg-gray-50/30 transition-all duration-200"
              >
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-4">
                      <span className="text-sm font-semibold text-blue-600">
                        {order.depotOrderId.toString().slice(-2)}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">#{order.depotOrderId}</div>
                  </div>
                </td>
                
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mr-4">
                      <Package className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="text-sm font-semibold text-gray-900">{order.salesOrderId}</div>
                  </div>
                </td>
                
                <td className="px-8 py-5">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center mr-4">
                      <User className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-sm font-semibold text-gray-900">{order.customerName}</div>
                  </div>
                </td>
                
                <td className="px-8 py-5">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center mr-4">
                      <Mail className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="text-sm font-medium text-gray-700">{order.customerEmail}</div>
                  </div>
                </td>
                
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center mr-4">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="text-sm font-medium text-gray-900">{formatDate(order.orderDate)}</div>
                  </div>
                </td>
                
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mr-4">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                      {formatDate(order.deliveryDate)}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="text-center py-16">
          <div className="p-4 bg-gray-50 rounded-2xl inline-block mb-6">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay pedidos completados</h3>
          <p className="text-gray-500">Los pedidos aparecerán aquí una vez que sean completados.</p>
        </div>
      )}
    </div>
  );
}
