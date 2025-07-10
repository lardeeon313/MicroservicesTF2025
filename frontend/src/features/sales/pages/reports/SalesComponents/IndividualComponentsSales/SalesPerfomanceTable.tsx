import React from "react";
import type { EmployeeSales } from "../../../../types/EmployeeSalesTypes";

interface Props{
    rows: EmployeeSales[];
}

const SalesPerfomanceTable : React.FC<Props> = ({rows}) => {
    return (
    <div className="p-4 bg-white shadow rounded">
      
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-3 px-6 border-b">Empleado ID</th>
            <th className="py-3 px-6 border-b">Nombre</th>
            <th className="py-3 px-6 border-b">Pedidos Emitidos</th>
            <th className="py-3 px-6 border-b">Última Fecha de Pedido</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row,index) => (
            <tr key={row.id} className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}>
              <td className="py-2 px-4 text-center">{row.id}</td>
              <td className="py-2 px-4 text-center">{row.firstName}{row.lastName}</td>
              <td className="py-2 px-4 text-center">
                    <ul>
                        {row.OrderItems.map((item) => (
                            <li key={item.id}>
                            {item.id} - {item.status} - {item.customerId}
                            </li>
                            ))}
                    </ul>
              </td>
              <td className="py-2 px-4">{row.OrderDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SalesPerfomanceTable;