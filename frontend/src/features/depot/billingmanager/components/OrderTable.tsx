import { CalendarDays, User, BadgeCheck, Eye } from "lucide-react"
import formatDate from "../../../../utils/formateDate";
import LoadingSpinner from "../../../../components/LoadingSpinner";

interface Props {
  orders: any[];
  loading: boolean;
  error: string | null;
  onRefetch: () => void;
  onView: (id: number) => void;
  activeTab: 'pending' | 'assigned' | 'rereceived' | 'inPreparation' | 'prepared' | 'invoiced' | 'sentToBilling';
  emptyMessageTitle?: string;
  emptyMessageBody?: string;
  // El resto de props se ignoran para Pending Orders
}

export default function OrderTable({
  orders,
  loading,
  onRefetch,
  onView,
  activeTab,
  emptyMessageTitle,
  emptyMessageBody
}: Props) {
  if (loading)
    return (
      <LoadingSpinner message="Cargando órdenes..."/>
    )

  if (orders.length === 0)
    return (
      <div className="text-center py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-50 border border-red-200 rounded-lg p-6">
            <div className="text-gray-600 mb-1">
              <h3 className="text-lg font-semibold mb-2">{emptyMessageTitle || "No Hay Órdenes Registradas"}</h3>
              <p className="text-sm text-gray-700">
                {emptyMessageBody || "Actualmente no hay órdenes en el sistema."}
              </p>
            </div>
            <button 
              onClick={onRefetch} 
              className="mt-4 ml-2 px-4 py-2 inline-block btn-primary border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Actualizar
            </button>
          </div>
        </div>
      </div>
    );

  return (
      <div className="w-full overflow-hidden rounded-lg border border-gray-200 shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-800">
            <thead className="bg-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left"><User className="inline w-4 h-4 mr-1" /> Cliente</th>
                <th className="px-4 py-3 text-left"><CalendarDays className="inline w-4 h-4 mr-1" /> Fecha Pedido</th>
                <th className="px-4 py-3 text-left"><BadgeCheck className="inline w-4 h-4 mr-1" /> Estado</th>
                {(activeTab === 'assigned' || activeTab === 'inPreparation') && (
                  <th className="px-4 py-3 text-left">Operario Asignado</th>
                )}
                <th className="px-4 py-3 text-center">Ver Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium">D-{order.id}</td>
                  <td className="px-4 py-3">{order.customerFirstName ?? ""}</td>
                  <td className="px-4 py-3">{formatDate(order.orderDate)}</td>
                  <td className="px-4 py-3">{order.status}</td>
                  {(activeTab === 'assigned'  || activeTab === 'inPreparation') && (
                    <td className="px-4 py-3">{order.operatorName || '-'}</td>
                  )}
                  <td className="px-4 py-3 space-x-2 text-center">
                    <button onClick={() => onView(order.id)}>
                      <Eye className="w-5 h-5 text-blue-600 hover:text-gray-700 transition-colors" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  );
}