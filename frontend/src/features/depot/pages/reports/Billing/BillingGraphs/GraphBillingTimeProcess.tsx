import React from "react";
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

type Props = {
  data: {
    orderId: number;
    averageProcessingTime: number;
  }[];
};

const GraphProcessingTimeOrder: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full h-80 bg-white rounded-lg shadow p-4 mt-6">
      <h3 className="text-xl font-semibold mb-4">
        Tiempo promedio por orden (minutos)
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="orderId" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="averageProcessingTime"
            name="Tiempo Promedio (min)"
            fill="#3B82F6"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraphProcessingTimeOrder;
