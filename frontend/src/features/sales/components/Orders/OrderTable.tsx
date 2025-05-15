import { CalendarDays, Package, User, BadgeCheck, FileText, Eye, Pencil, Trash } from "lucide-react"
import { OrderTableData } from "../../types/OrderTypes";
import formatDate from "../../../../utils/formateDate";

interface Props {
  orders: OrderTableData[];
  loading: boolean;
  error: string | null;
  onRefetch: () => void;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onActionChange: (action: string, id: number) => void;
}

export default function OrderTable({
  orders,
  loading,
  error,
  onRefetch,
  onView,
  onEdit,
  onDelete,
  onActionChange,
}: Props) {
  if (loading)
    return <div className="text-center py-8 text-gray-600">Cargando órdenes...</div>;

  if (error)
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={onRefetch} className="btn-primary inline-block">Reintentar</button>
      </div>
    );

  if (orders.length === 0)
    return <div className="text-center py-8 text-gray-500">No hay órdenes registradas.</div>;

  return (
      <div className="overflow-x-auto rounded shadow border border-gray-200">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-gray-100 uppercase text-xs font-semibold tracking-wide text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left"><User className="inline w-4 h-4 mr-1" /> Cliente</th>
              <th className="px-4 py-2 text-left"><CalendarDays className="inline w-4 h-4 mr-1" /> Fecha Pedido</th>
              <th className="px-4 py-2 text-left"><Package className="inline w-4 h-4 mr-1" /> Fecha Entrega</th>
              <th className="px-4 py-2 text-left"><BadgeCheck className="inline w-4 h-4 mr-1" /> Estado</th>
              <th className="px-4 py-2 text-left"><FileText className="inline w-4 h-4 mr-1" /> Total</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-2">{order.id}</td>
                <td className="px-4 py-2">{order.customerFirstName ?? ""} {order.customerLastName ?? ""}</td>
                <td className="px-4 py-2">{formatDate(order.orderDate)}</td>
                <td className="px-4 py-2">{order.deliveryDate ? formatDate(order.deliveryDate) : "No asignada"}</td>
                <td className="px-4 py-2">{order.status}</td>
                <td className="px-4 py-2">{order.totalAmount !== null ? `$${order.totalAmount?.toFixed(2)}` : "Pendiente"}</td>
                <td className="px-4 py-2 space-x-2">
                  <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs" onClick={() => onView(order.id)}>
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded text-xs" onClick={() => onEdit(order.id)}>
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button className="bg-red-600 text-white px-2 py-1 rounded text-xs" onClick={() => onDelete(order.id)}>
                    <Trash className="w-4 h-4" />
                  </button>
                  <select
                    onChange={(e) => onActionChange(e.target.value, order.id)}
                    defaultValue=""
                    className="text-xs border border-gray-300 rounded px-2 py-1 ml-2"
                  >
                    <option value="" disabled>Acción</option>
                    <option value="emitir">Emitir</option>
                    <option value="cancelar">Cancelar</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
}