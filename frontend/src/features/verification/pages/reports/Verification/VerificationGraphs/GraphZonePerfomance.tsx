import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  
} from "recharts";
import { ZonePerformanceReport } from "../../../../types/Report";

interface Props {
  data: ZonePerformanceReport[];
}

// Colores modernos y accesibles
const COLORS = {
  success: "#10b981", // green-500
  incident: "#f59e0b", // amber-500
  rejection: "#ef4444", // red-500
};

// Tooltip personalizado
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            <span className="font-medium">{entry.name}:</span> {entry.value.toFixed(2)}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const GraphZonePerformance: React.FC<Props> = ({ data }) => {
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

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mt-8 border border-gray-100">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Tasa de éxito de entrega por zona
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Análisis comparativo de rendimiento
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <BarChart 
          data={data} 
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          barGap={8}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          
          <XAxis 
            dataKey="deliveryZoneName" 
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            stroke="#d1d5db"
          />
          
          <YAxis 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            stroke="#d1d5db"
            label={{ 
              value: 'Porcentaje (%)', 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: '#6b7280', fontSize: 12 }
            }}
          />
          
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
          
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
            formatter={(value) => <span className="text-sm text-gray-700">{value}</span>}
          />
          
          <Bar 
            dataKey="deliverySuccessRatePercent" 
            name="Éxito" 
            fill={COLORS.success}
            radius={[8, 8, 0, 0]}
            maxBarSize={60}
          />
          
          <Bar 
            dataKey="incidentRatePercent" 
            name="Incidentes" 
            fill={COLORS.incident}
            radius={[8, 8, 0, 0]}
            maxBarSize={60}
          />
          
          <Bar 
            dataKey="rejectionRatePercent" 
            name="Rechazos" 
            fill={COLORS.rejection}
            radius={[8, 8, 0, 0]}
            maxBarSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};