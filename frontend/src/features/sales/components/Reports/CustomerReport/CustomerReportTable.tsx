// src/features/sales/components/CustomerReportTable.tsx
import React from "react";
import { CustomerWithCount } from "../../../types/CustomerTypes";

type Props = {
  data: CustomerWithCount[];
};

const CustomerReportTable: React.FC<Props> = ({ data }) => {
  const TotalOrders = data.reduce((acc, customer) => acc + customer.orderCount, 0);

  return (
    <div className="w-full overflow-hidden rounded-lg border shadow-md border-gray-200">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-800">
                <thead className="bg-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-600">
                <tr>
                    <th className="px-4 py-3 text-left">Nombre</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Teléfono</th>
                    <th className="px-4 py-3 text-left">Cantidad de Pedidos</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {data.map((cliente, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-red-50"}>
                    <td className="px-4 py-3">{cliente.fullName}</td>
                    <td className="px-4 py-3">{cliente.email}</td>
                    <td className="px-4 py-3">{cliente.phoneNumber}</td>
                    <td className="px-4 py-3">{cliente.orderCount}</td>
                    </tr>
                ))}
                <tr className="bg-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-600">
                    <td></td>
                    <td></td>
                    <td className="px-4 py-3">Total de pedidos:</td>
                    <td className="px-4 py-3">{TotalOrders}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default CustomerReportTable;
