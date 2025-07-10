import React from "react";
import { Customer,CustomerStatus } from "../../../../types/CustomerTypes";

export interface CustomerWithCount extends Customer{
    orderCount:number;
}

type Props = {
    data: CustomerWithCount[];
}

const CustomerReportTable: React.FC<Props> = ({data}) => {
    const TotalOrders = data.reduce((acc,customer) => acc + customer.orderCount,0);
    return (
    <div className="overflow-x-auto shadow-md rounded-lg mt-6">
      <table className="min-w-full border border-gray-300 text-center">
        <thead className="bg-blue-700 text-white">
          <tr>
            <th className="py-3 px-6 border-b">Nombre</th>
            <th className="py-3 px-6 border-b">Email</th>
            <th className="py-3 px-6 border-b">Teléfono</th>
            <th className="py-3 px-6 border-b">Cantidad de Pedidos</th>
          </tr>
        </thead>
        <tbody>
          {data.map((cliente, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
            >
              <td className="py-2 px-4">{cliente.firstName} {cliente.lastName}</td>
              <td className="py-2 px-4">{cliente.email}</td>
              <td className="py-2 px-4">{cliente.phoneNumber}</td>
              <td className="py-2 px-4">{cliente.orderCount}</td>
            </tr>
          ))}
          <tr className="bg-blue-700 text-white font-bold">
            <td colSpan={3} className="py-2 px-4 text-right">
              Total de pedidos hechos:
            </td>
            <td className="py-2 px-4">{TotalOrders}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default CustomerReportTable;