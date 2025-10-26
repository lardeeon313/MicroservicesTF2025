<<<<<<< HEAD
import { CalendarDays, User, BadgeCheck, Eye, AlertCircle } from "lucide-react"
import formatDate from "../../../../utils/formateDate";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import EmptyState from "../../../../components/EmptyState";
=======
import { CalendarDays, User, BadgeCheck, Eye, MapPin } from "lucide-react";
import formatDate from "../../../../utils/formateDate";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import { OrderTableData } from "../../depotmanager/types/OrderTypes";
>>>>>>> e3fd2db (Refactorizacion lista para el DepotService , tanto para lo que es DepotManager , Operator y BillingManager)

interface Props {
  orders: OrderTableData[];
  loading: boolean;
  error: string | null;
  onRefetch: () => void;
  onView: (id: number) => void;
  activeTab:
    | "pending"
    | "assigned"
    | "rereceived"
    | "inPreparation"
    | "prepared"
    | "invoiced"
    | "sentToBilling";
  emptyMessageTitle?: string;
  emptyMessageBody?: string;
}

export default function OrderTable({
  orders,
  loading,
  onRefetch,
  onView,
  activeTab,
  emptyMessageTitle,
  emptyMessageBody,
}: Props) {
  if (loading)
    return <LoadingSpinner message="Cargando órdenes..." />;

  if (orders.length === 0)
    return (
<<<<<<< HEAD
      <EmptyState
        icon={AlertCircle}
        title={emptyMessageTitle || "No Hay Órdenes Registradas"}
        description={
          emptyMessageBody || "Actualmente no hay órdenes en el sistema."
        }
        actionLabel="Actualizar"
        onAction={onRefetch}
      />
    );  
=======
      <div className="text-center py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-50 border border-red-200 rounded-lg p-6">
            <div className="text-gray-600 mb-1">
              <h3 className="text-lg font-semibold mb-2">
                {emptyMessageTitle || "No Hay Órdenes Registradas"}
              </h3>
              <p className="text-sm text-gray-700">
                {emptyMessageBody ||
                  "Actualmente no hay órdenes en el sistema."}
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
>>>>>>> e3fd2db (Refactorizacion lista para el DepotService , tanto para lo que es DepotManager , Operator y BillingManager)

  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 shadow">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-800">
          <thead className="bg-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">
                <User className="inline w-4 h-4 mr-1" /> Cliente
              </th>
              <th className="px-4 py-3 text-left">
                <MapPin className="inline w-4 h-4 mr-1" /> Dirección
              </th>
              <th className="px-4 py-3 text-left">
                <CalendarDays className="inline w-4 h-4 mr-1" /> Fecha Pedido
              </th>
              <th className="px-4 py-3 text-left">
                <BadgeCheck className="inline w-4 h-4 mr-1" /> Estado
              </th>
              {(activeTab === "assigned" ||
                activeTab === "inPreparation") && (
                <th className="px-4 py-3 text-left">Operario Asignado</th>
              )}
              <th className="px-4 py-3 text-center">Ver Detalle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => {
              const addr = order.address;
              const direccion = addr
                ? `${addr.street ?? ""} ${addr.number ?? ""}${
                    addr.apartment ? `, ${addr.apartment}` : ""
                  } - ${addr.city ?? ""}, ${addr.province ?? ""}, ${
                    addr.country ?? ""
                  }`
                : "-";

              return (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium">D-{order.id}</td>
                  <td className="px-4 py-3">
                    {order.customerFirstName} {order.customerLastName}
                  </td>
                  <td className="px-4 py-3">{direccion}</td>
                  <td className="px-4 py-3">
                    {formatDate(order.orderDate)}
                  </td>
                  <td className="px-4 py-3">
                    {order.status === 8 ||
                    order.status === "8" ||
                    order.status === "Facturada" ? (
                      <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-semibold">
                        Facturada
                      </span>
                    ) : order.status === 5 ||
                      order.status === "5" ||
                      order.status === "sentToBilling" ? (
                      <span className="inline-block px-2 py-1 rounded bg-orange-100 text-orange-800 text-xs font-semibold">
                        Pendiente de facturación
                      </span>
                    ) : (
                      order.status
                    )}
                  </td>
                  {(activeTab === "assigned" ||
                    activeTab === "inPreparation") && (
                    <td className="px-4 py-3">{order.operatorName || "-"}</td>
                  )}
                  <td className="px-4 py-3 space-x-2 text-center">
                    <button onClick={() => onView(order.id)}>
                      <Eye className="w-5 h-5 text-blue-600 hover:text-gray-700 transition-colors" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
