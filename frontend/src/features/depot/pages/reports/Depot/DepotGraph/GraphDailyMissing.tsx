import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Label,
  Cell,
} from "recharts";

type DailyMissing = {
  orderID: number;
  ItemID: number;
  MissingDate: string;
};

type Props = {
  data: DailyMissing[];
};


const GraphDailyMissing: React.FC<Props> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 mt-10">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Faltantes por hora del día
          </h2>
          <p className="text-gray-500 text-sm">
            No hay datos para graficar en el período seleccionado
          </p>
        </div>
      </div>
    );
  }

  // Contador de faltantes por hora
  const hourCountMap: { [key: number]: number } = {};
  data.forEach((item) => {
    const date = new Date(item.MissingDate);
    const hour = date.getHours();
    hourCountMap[hour] = (hourCountMap[hour] || 0) + 1;
  });

  // Preparamos datos para las 24 horas
  const chartData = Array.from({ length: 24 }, (_, h) => ({
    hour: h,
    count: hourCountMap[h] || 0,
  }));

  // Paleta de colores más moderna
  const COLORS = [
    "#3B82F6", "#1D4ED8", "#2563EB", "#1E40AF", "#1E3A8A",
    "#60A5FA", "#93C5FD", "#DBEAFE", "#3B82F6", "#2563EB"
  ];

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-800">
            {`Hora: ${label.toString().padStart(2, "0")}:00`}
          </p>
          <p className="text-blue-600 font-semibold">
            {`${payload[0].value} faltantes`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          Faltantes por Hora del Día
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Distribución horaria de productos faltantes
        </p>
      </div>
      
      <div className="p-6">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              barCategoryGap="15%"
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#f1f5f9" 
                vertical={false}
              />
              <XAxis
                dataKey="hour"
                tickFormatter={(h) => `${h.toString().padStart(2, "0")}h`}
                interval={1}
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={{ stroke: "#e2e8f0" }}
              />
              <YAxis 
                allowDecimals={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={{ stroke: "#e2e8f0" }}
              >
                <Label
                  value="Cantidad de Faltantes"
                  angle={-90}
                  position="insideLeft"
                  style={{ textAnchor: "middle", fill: "#64748b", fontSize: "12px" }}
                />
              </YAxis>
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                radius={[4, 4, 0, 0]}
                stroke="#e2e8f0"
                strokeWidth={1}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={index} 
                    fill={entry.count > 0 ? COLORS[index % COLORS.length] : "#f1f5f9"}
                    className="hover:opacity-80 transition-opacity"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GraphDailyMissing;