import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { DeliveryTimeReportItem } from "../../../../types/Report";

interface Props {
  data: DeliveryTimeReportItem[];
}

export const GraphDeliveryTimes: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 mt-10">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Sin pedidos</h2>
          <p className="text-gray-500 text-sm">
            No se encontraron pedidos para las fechas o filtros seleccionados.
          </p>
        </div>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: d.deliveryZoneName || `Zone ${d.deliveryZoneId}`,
    promedio: Number(d.averageDeliveryTimeInHours ?? 0),
    maximo: Number(d.maxDeliveryTimeInHours ?? 0),
    minimo: Number(d.minDeliveryTimeInHours ?? 0),
    total: Number(d.totalDeliveredOrders ?? 0),
  }));

  const totalEntregas = chartData.reduce((acc, curr) => acc + curr.total, 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}:</span>{" "}
              {entry.value.toFixed(2)} hrs
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Tiempos de Entrega</h3>
          <p className="text-sm text-gray-500 mt-1">Análisis por zona de distribución</p>
        </div>
        <div className="bg-blue-500 text-white px-4 py-3 rounded-lg text-center min-w-[120px]">
          <p className="text-xs opacity-90">Total de entregas</p>
          <p className="text-2xl font-bold">{totalEntregas}</p>
        </div>
      </div>

      {/* Chart */}
      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              label={{ 
                value: "Horas", 
                angle: -90, 
                position: "insideLeft", 
                fill: "#9ca3af",
                fontSize: 12
              }}
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 0, 0, 0.04)" }} />
            
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              iconType="circle"
              formatter={(value) => (
                <span className="text-sm text-gray-600">{value}</span>
              )}
            />
            
            <Bar
              dataKey="promedio"
              name="Promedio (hrs)"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              maxBarSize={80}
            />
            
            <Bar
              dataKey="maximo"
              name="Máximo (hrs)"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
              maxBarSize={80}
            />
            
            <Bar
              dataKey="minimo"
              name="Mínimo (hrs)"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              maxBarSize={80}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraphDeliveryTimes;