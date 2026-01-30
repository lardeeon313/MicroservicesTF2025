import { OrderTableData } from "../types/OrderTypes";
import { OrderItemsTable } from "../../../../components/OrderItemsTable";
import { User, CalendarDays, MapPin, BadgeCheck, Package } from "lucide-react";

type Props = {
  order: OrderTableData;
};

export default function OrderDetails({ order }: Props) {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("es-AR", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

  if (!order) return null;

  return (
    <div className="space-y-8">
      
      {/* Sección: Información General */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-800">Información General</h3>
        </div>
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Cliente
              </label>
              <p className="text-gray-900 font-medium text-base">
                {order.customerFirstName} {order.customerLastName}
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Fecha de Pedido
              </label>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-gray-400" />
                <p className="text-gray-900 font-medium text-base">
                  {formatDate(order.orderDate)}
                </p>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Estado Actual
              </label>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow-sm bg-blue-100 text-blue-800 border-2 border-blue-300">
                <BadgeCheck className="w-4 h-4" />
                <span>{order.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección: Detalles de Entrega */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-800">Detalles de Entrega</h3>
        </div>
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Instrucciones Especiales
            </label>
            <p className="text-gray-900 text-base leading-relaxed">
              {order.deliveryDetail || "No especificado"}
            </p>
          </div>
        </div>
      </div>

      {/* Sección: Productos */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-800">Productos</h3>
        </div>
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <OrderItemsTable items={order.items} />
        </div>
      </div>

    </div>
  );
}