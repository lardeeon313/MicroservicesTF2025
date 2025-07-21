import React from "react";
import {
  Cell,
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { CustomerStatus, CustomerWithCount } from "../../../types/CustomerTypes";

const COLORS = ["#FFA500", "#FF0000", "#33aa22"];

type Props = {
  customers: CustomerWithCount[];
};

const GraphCustomerInactive: React.FC<Props> = ({ customers }) => {
  const inactiveCount = customers.filter((c) => c.status === CustomerStatus.Inactive).length;
  const lostCount = customers.filter((c) => c.status === CustomerStatus.Lost).length;
  const activeCount = customers.filter((c) => c.status === CustomerStatus.Active).length;

  const data = [
    { name: "Inactivos", value: inactiveCount },
    { name: "Perdidos", value: lostCount },
    { name: "Activos", value: activeCount },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="max-w-full mt-20 h-96 mb-14">
      <h3 className="text-center text-2xl font-bold text-red-600 mb-6">
        Distribución de Clientes Inactivos y Perdidos
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        {total === 0 ? (
          // ✅ Mostrar mensaje centrado si no hay datos
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm border border-dashed rounded">
            No hay datos disponibles para mostrar.
          </div>
        ) : (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#AA2222"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default GraphCustomerInactive;
