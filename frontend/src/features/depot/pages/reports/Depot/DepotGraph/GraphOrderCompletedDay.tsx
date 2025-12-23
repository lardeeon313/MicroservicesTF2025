/*import React from "react";
import type { Order } from "../../../../../sales/types/OrderTypes";
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 backdrop-blur-sm">
          <p className="text-gray-700 font-medium">{`Cliente: ${label}`}</p>
          <p className="text-red-600 font-semibold">
            {`Pedidos: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-96 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 rounded-2xl shadow-lg border border-gray-100/50 p-6 mt-6 backdrop-blur-sm">
      {/* Header con gradiente 
      <div className="mb-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-red-500 via-red-800 to-red-600 bg-clip-text text-transparent mb-2">
          Pedidos armados por Cliente
        </h3>
        <div className="h-1 w-16 bg-gradient-to-r from-red-500 to-red-800 rounded-full"></div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          className="drop-shadow-sm"
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
              <stop offset="50%" stopColor="#6366F1" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.8} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="2 4" 
            stroke="#E5E7EB" 
            strokeOpacity={0.6}
            vertical={false}
          />
          
          <XAxis 
            dataKey="client" 
            axisLine={false}
            tickLine={false}
            tick={{ 
              fontSize: 12, 
              fill: '#6B7280', 
              fontWeight: 500 
            }}
            height={40}
          />
          
          <YAxis 
            allowDecimals={false} 
            axisLine={false}
            tickLine={false}
            tick={{ 
              fontSize: 12, 
              fill: '#6B7280', 
              fontWeight: 500 
            }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Legend 
            wrapperStyle={{ 
              paddingTop: '20px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#374151'
            }}
          />
          
          <Bar 
            dataKey="total" 
            name="Pedidos" 
            fill="url(#barGradient)"
            radius={[8, 8, 0, 0]}
            filter="url(#glow)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraphOrderByClient;


*/