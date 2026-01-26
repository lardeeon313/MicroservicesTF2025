import { Link } from "react-router-dom";
import { OrderStatus, OrderTableData } from "../../types/OrderTypes";
import { OrderStatusBadge } from "../../../../components/OrderStatusBadge";
import { OrderItemsTable } from "../../../../components/OrderItemsTable";

type Props = {
  order: OrderTableData | null;
};

const editableStatuses = [
  OrderStatus.Pending,
  OrderStatus.PendingResolution,
  OrderStatus.PendingReissued,
];

// 🔹 Mapea el enum de tipo de pago a español
const getPaymentTypeLabel = (type?: string) => {
  if (!type) return "No especificado";

  switch (type) {
    case "cash":
      return "Efectivo";
    case "credit_Card":
      return "Tarjeta de Crédito";
    case "promissory_Note":
      return "Pagaré";
    case "transfer":
      return "Transferencia Bancaria";
    case "debit_Card":
      return "Tarjeta de Debito";
    case "check":
      return "Cheque";
    case "current_Account":
      return "Cuenta corriente";
    default:
      return type;
  }
};

export default function OrderDetails({ order }: Props) {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("es-AR");

  if (!order) return null;

  return (
    <div>
      {order && (
        <div className="space-y-6 container mx-auto py-10 px-16 sm:max-w-6xl">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Cliente:
            </label>
            <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">
              {order.customerFirstName} {order.customerLastName}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Fecha Pedido:
            </label>
            <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">
              {formatDate(order.orderDate)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Fecha Entrega:
            </label>
            <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">
              {order.deliveryDate ? formatDate(order.deliveryDate) : "No asignada"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Detalles de entrega:
            </label>
            <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">
              {order.deliveryDetail || "No especificado"}
            </p>
          </div>

          {/* 🔹 Nuevo bloque: Tipo de Pago */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Tipo de Pago:
            </label>
            <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">
              {getPaymentTypeLabel(order.paymentType)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Estado:
            </label>
            <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">
              <OrderStatusBadge status={order.status}></OrderStatusBadge>
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <OrderItemsTable items={order.items} />
          </div>

          {editableStatuses.includes(order.status) && (
            <div className="mt-10">
              <Link
                to={`/sales/orders/update/${order.id}`}
                className="flex w-full justify-center items-center rounded-md bg-red-700 px-3 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-red-600 transition duration-150 disabled:opacity-50"
              >
                Editar órden
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
