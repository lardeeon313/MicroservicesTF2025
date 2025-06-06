import formatDate from "../../../../../utils/formateDate";
import { Order, OrderStatus } from "../../../types/OrderTypes";
import { OrderStatusBadge } from "../../Orders/OrderStatusBadge";


type Props = {
    orders: Order[];
}

const ModifiedCanceledOrdersTable: React.FC<Props> = ({orders}) => {

    const filteredOrders = orders.filter (
        (order) => 
            order.status === OrderStatus.Canceled ||
            order.status === OrderStatus.Issued || 
            order.status === OrderStatus.Pending 
    );

return (
    <div className="w-full overflow-hidden rounded-lg border shadow-md border-gray-200">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-800">
                <thead className="bg-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-600">
                <tr>
                    <th className="px-4 py-3 text-left">Pedido ID</th>
                    <th className="px-4 py-3 text-left">Cliente</th>
                    <th className="px-4 py-3 text-left">Fecha Modificación</th>
                    <th className="px-4 py-3 text-left">Estado</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order, index) => (
                    <tr key={order.id} className={index % 2 === 0 ? "bg-white" : "bg-red-50"}>
                    <td className="px-4 py-3">{order.id}</td>
                    <td className="px-4 py-3">{order.customerFirstName} {order.customerLastName} </td>
                    <td className="px-4 py-3">{formatDate(order.modifiedStatusDate ?? "Desconocido")}</td>
                    <td className="px-4 py-3"><OrderStatusBadge status={order.status}></OrderStatusBadge></td>
                    </tr>
                ))}
                </tbody>
            </table>
            {filteredOrders.length === 0 && (
                <p className="mt-2 text-gray-500 text-center py-10">
                No hay pedidos cancelados o modificados.
                </p>
            )}
        </div>
    </div>
);
};

export default ModifiedCanceledOrdersTable;