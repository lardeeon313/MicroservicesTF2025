import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
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

  // Transformamos datos para el gráfico de barras
  const chartData = data.map((item, index) => ({
    orderId: `#${item.orderId}`,
    minutes: item.durationMinutes,
    customer: item.customerName,
    operator: item.operatorFullName ?? "Sin asignar",
    color: COLORS[index % COLORS.length],
  }));

  // Ordenar por número de pedido ascendente
  const sortedData = [...chartData].sort((a, b) => {
    const numA = parseInt(a.orderId.replace('#', ''));
    const numB = parseInt(b.orderId.replace('#', ''));
    return numA - numB;
  });

  // Calcular estadísticas
  
  
  const maxMinutes = Math.max(...chartData.map(d => d.minutes));
  const minMinutes = Math.min(...chartData.map(d => d.minutes));

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-xl p-4 backdrop-blur-sm">
          <p className="text-sm font-bold text-gray-900 mb-2">
            Pedido {data.orderId}
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
                {data.minutes} minutos
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-lg p-8 mb-10">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Tiempo de Preparación por Pedido
        </h2>
        <p className="text-sm text-gray-600">
          Duración de armado y preparación de cada orden
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium mb-1">Total Pedidos</p>
              <p className="text-3xl font-bold text-blue-900">{data.length}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-xl border border-red-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 font-medium mb-1">Máximo</p>
              <p className="text-3xl font-bold text-red-900">{maxMinutes} min</p>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-xl border border-purple-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 font-medium mb-1">Mínimo</p>
              <p className="text-3xl font-bold text-purple-900">{minMinutes} min</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Barras */}
      <div className="w-full h-[500px] bg-white rounded-lg border border-gray-200 p-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            
            <XAxis 
              type="number" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              label={{ value: 'Minutos', position: 'insideBottom', offset: -5, style: { fontSize: '13px', fill: '#374151', fontWeight: 600 } }}
            />
            
            <YAxis 
              type="category" 
              dataKey="orderId"
              stroke="#6b7280"
              style={{ fontSize: '12px', fontWeight: 500 }}
              width={60}
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
            
            <Bar 
              dataKey="minutes" 
              radius={[0, 8, 8, 0]}
              animationBegin={0}
              animationDuration={800}
            >
              {sortedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Leyenda de colores */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 font-medium mb-3 text-center">Pedidos</p>
        <div className="flex flex-wrap justify-center gap-3">
          {sortedData.map((item, index) => (
            <div
              key={`legend-${index}`}
              className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs font-medium text-gray-700">
                {item.orderId}
              </span>
              <span className="text-xs text-gray-500">
                ({item.minutes} min)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminGraphAverageTimeOrder;