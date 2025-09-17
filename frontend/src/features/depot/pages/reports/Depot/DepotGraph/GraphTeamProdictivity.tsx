import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";

// Tipo de datos que recibe el gráfico
export type ProductivityProps = {
  teamID: number;
  completedOrders: number;
  missingItemsReported: number;
  averageProcessingTimeMinutes: number;
};

type Props = {
  data: ProductivityProps[];
};

// 🔹 Función para convertir minutos a horas y minutos
const formatMinutesToHours = (minutes: number) => {
  if (!minutes || minutes < 0) return "0h 0m";
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${mins}m`;
};

// Tooltip custom para hacerlo más prolijo
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-md border text-sm">
        <p className="font-semibold text-gray-700">Equipo: {label}</p>
        {payload.map((entry: any, index: number) => {
          let value = entry.value;
          if (entry.dataKey === "averageProcessingTimeMinutes") {
            value = formatMinutesToHours(entry.value);
          }
          return (
            <p
              key={`item-${index}`}
              className="text-gray-600"
              style={{ color: entry.color }}
            >
              {entry.name}: <span className="font-medium">{value}</span>
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

const GraphTeamProdictivity: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full h-[450px] bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        📊 Productividad de los Equipos
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
  <XAxis
    dataKey="teamID"
    label={{
      value: "Equipo",
      position: "insideBottom",
      dy: 20,
      fontSize: 14,
    }}
    tick={{ fontSize: 12, dy: 5 }}
  />

  <YAxis yAxisId="left" orientation="left" />
  <YAxis
    yAxisId="right"
    orientation="right"
    tickFormatter={(value) => formatMinutesToHours(value)}
  />

  <Tooltip content={<CustomTooltip />} />
  <Legend verticalAlign="top" height={36} />

  {/* Órdenes completadas */}
  <Bar
    yAxisId="left"
    dataKey="completedOrders"
    fill="#10B981"
    name="Órdenes Completadas"
    radius={[8, 8, 0, 0]}
  >
    <LabelList dataKey="completedOrders" position="top" fill="#10B981" fontSize={12} />
  </Bar>

  {/* Faltantes */}
  <Bar
    yAxisId="left"
    dataKey="missingItemsReported"
    fill="#EF4444"
    name="Faltantes Reportados"
    radius={[8, 8, 0, 0]}
  >
    <LabelList dataKey="missingItemsReported" position="top" fill="#EF4444" fontSize={12} />
  </Bar>

  {/* Tiempo promedio */}
  <Bar
    yAxisId="right"
    dataKey="averageProcessingTimeMinutes"
    fill="#3B82F6"
    name="Tiempo Promedio"
    radius={[8, 8, 0, 0]}
  >
    <LabelList
      position="top"
      content={(props) => {
        const { x, y, value, width } = props;

        const posX = Number(x) + Number(width) / 2;
        const posY = Number(y) - 5;
        return (
          <text
            x={posX}
            y={posY}
            fill="#3B82F6"
            textAnchor="middle"
            fontSize={12}
          >
            {formatMinutesToHours(Number(value))}
          </text>
        );
      }}
    />
  </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraphTeamProdictivity;
