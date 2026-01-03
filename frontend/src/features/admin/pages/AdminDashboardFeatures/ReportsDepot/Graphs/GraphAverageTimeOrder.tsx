import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { OrderProcessingTime } from "../Hocks/useAdminAverageTimeOrder";

interface Props {
  data: OrderProcessingTime[];
}

const AdminGraphAverageTimeOrder: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) return null;

  // Paleta de colores profesional y moderna
  const COLORS = [
    "#3b82f6", // Azul
    "#8b5cf6", // Púrpura
    "#ec4899", // Rosa
    "#f59e0b", // Ámbar
    "#10b981", // Verde
    "#ef4444", // Rojo
    "#06b6d4", // Cian
    "#f97316", // Naranja
    "#6366f1", // Índigo
    "#14b8a6", // Teal
  ];

  // Transformamos datos para el gráfico de torta
  const chartData = data.map((item, index) => ({
    name: `Pedido #${item.orderId}`,
    value: item.durationMinutes,
    customer: item.customerName,
    operator: item.operatorFullName ?? "Sin asignar",
    color: COLORS[index % COLORS.length],
  }));

  // Calcular total de minutos
  const totalMinutes = chartData.reduce((sum, item) => sum + item.value, 0);

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalMinutes) * 100).toFixed(1);
      
      return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-xl p-4 backdrop-blur-sm">
          <p className="text-sm font-bold text-gray-900 mb-2">
            {data.name}
          </p>
          <div className="space-y-1">
            <p className="text-xs text-gray-600">
              <span className="font-medium">Cliente:</span> {data.customer}
            </p>
            <p className="text-xs text-gray-600">
              <span className="font-medium">Operario:</span> {data.operator}
            </p>
            <div className="pt-2 mt-2 border-t border-gray-100">
              <p className="text-sm font-semibold" style={{ color: data.color }}>
                {data.value} minutos
              </p>
              <p className="text-xs text-gray-500">
                {percentage}% del total
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Label personalizado para mostrar porcentajes
  const renderLabel = (entry: any) => {
    const percentage = ((entry.value / totalMinutes) * 100).toFixed(0);
    return `${percentage}%`;
  };

  return (
    <div className="w-full bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-lg p-8 mb-10">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Distribución del Tiempo de Preparación
        </h2>
        <p className="text-sm text-gray-600">
          Proporción del tiempo invertido en cada pedido
        </p>
        <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-100">
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-semibold text-blue-900">
            Total: {totalMinutes} minutos
          </span>
        </div>
      </div>

      {/* Gráfico */}
      <div className="w-full h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              {chartData.map((entry, index) => (
                <linearGradient
                  key={`gradient-${index}`}
                  id={`gradient-${index}`}
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                  <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
                </linearGradient>
              ))}
            </defs>
            
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={{
                stroke: '#94a3b8',
                strokeWidth: 1,
              }}
              label={renderLabel}
              outerRadius={140}
              innerRadius={70}
              paddingAngle={3}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {chartData.map((__, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#gradient-${index})`}
                  stroke="#fff"
                  strokeWidth={2}
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </Pie>
            
            <Tooltip content={<CustomTooltip />} />
            
            <Legend
              verticalAlign="bottom"
              height={36}
              content={({ payload }) => (
                <div className="flex flex-wrap justify-center gap-3 mt-6">
                  {payload?.map((entry: any, index: number) => (
                    <div
                      key={`legend-${index}`}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-xs font-medium text-gray-700">
                        {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>


      {/* Stats footer */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-center gap-16">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Pedidos</p>
            <p className="text-lg font-bold text-gray-900">{data.length}</p>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Máximo</p>
            <p className="text-lg font-bold text-gray-900">
              {Math.max(...chartData.map(d => d.value))} min
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminGraphAverageTimeOrder;
