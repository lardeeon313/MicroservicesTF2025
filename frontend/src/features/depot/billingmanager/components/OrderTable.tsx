import { CalendarDays, Package, User, BadgeCheck, Eye, Pencil, Trash } from "lucide-react"
import { OrderTableData } from "../../depotmanager/types/OrderTypes";
import formatDate from "../../../../utils/formateDate";
import { OrderStatusBadge } from "./OrderStatusBadge";
import LoadingSpinner from "../../../../components/LoadingSpinner";

interface Props {
  orders: OrderTableData[];
  loading: boolean;
  error: string | null;
  onRefetch: () => void;
  onView: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onActionChange: (action: string, id: number) => void;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  showStatusChange?: boolean;
  customActions?: {
    label: string;
    value: string;
  }[];
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
  showEditButton = true,
  showDeleteButton = true,
  showStatusChange = true,
  customActions = []
}: Props) {
  if (loading)
    return (
      <LoadingSpinner message="Cargando órdenes..."/>
    )
  
  if (error) {
    // Determinar si es un error relacionado con falta de órdenes
    const isNoOrdersError = error.includes('No hay órdenes') || 
                           error.includes('microservicio') || 
                           error.includes('sincronizan');
    
    return (
      <div className="text-center py-8">
        <div className="max-w-md mx-auto">
          {isNoOrdersError ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="text-blue-600 mb-4">
                <Package className="w-12 h-12 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Sin Órdenes Disponibles</h3>
                <p className="text-sm text-blue-700">{error}</p>
              </div>
              <div className="text-xs text-blue-600 space-y-1">
                <p>• Verifique que el microservicio de ventas esté funcionando</p>
                <p>• Confirme que RabbitMQ esté procesando las órdenes</p>
                <p>• Las órdenes se sincronizan automáticamente</p>
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
              <Package className="w-12 h-12 mx-auto mb-3" />
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
                <th className="px-4 py-3 text-left"><Package className="inline w-4 h-4 mr-1" /> Fecha Entrega</th>
                <th className="px-4 py-3 text-left"><BadgeCheck className="inline w-4 h-4 mr-1" /> Estado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
                {showStatusChange && (
                  <th className="px-4 py-3 text-center">Cambiar estado</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium">V-{order.id}</td>
                  <td className="px-4 py-3">{order.customerFirstName ?? ""} {order.customerLastName ?? ""}</td>
                  <td className="px-4 py-3">{formatDate(order.orderDate)}</td>
                  <td className="px-4 py-3">{order.deliveryDate ? formatDate(order.deliveryDate) : "No asignada"}</td>
                  <td className="px-4 py-3"><OrderStatusBadge status={order.status}></OrderStatusBadge></td>
                  <td className="px-4 py-3 space-x-2 text-center">
                    <button onClick={() => onView(order.id)}>
                      <Eye className="w-5 h-5 text-blue-600 hover:text-gray-700 transition-colors" />
                    </button>
                    {showEditButton && onEdit && (
                      <button onClick={() => onEdit(order.id)}>
                        <Pencil className="w-5 h-5 text-yellow-600 hover:text-gray-700 transition-colors" />
                      </button>
                    )}
                    {showDeleteButton && onDelete && (
                      <button onClick={() => onDelete(order.id)}>
                        <Trash className="w-5 h-5 text-red-600 hover:text-gray-700 transition-colors" />
                      </button>
                    )}
                  </td>
                  {showStatusChange && (
                    <td className="px-4 py-3 text-center">
                      <select
                        onChange={(e) => onActionChange(e.target.value, order.id)}
                        defaultValue=""
                        className="text-sm rounded border border-gray-300 px-2 py-1 focus:outline-none"
                      >
                        <option value="" disabled>Acción</option>
                        {customActions.length > 0 ? (
                          customActions.map((action, index) => (
                            <option key={index} value={action.value}>
                              {action.label}
                            </option>
                          ))
                        ) : (
                          <>
                            <option value="emitir">Emitir</option>
                            <option value="cancelar">Cancelar</option>
                            <option value="pendiente">Pendiente</option>
                          </>
                        )}
                      </select>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  );
}