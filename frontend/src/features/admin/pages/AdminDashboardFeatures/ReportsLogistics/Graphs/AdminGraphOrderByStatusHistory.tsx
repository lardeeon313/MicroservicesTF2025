import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { TrendingUp } from "lucide-react";

import { OrderStatusHistoryReport } from "../../../../../verification/types/Report";
import { OrderStatusLabels } from "../Hocks/useOrderByStatusHistory";

interface Props {
  data: OrderStatusHistoryReport[];
}

const COLORS = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  "#EC4899", "#14B8A6", "#F97316", "#6366F1", "#84CC16",
  "#06B6D4", "#F43F5E", "#8B5CF6", "#A855F7", "#D946EF",
  "#64748B", "#0EA5E9", "#22C55E", "#EAB308", "#DC2626"
];

export const AdminGraphOrderByStatusHistory: React.FC<Props> = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Contar transiciones por nuevo estado
    const statusCount: Record<string, number> = {};
    
    data.forEach((item) => {
      const statusLabel = OrderStatusLabels[item.newStatus] || item.newStatus;
      statusCount[statusLabel] = (statusCount[statusLabel] || 0) + 1;
    });

    // Convertir a array y ordenar por cantidad descendente
    return Object.entries(statusCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  const totalTransitions = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="flex flex-col items-center">
          <div className="p-3 bg-blue-100 rounded-full mb-4">
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay datos para mostrar
          </h3>
          <p className="text-gray-600">
            Ajusta los filtros para visualizar el gráfico de distribución.
          </p>
        </div>
      </div>
    );
  }

  const renderCustomLabel = (entry: any) => {
    const percent = ((entry.value / totalTransitions) * 100).toFixed(1);
    return `${percent}%`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percent = ((data.value / totalTransitions) * 100).toFixed(1);
      return (
        <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-1">{data.name}</p>
          <p className="text-sm text-gray-600">
            Transiciones: <span className="font-bold text-gray-900">{data.value}</span>
          </p>
          <p className="text-sm text-gray-600">
            Porcentaje: <span className="font-bold text-blue-600">{percent}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-100 to-blue-200 px-6 py-3 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">
            Distribución de Cambios de Estado
          </h2>
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold border-2 border-gray-300 bg-gray-50 text-gray-700">
          Total: {totalTransitions} transiciones
        </span>
      </div>

      <div className="p-6">
        <ResponsiveContainer width="100%" height={450}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={140}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={2}
            >
              {chartData.map((__, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              formatter={(value, entry: any) => (
                <span className="text-sm text-gray-700">
                  {value} ({entry.payload.value})
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Estadísticas adicionales */}
        <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Estados únicos</p>
            <p className="text-2xl font-bold text-gray-900">{chartData.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total transiciones</p>
            <p className="text-2xl font-bold text-blue-600">{totalTransitions}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Estado más común</p>
            <p className="text-sm font-bold text-gray-900 mt-2 truncate px-2">
              {chartData[0]?.name || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};