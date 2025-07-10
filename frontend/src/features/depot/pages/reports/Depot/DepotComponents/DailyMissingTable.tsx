import React from "react";
import type { Order } from "../../../../../sales/types/OrderTypes";
import type { OrderItem } from "../../../../../sales/types/OrderTypes";

export type DailyMissing = {
    orderID: Order['id']
    ItemID: OrderItem['id']
    MissingHour: number;
}

type Props = {
    data: DailyMissing[]
}

const DailyMissingTable : React.FC<Props> = ({data}) => {
    return(
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 shadow rounded-lg">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Pedido ID</th>
            <th className="px-4 py-2 text-left">Producto ID</th>
            <th className="px-4 py-2 text-left">Hora del Faltante</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item,index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-2">{item.orderID}</td>
                <td className="px-4 py-2">{item.ItemID}</td>
                <td className="px-4 py-2">{item.MissingHour}</td>
              </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DailyMissingTable;


