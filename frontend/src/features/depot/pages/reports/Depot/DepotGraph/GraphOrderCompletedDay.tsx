import React from "react";
import type { Order } from "../DepotHocks/useOrderCompletedDay";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type DataProps = {
  data: Order[];
};

const GraphOrderByClient: React.FC<DataProps> = ({ data }) => {
  const groupedData = data.reduce((acc: Record<string, number>, curr) => {
    if (!curr.customerName) return acc;
    acc[curr.customerName] = (acc[curr.customerName] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(groupedData).map(([client, total]) => ({
    client,
    total,
  }));

  return (
    <div className="w-full h-80 bg-white rounded-lg shadow p-4 mt-6">
      <h3 className="text-xl font-semibold mb-4">
        Pedidos Completados por Cliente
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="client" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" name="Pedidos" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraphOrderByClient;


