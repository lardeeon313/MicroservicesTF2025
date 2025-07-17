import React from "react";
import type { Order } from "../../../../types/OrderTypes";

interface Props{
    orders: Order[];
}

const ModifiedCanceledOrdersTable : React.FC<Props> = ({orders}) => {
    const filteredOrders = orders.filter(
        (order) => order.status === "canceled"|| order.status === "modified"
    );

    return(
        <div>
             <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                <tr>
                    <th className="py-3 px-6 border-b">Pedido ID</th>
                    <th className="py-3 px-6 border-b">Cliente ID</th>
                    <th className="py-3 px-6 border-b">Fecha Modificación</th>
                    <th className="py-3 px-6 border-b">Estado</th>
                </tr>
                </thead>
            <tbody>
                {filteredOrders.map((order,index) => (
                <tr key={order.id} className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                    <td className="py-2 px-4">{order.id}</td>
                    <td className="py-2 px-4">{order.customerId}</td>
                    <td className="py-2 px-4">{order.modifiedStatusDate || "N/A"}</td>
                    <td className="py-2 px-4">{order.status}</td>
                </tr>
                ))}
            </tbody>
            </table>
            {filteredOrders.length === 0 && (
            <p className="mt-2 text-gray-500">No hay pedidos cancelados o modificados.</p>
            )}
        </div>
    )
}

export default ModifiedCanceledOrdersTable;