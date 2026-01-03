import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

// Tipos de ejemplo para la demo
export interface DeliveryIncidentReportBoolean {
  resolved: boolean;
}

interface Props {
  data: DeliveryIncidentReportBoolean[];
}

export const GraphDeliveryIncidents: React.FC<Props> = ({ data }) => {
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
            Sin incidentes
          </h2>
          <p className="text-gray-500 text-sm">
            No hay Incidentes para graficar en el período seleccionado
          </p>
        </div>
      </div>
    );
  }

  const grouped = data.reduce(
    (acc, curr) => {
      curr.resolved ? acc.resueltos++ : acc.noResueltos++;
      return acc;
    },
    { resueltos: 0, noResueltos: 0 }
  );

  const chartData = [
    { name: "Resueltos", value: grouped.resueltos },
    { name: "No Resueltos", value: grouped.noResueltos },
  ];

  const COLORS = ["#10b981", "#f97316"];
  
  const total = grouped.resueltos + grouped.noResueltos;
  const percentage = total > 0 ? ((grouped.resueltos / total) * 100).toFixed(1) : 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percent = total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : 0;
      return (
        <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{payload[0].name}</p>
          <p className="text-gray-600">
            {payload[0].value} ({percent}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="font-bold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="w-full">
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-800 text-center">
            Incidentes de Entrega
          </h3>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 font-medium">Total</p>
              <p className="text-3xl font-bold text-gray-800">{total}</p>
            </div>
            <div className="h-12 w-px bg-gray-300"></div>
            <div className="text-center">
              <p className="text-sm text-gray-600 font-medium">Tasa de Resolución</p>
              <p className="text-3xl font-bold text-emerald-600">{percentage}%</p>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              outerRadius={110}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={2}
            >
              {chartData.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              wrapperStyle={{ paddingTop: "20px" }}
              formatter={(value) => <span className="text-gray-700 font-medium">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <p className="text-sm font-medium text-gray-700">Resueltos</p>
            </div>
            <p className="text-2xl font-bold text-emerald-700 mt-1">{grouped.resueltos}</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <p className="text-sm font-medium text-gray-700">No Resueltos</p>
            </div>
            <p className="text-2xl font-bold text-orange-700 mt-1">{grouped.noResueltos}</p>
          </div>
        </div>
      </div>
    </div>
  );
};