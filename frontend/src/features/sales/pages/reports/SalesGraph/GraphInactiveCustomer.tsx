import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import type { Customer } from "../../../types/CustomerTypes";
import { CustomerStatus } from "../../../types/CustomerTypes";

// Datos ficticios (podés reemplazar esto con props o datos reales si lo necesitás)
interface Props{
  customers: Customer[];
}

const COLORS = ["#8884d8", "#ff6384"];

const GraphInactiveCustomer: React.FC<Props> = ({customers}) => {
    // Contar cuántos son Inactivos y cuántos Perdidos
  const inactiveCount = customers.filter(c => c.status === CustomerStatus.Inactive).length;
  const lostCount = customers.filter(c => c.status === CustomerStatus.Lost).length;

  const data = [
    { name: "Inactivos", value: inactiveCount },
    { name: "Perdidos", value: lostCount },
  ];

  return (
    <div className="flex justify-center items-center mt-6">
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 text-center mb-4">
          Estado de Clientes Inactivos o Perdidos
        </h3>
        <PieChart width={300} height={250}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
};

export default GraphInactiveCustomer;
