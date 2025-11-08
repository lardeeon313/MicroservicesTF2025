import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Simular la interfaz CustomerIncidentReport
interface CustomerIncidentReport {
  customerName: string;
  totalIncidents: number;
}

interface Props {
  data: CustomerIncidentReport[];
}

const COLORS = ["#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#3B82F6", "#EF4444"];

// Función de etiqueta personalizada (no un componente React)
const renderCustomLabel = (props: any) => {
  const { cx, cy, midAngle, outerRadius, percent, name, value } = props;
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 30;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Solo mostrar si el porcentaje es mayor al 3%
  if (percent < 0.03) return null;

  return (
    <text
      x={x}
      y={y}
      fill="#1F2937"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      style={{ fontSize: "14px", fontWeight: "600" }}
    >
      {`${name}: ${value}`}
    </text>
  );
};

export const GraphCustomersWithIncidents: React.FC<Props> = ({ data }) => {
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
            Clientes inexistentes
          </h2>
          <p className="text-gray-500 text-sm">
            No hay datos para graficar en el período seleccionado
          </p>
        </div>
      </div>
    );
  }

  // Ordenamos de mayor a menor cantidad de incidentes y tomamos los top 6
  const chartData = data
    .sort((a, b) => b.totalIncidents - a.totalIncidents)
    .slice(0, 6)
    .map((item) => ({
      name: item.customerName,
      value: item.totalIncidents,
    }));

  return (
    <div className="mt-12 p-8 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border border-gray-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          Clientes con Mayor Cantidad de Incidentes
        </h2>
        <p className="text-sm text-gray-500 text-center mt-2">
          Top 6 clientes por volumen de incidentes reportados
        </p>
      </div>

      <ResponsiveContainer width="100%" height={450}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={{
              stroke: "#9CA3AF",
              strokeWidth: 1.5,
              strokeDasharray: "5 5"
            }}
            outerRadius={140}
            fill="#8884d8"
            dataKey="value"
            label={renderCustomLabel}
            paddingAngle={2}
            animationBegin={0}
            animationDuration={800}
          >
            {chartData.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                stroke="#fff"
                strokeWidth={3}
                style={{
                  filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))",
                  transition: "all 0.3s ease"
                }}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.98)",
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
              padding: "12px 16px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
              backdropFilter: "blur(10px)"
            }}
            itemStyle={{
              color: "#374151",
              fontWeight: "600",
              fontSize: "14px"
            }}
            formatter={(value: number) => [`${value} incidentes`, "Total"]}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            wrapperStyle={{ 
              paddingTop: "30px",
              fontSize: "14px"
            }}
            formatter={(value) => (
              <span style={{ 
                fontSize: "14px", 
                color: "#4B5563",
                fontWeight: "500"
              }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};