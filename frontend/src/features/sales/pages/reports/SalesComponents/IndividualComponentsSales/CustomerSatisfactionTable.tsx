import React from "react";
import type { Customer } from "../../../../types/CustomerTypes";

interface Props {
  data: (Customer & {pedidoID?:string | number})[];
}

const CustomerSatisfactionTable: React.FC<Props> = ({ data }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-blue-100">
          <tr>
            <th className="py-3 px-6 border-b">Cliente</th>
            <th className="py-3 px-6 border-b">Pedido ID</th>
            <th className="py-3 px-6 border-b">Descripción</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={row.id}
              className= {index % 2 === 0 ? "bg-blue-50" : "bg-white"}
            >
              <td className="py-2 px-4">{row.firstName} {row.lastName}</td>
              <td className="py-2 px-4">{row.pedidoID}</td>
              <td className="py-2 px-4">{row.descriptionsatisfaction}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerSatisfactionTable;
