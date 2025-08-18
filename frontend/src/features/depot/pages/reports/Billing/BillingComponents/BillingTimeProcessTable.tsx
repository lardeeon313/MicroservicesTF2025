import React from "react";
//import { ProcessingTimeOrder, RawOrderHistory } from "../types";
import { ProcessingTimeOrder,RawOrderHistory } from "../../../../billingmanager/types/BillingTimeProcessType";

type Props = {
  data: { items: RawOrderHistory[] };
};

const BillingTimeProcessTable: React.FC<Props> = ({ data }) => {
  // Transformamos la respuesta del back a lo que espera la UI
  const tableData: ProcessingTimeOrder[] = data.items.map((h: RawOrderHistory) => ({
    orderId: h.orderId,
    averageProcessingTime: h.durationMinutes,
  }));

  return (
    <table className="min-w-full divide-y divide-gray-200 bg-white rounded-xl shadow-md overflow-hidden">
  <thead className="bg-gray-100">
    <tr>
      <th
        scope="col"
        className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
      >
        Pedido
      </th>
      <th
        scope="col"
        className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
      >
        Tiempo (min)
      </th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-100">
    {tableData.map((row) => (
      <tr
        key={row.orderId}
        className="hover:bg-blue-50 transition-colors"
      >
        <td className="px-6 py-3 text-sm text-gray-800">
          {row.orderId}
        </td>
        <td className="px-6 py-3 text-sm font-medium text-blue-600">
          {row.averageProcessingTime}
        </td>
      </tr>
    ))}
  </tbody>
</table>

  );
};

export default BillingTimeProcessTable;


