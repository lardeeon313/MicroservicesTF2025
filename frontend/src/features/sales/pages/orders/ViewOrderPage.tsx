import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  FileText, 
  User, 
  MapPin, 
  Calendar, 
  CreditCard,  
  Package, 
  Edit, 
  Text
} from "lucide-react";
import { OrderTableData, OrderStatus } from "../../types/OrderTypes";
import { getOrderById } from "../../services/OrderService";
import { handleFormikError } from "../../../../components/ErrorHandler";
import { OrderStatusBadge } from "../../../../components/OrderStatusBadge";
import { OrderItemsTable } from "../../../../components/OrderItemsTable";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import BackButton from "../../../../components/BackButton";

export default function ViewOrderPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderTableData | null>(null);
  const [loading, setLoading] = useState(true);

  const editableStatuses = [
    OrderStatus.Pending, 
    OrderStatus.PendingResolution,
    OrderStatus.PendingReissued,
  ];
  const canEditOrder = order && editableStatuses.includes(order.status);

  const getPaymentTypeLabel = (type?: string) => {
    if (!type) return "No especificado";
    switch (type) {
      case "cash":
        return "Efectivo";
      case "credit_Card":
        return "Tarjeta de Crédito";
      case "debit_Card":
        return "Tarjeta de Débito";
      case "transfer":
        return "Transferencia";
      case "check":
        return "Cheque";
      case "current_Account":
        return "Cuenta Corriente";
      case "promissory_Note":
        return "Pagaré";
      default:
        return type;
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!id) return;
        const data = await getOrderById(Number(id));
        
        const mappedOrder = {
          ...data,
          deliveryAddress: data.address,
        };
        setOrder(mappedOrder);
      } catch (error) {
        handleFormikError({
          error,
          customMessages: {
            404: "Orden no encontrada.",
            500: "Error del servidor al obtener la orden.",
          },
        });
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Cargando órden..." height="h-screen" />;
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
        <BackButton to="/sales/orders" />

        {/* Header Section */}
        <div className="text-center mb-8 mt-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <FileText className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Pedido #{order?.id}
          </h1>
        </div>

        {order && (
          <div className="space-y-6">
            {/* Status Card - Destacado */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Estado del Pedido</p>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-500 mb-1">Fecha de Pedido</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(order.orderDate).toLocaleDateString("es-AR", {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Customer Information Card */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <User className="w-6 h-6" />
                    Información del Cliente
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Cliente
                      </label>
                      <p className="text-lg font-semibold text-gray-900">
                        {order.customerFirstName} {order.customerLastName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Dirección de Entrega
                      </label>
                      <p className="text-base text-gray-900">
                        {order.deliveryAddress
                          ? `${order.deliveryAddress.street} ${order.deliveryAddress.number}${order.deliveryAddress.apartment ? `, ${order.deliveryAddress.apartment}` : ''}, ${order.deliveryAddress.city}, ${order.deliveryAddress.province}`
                          : "No especificado"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery & Payment Info Card */}
              <div className="space-y-6">
                {/* Delivery Date Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Fecha de Entrega
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {order.deliveryDate
                          ? new Date(order.deliveryDate).toLocaleDateString("es-AR", {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })
                          : "No asignada"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Type Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Tipo de Pago
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {getPaymentTypeLabel(order.paymentType)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Details Card */}
            {order.deliveryDetail && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Text className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Detalles de Entrega
                    </label>
                    <p className="text-base text-gray-700 leading-relaxed">
                      {order.deliveryDetail}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Products Table Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Package className="w-6 h-6" />
                  Productos del Pedido
                </h2>
              </div>
              <div className="p-6">
                <OrderItemsTable items={order.items} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center gap-4 flex-wrap">
              {canEditOrder && (
                <Link
                  to={`/sales/orders/update/${order.id}`}
                  className="group inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl shadow-sm  font-bold transition-all hover:bg-red-700 hover:shadow-xl transform hover:-translate-x-1"
                >
                  <Edit className="w-5 h-5" />
                  Editar Orden
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}