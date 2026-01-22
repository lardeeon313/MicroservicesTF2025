import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Users } from "lucide-react";

interface OperatorCompletedCount {
  operatorName: string;
  count: number;
}

interface Props {
  data: OperatorCompletedCount[];
}

export const AdminGraphOrderCompletedDay: React.FC<Props> = ({ data }) => {
  // Ordenar datos de mayor a menor para mejor visualización
  const sortedData = [...data].sort((a, b) => b.count - a.count);
  const totalOperators = data.length;

  // Colores profesionales en gradiente rojo y verde
  const colors = [
    "#151e99ff", // red-600
    "#2e63d6ff", // red-500
    "#1091b9ff", // green-500
    "#195fa0ff", // red-400
    "#31a178ff", // green-400
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-1">
            {payload[0].payload.operatorName}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium text-red-600">{payload[0].value}</span>
            {" "}{payload[0].value === 1 ? "pedido" : "pedidos"}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400 mb-3" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
            />
          </svg>
          <p className="text-sm italic">No hay datos para mostrar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Card de Total de Operarios */}
      <div className="flex justify-center mb-6">
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 relative overflow-hidden w-80 transition-all duration-300 hover:shadow-lg cursor-pointer">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600 mb-2">Total de Operarios</p>
              <p className="text-3xl font-bold text-black-600">
                {totalOperators}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="w-7 h-7 text-white-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e5e7eb" 
              horizontal={true}
              vertical={false}
            />
            <XAxis 
              type="number" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickLine={false}
            />
            <YAxis 
              type="category" 
              dataKey="operatorName" 
              stroke="#6b7280"
              style={{ fontSize: '13px', fontWeight: '500' }}
              width={120}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
            <Bar 
              dataKey="count" 
              radius={[0, 8, 8, 0]}
              maxBarSize={50}
            >
              {sortedData.map((__, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};