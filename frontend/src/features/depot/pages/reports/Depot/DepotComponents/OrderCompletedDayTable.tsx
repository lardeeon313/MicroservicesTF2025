import { Order } from "../DepotHocks/useOrderCompletedDay";

interface Props {
  data: Order[];
}

export default function OrderCompletedDayTable({ data }: Props) {
  return (
    <table className="min-w-full border-collapse border border-gray-300 mt-4">
      <thead>
        <tr className="bg-gray-100">
          <th className="border border-gray-300 px-4 py-2">ID</th>
          <th className="border border-gray-300 px-4 py-2">Fecha</th>
          <th className="border border-gray-300 px-4 py-2">Total</th>
          <th className="border border-gray-300 px-4 py-2">Estado</th>
        </tr>
      </thead>
      <tbody>
        {data.map((order) => (
          <tr key={order.id}>
            <td className="border border-gray-300 px-4 py-2">{order.id}</td>
            <td className="border border-gray-300 px-4 py-2">{order.finishDate}</td>
            <td className="border border-gray-300 px-4 py-2">
              ${Number(order.total ?? 0).toFixed(2)}
            </td>
            <td className="border border-gray-300 px-4 py-2">{order.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
