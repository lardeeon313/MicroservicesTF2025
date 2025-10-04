import { CalendarDays, Package, User, BadgeCheck, Eye, Pencil, Trash,MapPin } from "lucide-react"
import { OrderTableData } from "../../types/OrderTypes";
import formatDate from "../../../../utils/formateDate";
import { OrderStatusBadge } from "../../../../components/OrderStatusBadge";
import LoadingSpinner from "../../../../components/LoadingSpinner";

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
    return (
      <LoadingSpinner message="Cargando órdenes..."/>
    )
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
      <div className="w-full overflow-hidden rounded-lg border border-gray-200 shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-800">
            <thead className="bg-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left"><User className="inline w-4 h-4 mr-1" /> Cliente</th>
                <th className="px-4 py-3 text-left"><CalendarDays className="inline w-4 h-4 mr-1" /> Fecha Pedido</th>
                <th className="px-4 py-3 text-left"><Package className="inline w-4 h-4 mr-1" /> Fecha Entrega</th>
                <th className="px-4 py-3 text-left"><MapPin className="inline w-4 h-4 mr-1" /> Dirección</th>
                <th className="px-4 py-3 text-left"><BadgeCheck className="inline w-4 h-4 mr-1" /> Estado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
                <th className="px-4 py-3 text-center">Cambiar estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium">V-{order.id}</td>
                  <td className="px-4 py-3">{order.customerFirstName ?? ""} {order.customerLastName ?? ""}</td>
                  <td className="px-4 py-3">{formatDate(order.orderDate)}</td>
                  <td className="px-4 py-3">{order.deliveryDate ? formatDate(order.deliveryDate) : "No asignada"}</td>
                  <td className="px-4 py-3">
                    {order.deliveryAddress ? (
                      <div>
                        {order.deliveryAddress.street} {order.deliveryAddress.number}
                        {order.deliveryAddress.apartment
                          ? `, ${order.deliveryAddress.apartment}`
                          : ""}
                        , {order.deliveryAddress.city}, {order.deliveryAddress.province},{" "}
                        {order.deliveryAddress.country}
                      </div>
                    ) : (
                      <span>Sin dirección</span>
                    )}
                  </td>
                  <td className="px-4 py-3"><OrderStatusBadge status={order.status}></OrderStatusBadge></td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center items-center gap-x-2">
                      <button
                        onClick={() => onView(order.id)}
                        className="p-2 rounded-full hover:bg-blue-100 transition"
                        title="Ver"
                      >
                        <Eye className="w-5 h-5 text-blue-600" />
                      </button>
                      <button
                        onClick={() => onEdit(order.id)}
                        className="p-2 rounded-full hover:bg-yellow-100 transition"
                        title="Editar"
                      >
                        <Pencil className="w-5 h-5 text-yellow-600" />
                      </button>
                      <button
                        onClick={() => onDelete(order.id)}
                        className="p-2 rounded-full hover:bg-red-100 transition"
                        title="Eliminar"
                      >
                        <Trash className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <select
                      onChange={(e) => onActionChange(e.target.value, order.id)}
                      defaultValue=""
                      className="text-sm  rounded border border-gray-300 px-2 py-1 focus:outline-none"
                    >
                      <option value="" disabled>Estado</option>
                      <option value="emitir">Emitir</option>
                      <option value="cancelar">Cancelar</option>
                      <option value="pendiente">Pendiente</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  );
}