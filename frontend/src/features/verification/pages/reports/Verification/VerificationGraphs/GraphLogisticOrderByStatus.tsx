// components/OrdersByStatusChart.tsx
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { OrdersByStatusDtoReport } from "../../../../types/Report";
import { STATUS_TRANSLATIONS } from "../../../../types/Report";

interface Props {
  data: OrdersByStatusDtoReport[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#64748B",        // Slate - Pendiente
  processing: "#0F172A",     // Slate oscuro - Procesando
  completed: "#065F46",      // Green oscuro - Completado
  cancelled: "#7F1D1D",      // Red oscuro - Cancelado
  shipped: "#1E3A8A",        // Blue oscuro - Enviado
  delivered: "#14532D",      // Green muy oscuro - Entregado
};

const getStatusColor = (status: string, index: number): string => {
  const normalizedStatus = status.toLowerCase();
  return STATUS_COLORS[normalizedStatus] || `hsl(${210 + index * 30}, 45%, 35%)`;
};

export const translateStatus = (status: string) =>
  STATUS_TRANSLATIONS[status] ?? status;

export const GraphOrdersByStatus: React.FC<Props> = ({ data }) => {
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
            Sin pedidos
          </h2>
          <p className="text-gray-500 text-sm">
            No se encontraron pedidos para las fechas o filtros seleccionados.
          </p>
        </div>
      </div>
    );
  }
  
  const total = data.reduce((sum, item) => sum + item.count, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-4">
          <p className="font-semibold text-white text-base mb-2">
            {payload[0].name}
          </p>
          <div className="space-y-1">
            <p className="text-slate-200 text-sm">
              Órdenes: <span className="font-bold text-white">{payload[0].value}</span>
            </p>
            <p className="text-slate-200 text-sm">
              Porcentaje: <span className="font-bold text-white">{percentage}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="font-bold text-sm drop-shadow-lg"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-md border border-slate-200">
      <div className="px-6 py-5 border-b border-slate-200">
        <h3 className="text-xl font-bold text-slate-800">
          Órdenes por Estado
        </h3>
      </div>
      
      <div className="p-6">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                dataKey="count"
                nameKey="status"
                data={data.map(d => ({ ...d, status: translateStatus(d.status) }))}
                cx="50%"
                cy="45%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={120}
                innerRadius={75}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getStatusColor(entry.status, index)}
                    className="stroke-white stroke-[3px] hover:opacity-90 transition-all duration-200 cursor-pointer"
                    style={{
                      filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))"
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={60}
                wrapperStyle={{
                  paddingTop: "20px"
                }}
                formatter={(value) => (
                  <span className="text-sm font-medium text-slate-700">
                    {translateStatus(value)}
                  </span>
                )}
                iconType="circle"
                iconSize={10}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};