import React from "react";

type Props = {
    data : {date: string;total:number}[];
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
                    <td className="px-4 py-2">{item.date}</td>
                    <td className="px-4 py-2">{item.total}</td>
                </tr>
            ))}
            </tbody>
            </table>
        </div>
    )
}

export default OrderCompletedDayTable;