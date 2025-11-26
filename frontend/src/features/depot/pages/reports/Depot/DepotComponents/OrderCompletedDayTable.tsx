import { Order } from "../DepotHocks/useOrderCompletedDay";

// Función utilitaria para formatear la fecha
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleString("es-AR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface Props {
  data: Order[];
}

export default function OrderCompletedDayTable({ data }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gradient-to-r from-red-400 to-red-600 text-white">
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Numero de pedido</th>

              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Fecha Pedido</th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Fecha Entrega</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((order, idx) => (
              <tr
                key={order.depotOrderId}
                className={`${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50 transition-all duration-200 hover:shadow-sm group`}
              >
                <td className="px-6 py-4 whitespace-nowrap">{order.depotOrderId}</td>
                
                <td className="px-6 py-4">{order.customerName}</td>
                <td className="px-6 py-4">{order.customerEmail}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatDate(order.orderDate)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatDate(order.deliveryDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay pedidos completados</h3>
          <p className="text-gray-500">Los pedidos aparecerán aquí una vez que sean completados.</p>
        </div>
      )}
    </div>
  );
}
