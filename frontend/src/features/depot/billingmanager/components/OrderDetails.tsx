import { OrderTableData } from "../types/OrderTypes";
import { OrderItemsTable } from "../../../../components/OrderItemsTable";
//import OrderDetailsInformation from "../../../../components/OrderDetailsInformation";

type Props = {
  order: OrderTableData;
};

export default function OrderDetails({ order }: Props) {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("es-AR");

  if (!order) return null;

  return (
    <div>
        {order && (
          
          <div className="space-y-6 mt-10 w-3xl">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Cliente:</label> 
              <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">{order.customerFirstName} {order.customerLastName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Fecha Pedido:</label> 
              <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">{formatDate(order.orderDate)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Detalles de entrega:</label>
              <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">{order.deliveryDetail || "No especificado"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Estado:</label> 
              <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">{order.status}</p>
            </div>
            <div className="space-y-4 pt-2">
              {/* Reemplazas la tabla por el componente reutilizable */}
              <OrderItemsTable items={order.items} />
            </div>
          </div>
        )}
      </div>
  );
}


//: {formatDate(order.orderDate)}