import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useOrderDetails } from '../hooks/useOrders';
import { useOperators } from '../hooks/useOperators';
import { OrderStatus, PaymentType } from '../types/OrderTypes';
import { DeliveryPriorityLabels } from '../constants/PriorityOrderLabel';
import { OrderStatusBadge } from '../components/Order/OrderStatusBadge';
import { ProcessOrderModal } from '../components/Order/ProcessOrderModal';
import { AssignOperatorModal } from '../components/Order/AssignOperatorModal';
import BackButton from '../../../components/BackButton';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';
import { AlertCircle } from 'lucide-react';
import { normalizeOrderStatus, normalizeDeliveryPriority, normalizePaymentType } from '../utils/normalize';
import { getPriorityBadgeColor } from '../utils/ui';
import formatDate from '../../../utils/formateDate';

const PendingOrderVerificationDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const orderId = id ? parseInt(id) : undefined;
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const { order, loading, error, refetch } = useOrderDetails(orderId);
  const { operators } = useOperators();

  const handleSuccess = () => {
    refetch();
  };

  if (loading) {
    return <LoadingSpinner message="Cargando detalles de la orden..." />;
  }

  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Error al cargar la orden"
        description={error}
        actionLabel="Reintentar"
        onAction={refetch}
      />
    );
  }

  if (!order) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Orden no encontrada"
        description="La orden solicitada no existe o no está disponible."
        actionLabel="Volver"
        onAction={() => window.history.back()}
      />
    );
  }

  const statusNum = normalizeOrderStatus(order.status);
  const totalAmount = order.items.reduce((sum, item) => sum + item.total, 0);
  const normalizedPriority = normalizeDeliveryPriority(order.deliveryPriority);
  const normalizedPayment = normalizePaymentType(order.paymentType);

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/verification/pending-orders-verification" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
            Detalles de la Orden L-{order.id}
          </h1>
          <p className="text-center text-lg text-gray-700 mb-12">
            Información detallada y acciones disponibles para esta orden
          </p>

        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 space-y-10">
            {/* Datos del cliente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Cliente:</label>
                <p className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-gray-900 shadow-sm">
                  {order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Fecha Pedido:</label>
                <p className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-gray-900 shadow-sm">
                  {formatDate(order.orderDate)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email:</label>
                <p className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-gray-900 shadow-sm">
                  {order.customer?.email || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Teléfono:</label>
                <p className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-gray-900 shadow-sm">
                  {order.customer?.phoneNumber || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Tipo de Pago:</label>
                <p className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-gray-900 shadow-sm">
                  {normalizedPayment || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Estado:</label>
                <div className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 shadow-sm">
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Fecha de Entrega:</label>
                <p className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-gray-900 shadow-sm">
                  {order.deliveryDate ? formatDate(order.deliveryDate) : 'No especificada'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Prioridad de Entrega:</label>
                <p className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-gray-900 shadow-sm">
                  {normalizedPriority !== undefined
                    ? (
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getPriorityBadgeColor(normalizedPriority)}`}>
                          {DeliveryPriorityLabels[normalizedPriority]}
                        </span>
                      )
                    : 'No establecida'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Numero del pedido:</label>
                <p className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-gray-900 shadow-sm">
                  L-{order.id}
                </p>
              </div>
              <div className='md:col-span-2'>
                <label className="block text-sm font-medium text-gray-600 mb-1">Detalles de entrega:</label>
                <p className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-gray-900 shadow-sm">
                  {order.deliveryDetail || "No especificado"}
                </p>
              </div>
              {order.deliveryAddress && (
                <div className='md:col-span-2'>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Dirección de entrega:</label>
                  <p className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-gray-900 shadow-sm">
                    {order.deliveryAddress.street} {order.deliveryAddress.number}
                    {order.deliveryAddress.apartment && `, ${order.deliveryAddress.apartment}`}
                    <br />
                    {order.deliveryAddress.city}, {order.deliveryAddress.province}
                    {order.deliveryAddress.postalCode && ` (${order.deliveryAddress.postalCode})`}
                  </p>
                </div>
              )}
            </div>

            {/* Tabla de productos */}
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-700">PRODUCTO</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">MARCA</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">CANTIDAD</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">PRECIO UNITARIO</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">TOTAL PARCIAL</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">{item.productName || 'N/A'}</td>
                      <td className="px-4 py-3 text-gray-900">{item.productBrand || 'N/A'}</td>
                      <td className="px-4 py-3 text-gray-900">{item.quantity}</td>
                      <td className="px-4 py-3 text-gray-900">
                        ${item.unitPrice?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-4 py-3 text-gray-900 font-medium">
                        ${item.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="flex justify-end">
              <div className="text-right">
                <span className="text-2xl font-bold text-green-600">
                  Total: ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Panel de acciones - Para órdenes pendientes de verificación */}
            {statusNum === OrderStatus.PendingVerification && orderId && (
              <div className="border-t pt-8">
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowProcessModal(true)}
                    className={`px-8 py-3 text-white font-semibold rounded-lg transition-colors ${
                      order.paymentType === PaymentType.Cash || normalizedPayment === 'Efectivo'
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    Verificar y Establecer Prioridad
                  </button>
                </div>
              </div>
            )}

            {/* Panel de acciones - Para órdenes verificadas: Asignar operador */}
            {statusNum === OrderStatus.Verified && orderId && (
              <div className="border-t pt-8">
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowAssignModal(true)}
                    className="px-8 py-3 text-white font-semibold rounded-lg transition-colors bg-blue-600 hover:bg-blue-700"
                  >
                    Asignar Operador
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de procesar orden */}
      <ProcessOrderModal
        isOpen={showProcessModal}
        onClose={() => setShowProcessModal(false)}
        orderId={order.id}
        currentPriority={order.deliveryPriority}
        paymentType={order.paymentType}
        onSuccess={handleSuccess}
      />

      {/* Modal para asignar operador cuando la orden está Verificada */}
      <AssignOperatorModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        orderId={order.id}
        operators={operators}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default PendingOrderVerificationDetailsPage;

