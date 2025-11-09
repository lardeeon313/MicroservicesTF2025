//Pedidos rechazados: 

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { DeliveryRejectionReport } from "../../../../types/Report";

interface Props {
  data: DeliveryRejectionReport[];
}

const GraphDeliveryRejectionsReport: React.FC<Props> = ({ data }) => {

  if (data.length === 0 || !data) {
    return (
      <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 mt-10">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Sin Rechazos
          </h2>
          <p className="text-gray-500 text-sm">
            No hay pedidos rechazados para graficar en el período seleccionado
          </p>
        </div>
      </div>
    );
  }

  const grouped = Object.values(
    data.reduce((acc: any, item) => {
      const key = item.customerName || "Desconocido";
      acc[key] = acc[key] || { rejectionType: key, count: 0 };
      acc[key].count += 1;
      return acc;
    }, {})
  );

  // Paleta de colores vibrante y moderna
  const colors = [
    "#d62013ff", // indigo-500
    "#ec4899", // pink-500
    "#8b5cf6", // violet-500
    "#f59e0b", // amber-500
    "#14b8a6", // teal-500
    "#06b6d4", // cyan-500
    "#f97316", // orange-500
    "#a855f7", // purple-500
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-5 py-3 rounded-xl shadow-2xl border border-gray-700 backdrop-blur-sm">
          <p className="text-sm font-medium text-gray-300">
            {payload[0].payload.rejectionType}
          </p>
          <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mt-1">
            {payload[0].value}
          </p>
          <p className="text-xs text-gray-400 mt-1">rechazos</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 rounded-3xl shadow-2xl p-8 mt-6 border border-gray-200/50 backdrop-blur-sm">
      {/* Decoración de fondo */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/40 to-violet-100/40 rounded-full blur-3xl -z-10 transform translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-100/40 to-orange-100/40 rounded-full blur-3xl -z-10 transform -translate-x-24 translate-y-24"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-violet-500 rounded-full"></div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Rechazos por tipo
            </h3>
          </div>
          <p className="text-sm text-gray-500 mt-2 ml-7">
            Distribución de pedidos rechazados
          </p>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-violet-500 rounded-2xl blur opacity-30 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl p-4 shadow-lg">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-inner border border-gray-100">
        <ResponsiveContainer width="100%" height={360}>
          <BarChart
            data={grouped}
            margin={{ top: 20, right: 20, left: 10, bottom: 60 }}
          >
            <defs>
              {colors.map((color, index) => (
                <linearGradient
                  key={index}
                  id={`colorGradient${index}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={color} stopOpacity={1} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                </linearGradient>
              ))}
              {/* Gradiente para sombras de barras */}
              {colors.map((__, index) => (
                <filter key={`shadow${index}`} id={`shadow${index}`} height="200%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                  <feOffset dx="0" dy="4" result="offsetblur"/>
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.3"/>
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              ))}
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e2e8f0" 
              opacity={0.6}
              vertical={false}
            />
            <XAxis
              dataKey="rejectionType"
              tick={{ fill: "#475569", fontSize: 13, fontWeight: 500 }}
              tickLine={false}
              axisLine={{ stroke: "#cbd5e1", strokeWidth: 2 }}
              angle={-35}
              textAnchor="end"
              height={80}
            />
            <YAxis
              tick={{ fill: "#475569", fontSize: 13, fontWeight: 500 }}
              tickLine={false}
              axisLine={{ stroke: "#cbd5e1", strokeWidth: 2 }}
              label={{
                value: "Cantidad",
                angle: -90,
                position: "insideLeft",
                style: { fill: "#64748b", fontSize: 14, fontWeight: 600 },
              }}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: "#f1f5f9", opacity: 0.5, radius: 8 }} 
            />
            <Bar
              dataKey="count"
              radius={[12, 12, 0, 0]}
              maxBarSize={70}
            >
              {grouped.map((__, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#colorGradient${index % colors.length})`}
                  filter={`url(#shadow${index % colors.length})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl p-3 shadow-lg">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total de rechazos</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                {data.length}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-500">Clientes Únicos</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
              {grouped.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphDeliveryRejectionsReport;