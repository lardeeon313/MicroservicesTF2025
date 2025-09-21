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

// Tooltip custom para hacerlo más prolijo
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-md border text-sm">
        <p className="font-semibold text-gray-700">Equipo: {label}</p>
        {payload.map((entry: any, index: number) => (
          <p
            key={`item-${index}`}
            className="text-gray-600"
            style={{ color: entry.color }}
          >
            {entry.name}: <span className="font-medium">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const GraphTeamProdictivity: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full h-[450px] bg-white rounded-2xl shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-600   mb-4 text-center">
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
              dy: 10,
              fontSize: 14,
            }}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} />

          {/* Órdenes completadas */}
          <Bar
            dataKey="completedOrders"
            fill="#10B981"
            name="Órdenes Completadas"
            radius={[8, 8, 0, 0]}
          >
            <LabelList dataKey="completedOrders" position="top" fill="#10B981" />
          </Bar>

          {/* Faltantes */}
          <Bar
            dataKey="missingItemsReported"
            fill="#EF4444"
            name="Faltantes Reportados"
            radius={[8, 8, 0, 0]}
          >
            <LabelList
              dataKey="missingItemsReported"
              position="top"
              fill="#EF4444"
            />
          </Bar>

          {/* Tiempo promedio */}
          <Bar
            dataKey="averageProcessingTimeMinutes"
            fill="#3B82F6"
            name="Tiempo Promedio (min)"
            radius={[8, 8, 0, 0]}
          >
            <LabelList
              dataKey="averageProcessingTimeMinutes"
              position="top"
              fill="#3B82F6"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraphTeamProdictivity;
