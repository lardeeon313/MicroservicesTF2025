import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, Sector } from "recharts";
import type { ArmTime } from "../DepotComponents/AverageTimeOrderTable";

const COLORS = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899"];

type Props = {
  data: ArmTime[];
};

const GraphAverageTimeOrder: React.FC<Props> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Función para convertir minutos a formato legible (igual que en la tabla)
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${Math.round(minutes)}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const chartData = data.map((item) => ({
    name: `Pedido ${item.orderId}`,
    minutes: item.averageDuration,
    formattedDuration: formatDuration(item.averageDuration),
  }));

  const hasData = chartData.length > 0;

  // Tooltip personalizado para mostrar el formato de duración
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{data.payload.name}</p>
          <p className="text-blue-600 text-sm">
            <span className="font-medium">Duración: </span>
            {data.payload.formattedDuration}
          </p>
        </div>
      );
    }
    return null;
  };

  // renderiza la porción activa más grande
  const renderActiveShape = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);

    const mx = cx + (outerRadius + 35) * cos;
    const my = cy + (outerRadius + 35) * sin;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 12}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke="#ffffff"
          strokeWidth={2}
        />
        <text 
          x={mx} 
          y={my} 
          fill="#374151" 
          textAnchor="middle" 
          dominantBaseline="central" 
          fontSize="13" 
          fontWeight="600"
          className="drop-shadow-sm"
        >
          {`${payload.name}`}
        </text>
        <text 
          x={mx} 
          y={my + 16} 
          fill="#6B7280" 
          textAnchor="middle" 
          dominantBaseline="central" 
          fontSize="12"
          fontWeight="500"
        >
          {`${payload.formattedDuration}`}
        </text>
      </g>
    );
  };

  // Función personalizada para las etiquetas del pie
  const renderLabel = (entry: any) => {
    return entry.formattedDuration;
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          Tiempo Promedio de Armado
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Distribución de duración por pedido
        </p>
      </div>

      <div className="p-6">
        <div className="h-[400px] flex justify-center items-center">
          {hasData ? (
            <PieChart width={450} height={400}>
              <Pie
                dataKey="minutes"
                nameKey="name"
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                innerRadius={40}
                fill="#8884d8"
                label={renderLabel}
                activeIndex={activeIndex ?? -1}
                activeShape={renderActiveShape}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                isAnimationActive={true}
                animationBegin={0}
                animationDuration={1500}
                animationEasing="ease-out"
                labelLine={false}
                stroke="#ffffff"
                strokeWidth={2}
              >
                {chartData.map((_, i) => (
                  <Cell 
                    key={`cell-${i}`} 
                    fill={COLORS[i % COLORS.length]}
                    className="hover:opacity-90 transition-opacity"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '12px'
                }}
              />
            </PieChart>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-600 text-lg font-medium mb-2">
                No hay datos disponibles
              </p>
              <p className="text-gray-500 text-sm">
                No se puede calcular el tiempo promedio de armado
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GraphAverageTimeOrder;