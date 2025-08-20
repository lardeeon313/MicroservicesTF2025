import { Order } from "../DepotHocks/useOrderCompletedDay";

interface Props {
  data: Order[];
}

export default function OrderCompletedDayTable({ data }: Props) {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden">
        <thead>
          <tr className="bg-gray-100 text-gray-700 text-left">
            <th className="px-6 py-3 font-semibold">ID Pedido</th>
            <th className="px-6 py-3 font-semibold">Cliente</th>
            <th className="px-6 py-3 font-semibold">Email</th>
            <th className="px-6 py-3 font-semibold">Sales Order</th>
            <th className="px-6 py-3 font-semibold">Fecha Pedido</th>
          </tr>
        </thead>
        <tbody>
          {data.map((order, idx) => (
            <tr
              key={order.depotOrderId}
              className={`${
                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-100 transition`}
            >
              <td className="px-6 py-3 border-t">{order.depotOrderId}</td>
              <td className="px-6 py-3 border-t">{order.customerName}</td>
              <td className="px-6 py-3 border-t">{order.customerEmail}</td>
              <td className="px-6 py-3 border-t">{order.salesOrderId}</td>
              <td className="px-6 py-3 border-t">{order.completedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
