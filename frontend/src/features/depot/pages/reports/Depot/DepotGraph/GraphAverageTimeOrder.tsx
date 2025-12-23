/*import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, Sector } from "recharts";
import type { ArmTime } from "../DepotComponents/AverageTimeOrderTable";

// Gradientes modernos más vibrantes
const COLORS = [
  "#FF6B6B", // Coral vibrante
  "#4ECDC4", // Turquesa
  "#45B7D1", // Azul cielo
  "#96CEB4", // Verde menta
  "#FFEAA7", // Amarillo suave
  "#DDA0DD", // Lavanda
  "#98D8C8", // Verde agua
  "#F7DC6F", // Oro suave
  "#BB8FCE", // Púrpura suave
  "#85C1E9"  // Azul claro
];

type Props = {
  data: ArmTime[];
};

const GraphAverageTimeOrder: React.FC<Props> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Formato de duración
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${Math.round(minutes)}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  // Agrupamos por orderId y sumamos las duraciones
const grouped = data.reduce<Record<number, { orderId: number; total: number; count: number }>>((acc, item) => {
  if (!item.orderId) return acc;
  if (!acc[item.orderId]) {
    acc[item.orderId] = { orderId: item.orderId, total: 0, count: 0 };
  }
  acc[item.orderId].total += item.averageDuration;
  acc[item.orderId].count += 1;
  return acc;
}, {});

// Convertimos a un array para el gráfico
const chartData = Object.values(grouped).map((g) => {
  const avg = g.total / g.count;
  return {
    name: `Pedido ${g.orderId}`,
    minutes: avg,
    formattedDuration: formatDuration(avg),
  };
});

  const hasData = chartData.length > 0;

  // Tooltip personalizado con diseño moderno
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-sm px-5 py-4 rounded-2xl shadow-2xl border-0 ring-1 ring-black/10 transform transition-all duration-200">
          <div className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full shadow-sm" 
              style={{ backgroundColor: payload[0].color }}
            ></div>
            <p className="font-bold text-gray-800 text-lg">{d.name}</p>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-blue-600 font-semibold text-base">
              {d.formattedDuration}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Slice activo con animación mejorada
  const renderActiveShape = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);

    const mx = cx + (outerRadius + 45) * cos;
    const my = cy + (outerRadius + 45) * sin;

    return (
      <g>
        {/* Slice principal con glow effect 
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 15}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          style={{
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
            transition: 'all 0.3s ease'
          }}
        />
        
        {/* Label con fondo redondeado 
        <g>
          <rect
            x={mx - 60}
            y={my - 20}
            width={120}
            height={40}
            rx={12}
            ry={12}
            fill="rgba(255,255,255,0.95)"
            stroke={fill}
            strokeWidth={2}
            style={{
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))'
            }}
          />
          <text x={mx} y={my - 4} textAnchor="middle" fill="#1F2937" fontSize={13} fontWeight={700}>
            {payload.name}
          </text>
          <text x={mx} y={my + 10} textAnchor="middle" fill="#6366F1" fontSize={12} fontWeight={600}>
            {payload.formattedDuration}
          </text>
        </g>
      </g>
    );
  };

  return (
    <div className="w-full bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-3xl shadow-2xl border-0 ring-1 ring-gray-200/50 overflow-hidden backdrop-blur-sm">
      {/* Header con gradiente dinámico 
      <div className="px-8 py-6 bg-gradient-to-r from-red-500 via-red-600 to-red-700 relative overflow-hidden">
        {/* Patrón de fondo sutil 
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Tiempo Promedio de Armado
              </h2>
              <p className="text-red-100 mt-1 font-medium">
                Distribución de duración por pedido
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido del gráfico 
      <div className="p-8">
        <div className="h-[450px] flex justify-center items-center relative">
          {hasData ? (
            <div className="relative">
              {/* Efecto de glow sutil detrás del gráfico 
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-indigo-400/10 rounded-full blur-3xl scale-150"></div>
              
              <PieChart width={500} height={450}>
                <defs>
                  {/* Gradientes para cada slice 
                  {COLORS.map((color, index) => (
                    <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                      <stop offset="100%" stopColor={color} stopOpacity={1} />
                    </linearGradient>
                  ))}
                </defs>
                
                <Pie
                  dataKey="minutes"
                  nameKey="name"
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={140}
                  innerRadius={55}
                  label={(entry) => entry.formattedDuration}
                  activeIndex={activeIndex ?? -1}
                  activeShape={renderActiveShape}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  labelLine={false}
                  animationBegin={0}
                  animationDuration={1200}
                  animationEasing="ease-out"
                >
                  {chartData.map((_, i) => (
                    <Cell 
                      key={`cell-${i}`} 
                      fill={`url(#gradient-${i % COLORS.length})`}
                      stroke="rgba(255,255,255,0.8)"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ 
                    paddingTop: "30px", 
                    fontSize: "13px",
                    fontWeight: "600"
                  }}
                  iconType="circle"
                />
              </PieChart>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-xl font-semibold text-gray-600 mb-2">No hay datos disponibles</p>
              <p className="text-gray-500">Los datos aparecerán aquí cuando estén disponibles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GraphAverageTimeOrder; */ 