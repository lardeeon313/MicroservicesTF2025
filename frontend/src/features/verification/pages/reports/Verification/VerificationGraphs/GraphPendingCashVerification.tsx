import React from "react";
import { PendingCashVerificationReport } from "../../../../types/Report";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell
} from "recharts";

interface Props {
  data: PendingCashVerificationReport[];
}

export const GraphPendingCashVerification: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 mt-10">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Sin pedidos
          </h2>
          <p className="text-gray-500 text-sm">
            No se encontraron pedidos para las fechas o filtros seleccionados.
          </p>
        </div>
      </div>
    );
  }

  // ✅ Mostrar cada pedido como una barra individual
  const chartData = data.map((item, index) => ({
    id: item.orderId ?? index,
    label: `#${item.orderId ?? index + 1} - ${new Date(
      item.orderDate
    ).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })}`,
    amount: item.totalAmount
  }));

  const total = chartData.reduce((sum, item) => sum + item.amount, 0);
  const average = chartData.length > 0 ? total / chartData.length : 0;

  // Colores vibrantes
  const colors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899"
  ];

  // 🎯 Calcular el ancho de las barras según la cantidad de datos
  const getBarSize = () => {
    if (chartData.length === 1) return 80;
    if (chartData.length === 2) return 100;
    if (chartData.length === 3) return 120;
    return undefined; // Auto para 4 o más
  };

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 rounded-lg shadow-xl border-2 border-blue-100">
          <p className="text-sm font-bold text-gray-800 mb-1">
            {payload[0].payload.label}
          </p>
          <p className="text-lg font-semibold text-blue-600">
            ${payload[0].value.toLocaleString("es-AR")}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Verificación de Efectivo Pendiente
        </h3>
        <p className="text-sm text-gray-500">Montos por pedido</p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          barCategoryGap="20%"
        >
          <defs>
            {colors.map((color, index) => (
              <linearGradient
                key={index}
                id={`gradient${index}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                <stop offset="100%" stopColor={color} stopOpacity={0.6} />
              </linearGradient>
            ))}

            {/* Sombra 3D */}
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
              <feOffset dx="2" dy="4" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
            vertical={false}
            opacity={0.5}
          />

          <XAxis
            dataKey="label"
            stroke="#9ca3af"
            tick={{
              fill: "#4b5563",
              fontSize: 11,
              fontWeight: 500,
              textAnchor: "middle",
              dy: 10
            }}
            axisLine={{ stroke: "#d1d5db" }}
            tickLine={false}
            interval={0}
          />

          <YAxis
            stroke="#9ca3af"
            tick={{ fill: "#4b5563", fontSize: 12 }}
            axisLine={{ stroke: "#d1d5db" }}
            tickLine={false}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(59, 130, 246, 0.05)" }}
          />

          <Bar 
            dataKey="amount" 
            radius={[8, 8, 0, 0]} 
            filter="url(#shadow)"
            barSize={getBarSize()}
          >
            {chartData.map((__, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`url(#gradient${index % colors.length})`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Estadísticas rápidas */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-around">
        <div className="text-center">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-lg font-bold text-gray-800">
            ${total.toLocaleString("es-AR")}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Promedio</p>
          <p className="text-lg font-bold text-gray-800">
            ${Math.round(average).toLocaleString("es-AR")}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Órdenes</p>
          <p className="text-lg font-bold text-gray-800">
            {chartData.length}
          </p>
        </div>
      </div>
    </div>
  );
};
