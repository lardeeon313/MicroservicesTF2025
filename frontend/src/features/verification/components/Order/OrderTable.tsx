import { CalendarDays, User, BadgeCheck, Eye, AlertCircle, DollarSign } from "lucide-react";
import formatDate from "../../../../utils/formateDate";
import { normalizeOrderStatus, normalizePaymentType } from "../../utils/normalize";
import { OrderStatus } from "../../types/OrderTypes";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import EmptyState from "../../../../components/EmptyState";
import { LogisticOrderDto } from "../../types/OrderTypes";
import { OrderStatusBadge } from "./OrderStatusBadge";

interface Props {
  orders: LogisticOrderDto[];
  loading: boolean;
  error: string | null;
  onRefetch: () => void;
  onView: (id: number) => void;
  activeTab: 'pending' | 'verified' | 'assigned';
  emptyMessageTitle?: string;
  emptyMessageBody?: string;
  onVerifyCash?: (orderId: number) => void;
}

export default function OrderTable({
  orders,
  loading,
  onRefetch,
  onView,
  activeTab,
  emptyMessageTitle,
  emptyMessageBody,
  onVerifyCash
}: Props) {
  if (loading)
    return (
      <LoadingSpinner message="Cargando órdenes..."/>
    )

  if (orders.length === 0)
    return (
      <EmptyState
        icon={AlertCircle}
        title={emptyMessageTitle || "No Hay Órdenes Registradas"}
        description={
          emptyMessageBody || "Actualmente no hay órdenes en el sistema."
        }
        actionLabel="Actualizar"
        onAction={onRefetch}
      />
    );

  return (
      <div className="w-full overflow-hidden rounded-lg border border-gray-200 shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-800" data-active-tab={activeTab}>
            <thead className="bg-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left"><User className="inline w-4 h-4 mr-1" /> Cliente</th>
                <th className="px-4 py-3 text-left"><CalendarDays className="inline w-4 h-4 mr-1" /> Fecha Pedido</th>
                <th className="px-4 py-3 text-left"><BadgeCheck className="inline w-4 h-4 mr-1" /> Estado</th>
                <th className="px-4 py-3 text-left"><CalendarDays className="inline w-4 h-4 mr-1" /> Fecha Entrega</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium">L-{order.id}</td>
                  <td className="px-4 py-3">
                    {order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : 'N/A'}
                  </td>
                  <td className="px-4 py-3">{formatDate(order.orderDate)}</td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3">{order.deliveryDate ? formatDate(order.deliveryDate) : '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center space-x-2">
                      <button 
                        onClick={() => onView(order.id)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-5 h-5 text-blue-600 hover:text-gray-700 transition-colors" />
                      </button>
                      {onVerifyCash && (() => {
                                const s = normalizeOrderStatus(order.status);
                                const pt = normalizePaymentType(order.paymentType);
                                return s === OrderStatus.PendingCashVerification && pt === 'Efectivo';
                              })() && (
                        <button 
                          onClick={() => onVerifyCash(order.id)}
                          className="p-1 hover:bg-yellow-100 rounded transition-colors"
                          title="Verificar efectivo"
                        >
                          <DollarSign className="w-5 h-5 text-yellow-600 hover:text-yellow-700 transition-colors" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  );
}