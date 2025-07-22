import { CalendarDays, User, BadgeCheck, Eye } from "lucide-react"
import formatDate from "../../../../utils/formateDate";
import LoadingSpinner from "../../../../components/LoadingSpinner";

interface Props {
  orders: any[];
  loading: boolean;
  error: string | null;
  onRefetch: () => void;
  onView: (id: number) => void;
  // El resto de props se ignoran para Pending Orders
}

export default function OrderTable({
  orders,
  loading,
  error,
  onRefetch,
  onView,
}: Props) {
  if (loading)
    return (
      <LoadingSpinner message="Cargando órdenes..."/>
    )
  
  if (error) {
    const isNoOrdersError = error.includes('No hay órdenes') || 
                           error.includes('microservicio') || 
                           error.includes('sincronizan');
    return (
      <div className="text-center py-8">
        <div className="max-w-md mx-auto">
          {isNoOrdersError ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="text-blue-600 mb-4">
                <h3 className="text-lg font-semibold mb-2">Sin Órdenes Disponibles</h3>
                <p className="text-sm text-blue-700">{error}</p>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="text-red-600 mb-4">
                <h3 className="text-lg font-semibold mb-2">Error al Cargar Órdenes</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}
          <button 
            onClick={onRefetch} 
            className="mt-4 btn-primary inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0)
    return (
      <div className="text-center py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="text-gray-600 mb-4">
              <h3 className="text-lg font-semibold mb-2">No Hay Órdenes Registradas</h3>
              <p className="text-sm text-gray-700">
                Actualmente no hay órdenes en el sistema. Las órdenes aparecerán automáticamente cuando se registren desde el módulo de ventas.
              </p>
            </div>
            <button 
                onClick={onRefetch} 
                className="mt-4 btn-primary inline-block bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
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
                <th className="px-4 py-3 text-center">Ver Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium">D-{order.id}</td>
                  <td className="px-4 py-3">{order.customerFirstName ?? ""}</td>
                  <td className="px-4 py-3">{formatDate(order.orderDate)}</td>
                  <td className="px-4 py-3">
                    Pendiente de facturar
                  </td>
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