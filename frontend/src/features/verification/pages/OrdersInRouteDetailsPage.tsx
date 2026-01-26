import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useOrderDetails, useOrderOperations } from '../hooks/useOrders';
import { OrderStatus, DeliveryPriority } from '../types/OrderTypes';
import { DeliveryPriorityLabels } from '../constants/PriorityOrderLabel';
import { OrderStatusBadge } from '../components/Order/OrderStatusBadge';
import BackButton from '../../../components/BackButton';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';
import { AlertCircle, DollarSign, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { normalizePaymentType as normalizePayment } from '../utils/normalize';

const OrdersInRouteDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const orderId = id ? parseInt(id) : undefined;
  const [isVerifyingCash, setIsVerifyingCash] = useState(false);

  const { order, loading, error, refetch } = useOrderDetails(orderId);
  const { checkCashOrder, loading: operationLoading } = useOrderOperations();

  const handleVerifyCash = async () => {
    if (!orderId) return;
    
    setIsVerifyingCash(true);
    try {
      const success = await checkCashOrder(orderId);
      if (success) {
        toast.success('Efectivo verificado correctamente');
        refetch(); // Recargar los datos de la orden
      } else {
        toast.error('Error al verificar el efectivo');
      }
    } catch (error) {
      toast.error('Error al verificar el efectivo');
    } finally {
      setIsVerifyingCash(false);
    }
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

  const totalAmount = order.items.reduce((sum, item) => sum + item.total, 0);
  // Función para normalizar el estado de la orden
  const normalizeStatus = (s: any): number | undefined => {
    if (typeof s === 'number') return s;
    if (typeof s === 'string') {
      const parsed = Number(s);
      if (!isNaN(parsed)) return parsed;
      
      // Mapear strings en español a valores del enum
      const statusMap: { [key: string]: number } = {
        'pendiente de verificación': OrderStatus.PendingVerification,
        'pendingverification': OrderStatus.PendingVerification,
        'asignado a reparto': OrderStatus.AssignedDelivery,
        'assigneddelivery': OrderStatus.AssignedDelivery,
        'verificado': OrderStatus.Verified,
        'verified': OrderStatus.Verified,
        'pendiente': OrderStatus.Pending,
        'pending': OrderStatus.Pending,
        'emitido': OrderStatus.Issued,
        'issued': OrderStatus.Issued,
        'confirmado': OrderStatus.Confirmed,
        'confirmed': OrderStatus.Confirmed,
        'en preparacion': OrderStatus.InPreparation,
        'inpreparation': OrderStatus.InPreparation,
        'preparado': OrderStatus.Prepared,
        'prepared': OrderStatus.Prepared,
        'enviado a facturar': OrderStatus.SentToBilling,
        'senttobilling': OrderStatus.SentToBilling,
        'facturado': OrderStatus.Invoiced,
        'invoiced': OrderStatus.Invoiced,
        'en camino': OrderStatus.OnTheWay,
        'ontheway': OrderStatus.OnTheWay,
        'entregado': OrderStatus.Delivered,
        'delivered': OrderStatus.Delivered,
        'cancelado': OrderStatus.Canceled,
        'canceled': OrderStatus.Canceled,
        'efectivo pendiente de verificación': OrderStatus.PendingCashVerification,
        'pendingcashverification': OrderStatus.PendingCashVerification,
        'efectivo verificado': OrderStatus.CashVerified,
        'cashverified': OrderStatus.CashVerified,
      };
      
      const lowerStatus = s.toLowerCase().trim();
      if (statusMap[lowerStatus] !== undefined) {
        return statusMap[lowerStatus];
      }
      
      // @ts-ignore
      const enumVal = OrderStatus[s as keyof typeof OrderStatus];
      if (typeof enumVal === 'number') return enumVal;
    }
    return undefined;
  };

  // Función para normalizar el tipo de pago -> delega al util centralizado
  const normalizePaymentType = (paymentType: any): string => normalizePayment(paymentType);

  const normalizedStatus = normalizeStatus(order.status);
  const normalizedPaymentType = normalizePaymentType(order.paymentType);
  
  // Normalizar prioridad (puede venir como string o número)
  const normalizePriority = (p: any): DeliveryPriority | undefined => {
    if (p === 0 || p === 1 || p === 2) return p as DeliveryPriority;
    if (typeof p === 'number') return p as DeliveryPriority;
    if (typeof p === 'string') {
      const parsed = Number(p);
      if (!isNaN(parsed)) return parsed as DeliveryPriority;
      const map: { [key: string]: DeliveryPriority } = {
        'low': DeliveryPriority.Low,
        'baja': DeliveryPriority.Low,
        'medium': DeliveryPriority.Medium,
        'media': DeliveryPriority.Medium,
        'high': DeliveryPriority.High,
        'alta': DeliveryPriority.High,
      };
      const key = p.toLowerCase().trim();
      if (map[key] !== undefined) return map[key];
    }
    return undefined;
  };

  const getPriorityColor = (pr: DeliveryPriority | undefined) => {
    switch (pr) {
      case DeliveryPriority.Low:
        return 'bg-blue-100 text-blue-800';
      case DeliveryPriority.Medium:
        return 'bg-amber-100 text-amber-800';
      case DeliveryPriority.High:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const normalizedPriority = normalizePriority(order.deliveryPriority);
  
  const canVerifyCash = normalizedStatus === OrderStatus.PendingCashVerification && 
                       normalizedPaymentType === 'Efectivo';
  

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/verification/orders-in-route" />
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
                  {new Date(order.orderDate).toLocaleDateString("es-AR")}
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
                  {normalizedPaymentType || 'N/A'}
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
                  {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString("es-AR") : 'No especificada'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Prioridad de Entrega:</label>
                <p className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-gray-900 shadow-sm">
                  {normalizedPriority !== undefined 
                    ? (
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(normalizedPriority)}`}>
                          {DeliveryPriorityLabels[normalizedPriority]}
                        </span>
                      )
                    : 'No establecida'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">ID de Orden:</label>
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

                    {/* Panel de acciones - Para órdenes con efectivo pendiente */}
                    {canVerifyCash && (
              <div className="border-t pt-8">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <DollarSign className="h-6 w-6 text-yellow-600 mr-2" />
                    <h3 className="text-lg font-semibold text-yellow-800">
                      Verificación de Efectivo Pendiente
                    </h3>
                  </div>
                  <p className="text-yellow-700 mb-4">
                    Esta orden tiene pago en efectivo y está pendiente de verificación. 
                    Una vez verificada, cambiará al estado "Efectivo Verificado".
                  </p>
                  <div className="flex justify-center">
                    <button
                      onClick={handleVerifyCash}
                      disabled={isVerifyingCash || operationLoading}
                      className="flex items-center px-6 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white font-semibold rounded-lg transition-colors"
                    >
                      {isVerifyingCash || operationLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Verificando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Verificar Efectivo
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Estado de efectivo verificado */}
            {order.status === OrderStatus.CashVerified && (
              <div className="border-t pt-8">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                    <h3 className="text-lg font-semibold text-green-800">
                      Efectivo Verificado
                    </h3>
                  </div>
                  <p className="text-green-700 mt-2">
                    El pago en efectivo de esta orden ha sido verificado correctamente.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersInRouteDetailsPage;
