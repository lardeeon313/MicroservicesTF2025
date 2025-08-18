import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// 🔹 Tipo de datos que recibe el gráfico
type ChartData = {
  orderId: number;
  processingTime: number; // 🔹 en vez de avgTime
};

type Props = {
  data: ChartData[];
};

const GraphProcessingTimeProcess: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full h-96 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6">
  <div className="mb-4">
    <h2 className="text-xl font-bold text-gray-800">Tiempo de Procesamiento por Pedido</h2>
    <p className="text-sm text-gray-500">Comparación en minutos por ID de orden</p>
  </div>
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data} barSize={45} barCategoryGap="15%">
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
      <XAxis
        dataKey="orderId"
        label={{ value: "ID Orden", position: "insideBottom", offset: -5 }}
        tick={{ fontSize: 12, fill: "#6b7280" }}
      />
      <YAxis
        label={{ value: "Minutos", angle: -90, position: "insideLeft" }}
        tick={{ fontSize: 12, fill: "#6b7280" }}
      />
      <Tooltip
        formatter={(value) => [`${value} min`, "Tiempo"]}
        labelFormatter={(label) => `Orden #${label}`}
        contentStyle={{
          backgroundColor: "white",
          borderRadius: "10px",
          border: "1px solid #e5e7eb",
          padding: "8px 12px",
          boxShadow: "0px 4px 8px rgba(0,0,0,0.05)",
        }}
      />
      <defs>
        <linearGradient id="barColor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
          <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.7} />
        </linearGradient>
      </defs>
      <Bar dataKey="processingTime" fill="url(#barColor)" radius={[10, 10, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
</div>

  );
};

export default GraphProcessingTimeProcess;

