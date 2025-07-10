import React from "react";
import type { Order } from "../../../../../sales/types/OrderTypes";

type Props= {
    armTime: Order[];
    
}

const AverageTimeOrderTable : React.FC<Props> = ({armTime}) => {
    return(
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 shadow rounded-lg">
                <thead className="bg-gray-200 text-gray-700">
                    <tr className="">
                        <th className="px-4 py-2 text-left">Pedido ID</th>
                        <th className="px-4 py-2 text-left">Fecha de inicio de armado</th>
                        <th className="px-4 py-2 text-left">Fecha de fin de armado</th>
                    </tr>
                </thead>
                <tbody>
                    {armTime.map((item,indx) => (
                        <tr key={indx} className={indx % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                            <td className="px-4 py-2">{item.id}</td>
                            <td className="px-4 py-2">{item.startedDate}</td>
                            <td className="px-4 py-2">{item.finishDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default AverageTimeOrderTable;