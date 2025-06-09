import React from "react";
import type { Order } from "../../../../../sales/types/OrderTypes";


type Props = {
    data : {OrderID: Order['id'];finishdate: Order['finishDate']}[];
}

const OrderCompletedDayTable : React.FC<Props> = ({data}) => {
    return(
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 shadow rounded-lg">
                <thead className="bg-gray-200 text-gray-700">
                    <tr>
                        <th className="px-4 py-2 text-left">Fecha</th>
                        <th className="px-4 py-2 text-left">Pedidos Completados</th>
                    </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                        <td className="px-4 py-2">{item.OrderID}</td>
                        <td className="px-4 py-2">{item.finishdate}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default OrderCompletedDayTable;