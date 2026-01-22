import React from 'react';
import { CustomerSatisfactionLevel } from '../../../../admin/pages/AdminDashboardFeatures/ReportsSales/Types/CustomerSatisfactionType';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";


interface AdminCustomerSatisfactionReportItem {
  score: number;
}

interface Props {
  data: AdminCustomerSatisfactionReportItem[];
}

const SatisfactionLabels: Record<number, string> = {
  1: "Muy Malo",
  2: "Malo",
  3: "Regular",
  4: "Bueno",
  5: "Excelente",
};

// Colores profesionales con gradiente de rojo a verde
const COLORS = {
  1: "#EF4444", // Rojo
  2: "#F97316", // Naranja
  3: "#EAB308", // Amarillo
  4: "#84CC16", // Lima
  5: "#22C55E", // Verde
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm font-semibold text-gray-900">{payload[0].payload.name}</p>
        <p className="text-sm text-gray-600 mt-1">
          Respuestas: <span className="font-bold text-gray-900">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export const GraphSatisfactionCustomerSatisfaction: React.FC<Props> = ({ data }) => {
  
  // Si no hay datos, mostrar mensaje
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="w-full h-full flex flex-col items-center justify-center py-12">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center max-w-md">
            <div className="text-6xl mb-4 opacity-40">📊</div>
            <h4 className="text-xl font-semibold text-gray-700 mb-2">
              Sin datos disponibles
            </h4>
            <p className="text-gray-500 text-sm leading-relaxed">
              No hay datos de satisfacción del cliente para mostrar en este momento.<br/>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const counts: Record<CustomerSatisfactionLevel, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  data.forEach((d) => {
    if (d.score >= 1 && d.score <= 5) {
      counts[d.score as CustomerSatisfactionLevel]++;
    }
  });

  const chartData = Object.entries(SatisfactionLabels).map(
    ([value, label]) => ({
      name: label,
      cantidad: counts[Number(value) as CustomerSatisfactionLevel],
      nivel: Number(value),
    })
  );

  const totalResponses = data.length;
  const averageScore = totalResponses > 0 
    ? (data.reduce((sum, d) => sum + d.score, 0) / totalResponses).toFixed(1)
    : "0";

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Distribución de Satisfacción del Cliente
        </h3>
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Total de respuestas:</span>
            <span className="font-semibold text-gray-900">{totalResponses}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Puntuación promedio:</span>
            <span className="font-semibold text-gray-900">{averageScore}/5</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart 
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis 
            allowDecimals={false}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={{ stroke: '#E5E7EB' }}
            label={{ value: 'Número de respuestas', angle: -90, position: 'insideLeft', style: { fill: '#6B7280', fontSize: 12 } }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
          <Bar 
            dataKey="cantidad" 
            radius={[8, 8, 0, 0]}
            maxBarSize={80}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.nivel as CustomerSatisfactionLevel]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 flex justify-center gap-4 flex-wrap">
        {Object.entries(SatisfactionLabels).map(([value, label]) => (
          <div key={value} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[Number(value) as CustomerSatisfactionLevel] }}
            />
            <span className="text-xs text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};