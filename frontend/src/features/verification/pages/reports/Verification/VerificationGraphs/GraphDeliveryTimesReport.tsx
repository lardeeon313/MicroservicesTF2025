// DeliveryTimesGraph.tsx
import React, { useState } from "react";
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { DeliveryTimeReportItem } from "../../../../types/Report";

interface Props {
  data: DeliveryTimeReportItem[];
}

export const GraphDeliveryTimes: React.FC<Props> = ({ data }) => {
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

  const [activeMetric, setActiveMetric] = useState<string | null>(null);

  const chartData = data.map((d) => ({
    name: d.deliveryZoneName || `Zone ${d.deliveryZoneId}`,
    avg: Number(d.averageDeliveryTimeInHours ?? 0),
    max: Number(d.maxDeliveryTimeInHours ?? 0),
    min: Number(d.minDeliveryTimeInHours ?? 0),
    total: Number(d.totalDeliveredOrders ?? 0),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}:</span> {entry.value.toFixed(2)}
              {entry.dataKey !== 'total' && ' hrs'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleLegendClick = (dataKey: string) => {
    setActiveMetric(activeMetric === dataKey ? null : dataKey);
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <button
            key={index}
            onClick={() => handleLegendClick(entry.dataKey)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 ${
              activeMetric === null || activeMetric === entry.dataKey
                ? 'opacity-100 shadow-sm'
                : 'opacity-40'
            } hover:opacity-100 hover:shadow-md`}
            style={{
              backgroundColor: activeMetric === entry.dataKey ? `${entry.color}15` : '#f3f4f6',
              borderLeft: `3px solid ${entry.color}`
            }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-medium text-gray-700">{entry.value}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Tiempos de Entrega</h3>
          <p className="text-sm text-gray-500 mt-1">Análisis por zona de distribución</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg">
          <p className="text-xs text-blue-600 font-medium">Total de entregas</p>
          <p className="text-2xl font-bold text-blue-700">
            {chartData.reduce((acc, curr) => acc + curr.total, 0)}
          </p>
        </div>
      </div>

      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <ComposedChart 
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#1e40af" stopOpacity={0.6}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e5e7eb" 
              vertical={false}
            />
            
            <XAxis 
              dataKey="name" 
              stroke="#6b7280"
              style={{ fontSize: '12px', fontWeight: 500 }}
              tickLine={false}
            />
            
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px', fontWeight: 500 }}
              tickLine={false}
              axisLine={false}
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} />
            
            <Legend content={<CustomLegend />} />
            
            <Bar 
              dataKey="total" 
              name="Total entregas" 
              fill="url(#barGradient)"
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
              opacity={activeMetric === null || activeMetric === 'total' ? 1 : 0.3}
              animationDuration={800}
            />
            
            <Line 
              type="monotone" 
              dataKey="avg" 
              stroke="#3b82f6" 
              name="Promedio (hrs)" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, strokeWidth: 0 }}
              opacity={activeMetric === null || activeMetric === 'avg' ? 1 : 0.2}
              animationDuration={800}
            />
            
            <Line 
              type="monotone" 
              dataKey="max" 
              stroke="#ef4444" 
              name="Máximo (hrs)" 
              strokeWidth={2.5}
              strokeDasharray="5 5"
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              opacity={activeMetric === null || activeMetric === 'max' ? 1 : 0.2}
              animationDuration={800}
            />
            
            <Line 
              type="monotone" 
              dataKey="min" 
              stroke="#10b981" 
              name="Mínimo (hrs)" 
              strokeWidth={2.5}
              strokeDasharray="5 5"
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              opacity={activeMetric === null || activeMetric === 'min' ? 1 : 0.2}
              animationDuration={800}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraphDeliveryTimes;