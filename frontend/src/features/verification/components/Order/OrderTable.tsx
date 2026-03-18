import { CalendarDays, User, BadgeCheck, Eye, AlertCircle, DollarSign, FileText, RefreshCw } from "lucide-react";
import formatDate from "../../../../utils/formateDate";
import { normalizeOrderStatus, normalizePaymentType } from "../../utils/normalize";
import { OrderStatus } from "../../types/OrderTypes";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import EmptyState from "../../../../components/EmptyState";
import { LogisticOrderDto } from "../../types/OrderTypes";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { useMemo, useState } from "react";
import { Pagination } from "../../../../components/Pagination";

const ITEMS_PER_PAGE = 10;

interface Props {
  orders: LogisticOrderDto[];
  loading: boolean;
  error: string | null;
  onRefetch: () => void;
  onView: (id: number) => void;
  activeTab: 'pending' | 'verified' | 'assigned' | 'rejected' | 'onTheWay' | 'delivered' | 'pendingCash' | 'cashVerified' | 'pendingIncident' | 'incidentResolved';
  emptyMessageTitle?: string;
  emptyMessageBody?: string;
  onVerifyCash?: (orderId: number) => void;
  onViewIncidents?: (orderId: number) => void;
  onViewRejectionReasons?: (orderId: number) => void;
}

export default function OrderTable({
  orders,
  loading,
  onRefetch,
  onView,
  activeTab,
  emptyMessageTitle,
  emptyMessageBody,
  onVerifyCash,
  onViewIncidents,
  onViewRejectionReasons
}: Props) {

  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.max(1, Math.ceil(orders.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedOrders = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return orders.slice(start, start + ITEMS_PER_PAGE);
  }, [orders, safePage]);

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
    <div className="space-y-4">
      <div className="w-full overflow-hidden rounded-lg border border-gray-200 shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-800" data-active-tab={activeTab}>
            <thead className="bg-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Numero de Pedido</th>
                <th className="px-4 py-3 text-left"><User className="inline w-4 h-4 mr-1" /> Cliente</th>
                <th className="px-4 py-3 text-left"><CalendarDays className="inline w-4 h-4 mr-1" /> Fecha Pedido</th>
                <th className="px-4 py-3 text-left"><BadgeCheck className="inline w-4 h-4 mr-1" /> Estado</th>
                <th className="px-4 py-3 text-left"><CalendarDays className="inline w-4 h-4 mr-1" /> Fecha Entrega</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedOrders.map((order) => (
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
                      {onViewIncidents && (() => {
                                const s = normalizeOrderStatus(order.status);
                                const shouldShow = s === OrderStatus.PendingIncidentResolution || s === OrderStatus.IncidentResolved;
                                console.log('Order ID:', order.id, 'Status:', order.status, 'Normalized:', s, 'Should show button:', shouldShow);
                                return shouldShow;
                              })() && (
                        <button 
                          onClick={() => onViewIncidents(order.id)}
                          className="p-1 hover:bg-orange-100 rounded transition-colors"
                          title="Ver reporte de incidentes"
                        >
                          <FileText className="w-5 h-5 text-orange-600 hover:text-orange-700 transition-colors" />
                        </button>
                      )}
                      {onViewRejectionReasons && (() => {
                                const s = normalizeOrderStatus(order.status);
                                return s === OrderStatus.AssignmentCancelled;
                              })() && (
                        <button 
                          onClick={() => onViewRejectionReasons(order.id)}
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                          title="Ver motivos de cancelación y reasignar"
                        >
                          <RefreshCw className="w-5 h-5 text-red-600 hover:text-red-700 transition-colors" />
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
      {totalPages > 1 && (
      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      )}
    </div>
  );
}