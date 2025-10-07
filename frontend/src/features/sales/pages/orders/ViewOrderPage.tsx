import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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

  // Estados que permiten edición (Pendiente, Emitido, Pendiente de resolución, Pendiente de re-emisión y Re-emitida)
  const editableStatuses = [
    OrderStatus.Pending, 
    OrderStatus.Issued,
    OrderStatus.PendingResolution,
    OrderStatus.PendingReissued,
    OrderStatus.ReIssued
  ];
  const canEditOrder = order && editableStatuses.includes(order.status);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!id) return;
        const data = await getOrderById(Number(id));
        console.log(data);
        
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
      return (
        <LoadingSpinner message="Cargando órden..." height="h-screen"/>
      );
    }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/sales/orders"></BackButton>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-4xl font-bold text-red-600 mb-2">
            Detalles de la Órden {order?.id}
          </h2>
          <p className="text-center text-lg text-gray-700 mb-12">
            Aquí puedes ver los detalles completos de la orden.
          </p>

          {order && (
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 space-y-10">
              {/* Datos del cliente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Cliente:</label>
                  <p className="rounded-md bg-gray-50 px-3 py-2 text-gray-900 shadow-sm">
                    {order.customerFirstName} {order.customerLastName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Fecha Pedido:</label>
                  <p className="rounded-md bg-gray-50 px-3 py-2 text-gray-900 shadow-sm">
                    {new Date(order.orderDate).toLocaleDateString("es-AR")}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Fecha Entrega:</label>
                  <p className="rounded-md bg-gray-50 px-3 py-2 text-gray-900 shadow-sm">
                    {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString("es-AR") : "No asignada"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-4">Estado:</label>
                  <div className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-gray-900 shadow-sm">
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>
                <div className='md:col-span-2'>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Detalles de entrega:</label>
                  <p className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-gray-900 shadow-sm">
                    {order.deliveryDetail || "No especificado"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Dirección de entrega:</label>
                  <p className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-gray-900 shadow-sm">
                    {order.deliveryAddress
                      ? `${order.deliveryAddress.street}, ${order.deliveryAddress.number},${order.deliveryAddress.apartment} , ${order.deliveryAddress.city}, ${order.deliveryAddress.province}`
                      : 'No especificado'}
                  </p>
                </div>
                
              </div>

              {/* Tabla de productos */}
              <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
                <OrderItemsTable items={order.items} />
              </div>

               {/* Botón de editar - Solo visible para estados editables */}
               {canEditOrder && (
                 <div className="flex justify-end mt-6">
                   <Link 
                     to={`/sales/orders/update/${order.id}`}
                     className="px-6 py-2 bg-red-600 text-white rounded-lg shadow font-bold transition hover:bg-red-700"
                   >
                     Editar Órden
                   </Link>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}