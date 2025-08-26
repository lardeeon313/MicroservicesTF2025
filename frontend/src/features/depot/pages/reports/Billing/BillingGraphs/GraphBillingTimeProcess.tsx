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
  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{`Orden #${label}`}</p>
          <p className="text-blue-600">
            <span className="font-medium">Tiempo: </span>
            {`${payload[0].value} minutos`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          Tiempo de Procesamiento por Pedido
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Comparación de duración en minutos por orden
        </p>
      </div>

      <div className="p-6">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              barSize={40} 
              barCategoryGap="20%"
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#f1f5f9" 
                vertical={false}
              />
              
              <XAxis
                dataKey="orderId"
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={{ stroke: "#e2e8f0" }}
                tickFormatter={(value) => `#${value}`}
              />
              
              <YAxis
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={{ stroke: "#e2e8f0" }}
                label={{
                  value: "Tiempo (minutos)",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle", fill: "#64748b", fontSize: "12px" }
                }}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              <Bar 
                dataKey="processingTime" 
                fill="url(#barGradient)" 
                radius={[6, 6, 0, 0]}
                stroke="#e2e8f0"
                strokeWidth={1}
                className="hover:opacity-80 transition-opacity"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GraphProcessingTimeProcess;