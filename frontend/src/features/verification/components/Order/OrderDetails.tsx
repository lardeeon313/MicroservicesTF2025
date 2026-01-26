import { LogisticOrderDto } from "../../types/OrderTypes";
import { OrderItemsTable } from "../../../../components/OrderItemsTable";
import { OrderStatusLabels } from "../../constants/OrderStatusLabel";
import { DeliveryPriorityLabels } from "../../constants/PriorityOrderLabel";
import { getPaymentTypeLabel } from "../../constants/PaymentTypeLabel";
type Props = {
  order: LogisticOrderDto;
};

export default function OrderDetails({ order }: Props) {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("es-AR");

  if (!order) return null;

  return (
    <div className="space-y-6 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Cliente:</label> 
          <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">
            {order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : 'N/A'}
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Email:</label> 
          <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">
            {order.customer?.email || 'N/A'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Teléfono:</label> 
          <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">
            {order.customer?.phoneNumber || 'N/A'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Fecha Pedido:</label> 
          <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">
            {formatDate(order.orderDate)}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Estado:</label> 
          <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">
            {OrderStatusLabels[order.status]}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Prioridad:</label> 
          <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">
            {order.deliveryPriority ? DeliveryPriorityLabels[order.deliveryPriority] : 'No asignada'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Monto Total:</label> 
          <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">
            ${order.totalAmount?.toFixed(2) || 'N/A'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Tipo de Pago:</label> 
          <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">
            {getPaymentTypeLabel(order.paymentType) || 'N/A'}
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Detalles de entrega:</label>
        <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">
          {order.deliveryDetail || "No especificado"}
        </p>
      </div>

      {order.deliveryAddress && (
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Dirección de entrega:</label>
          <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">
            {order.deliveryAddress.street} {order.deliveryAddress.number}
            {order.deliveryAddress.apartment && `, ${order.deliveryAddress.apartment}`}
            <br />
            {order.deliveryAddress.city}, {order.deliveryAddress.province}
            {order.deliveryAddress.postalCode && ` (${order.deliveryAddress.postalCode})`}
          </p>
        </div>
      )}

      <div className="space-y-4 pt-2">
        <h3 className="text-lg font-medium text-gray-900">Items del Pedido</h3>
        <OrderItemsTable items={order.items} />
      </div>
    </div>
  );
}