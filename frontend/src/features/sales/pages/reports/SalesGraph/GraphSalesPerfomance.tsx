// components/REPORTES/DesempenoVentasChart.tsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { EmployeeSales } from "../../../types/EmployeeSalesTypes";

interface Props {
  data: EmployeeSales[];
}

const GraphSalesPerfomance: React.FC<Props> = ({ data }) => {
  // Transformar datos para el gráfico
  const chartData = data.map((emp) => ({
    name: `${emp.firstName ?? ''} ${emp.lastName ?? ''}`.trim(),
    pedidosEmitidos: emp.OrderItems.length,
  }));

  return (
    <div className="w-full h-96 p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-blue-800">Pedidos Emitidos por Empleado</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="pedidosEmitidos" fill="#8884d8" name="Pedidos Emitidos" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraphSalesPerfomance;
