import React from "react";
import type { Order } from "../../../../../sales/types/OrderTypes";
import type { OrderItem } from "../../../../../sales/types/OrderTypes";

export type DailyMissing = {
  orderID: Order["id"];
  ItemID: OrderItem["id"];
  MissingDate: string; // viene como string (ej: "2025-08-20T14:35:00")
};

type Props = {
  data: DailyMissing[];
};

const DailyMissingTable: React.FC<Props> = ({ data }) => {
  // función para formatear la hora
  const formatHour = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse bg-white shadow-lg rounded-xl overflow-hidden">
        <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 uppercase text-sm tracking-wide">
          <tr>
            <th className="px-6 py-3 text-left font-semibold">Pedido ID</th>
            <th className="px-6 py-3 text-left font-semibold">Producto ID</th>
            <th className="px-6 py-3 text-left font-semibold">Hora del Faltante</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className={`transition-colors duration-200 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-blue-50`}
            >
              <td className="px-6 py-3 border-t border-gray-200 text-gray-800">
                {item.orderID}
              </td>
              <td className="px-6 py-3 border-t border-gray-200 text-gray-800">
                {item.ItemID}
              </td>
              <td className="px-6 py-3 border-t border-gray-200 text-gray-600">
                {formatHour(item.MissingDate)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DailyMissingTable;
