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
      <div className="w-full bg-white border rounded shadow p-6 mt-10">
        <h2 className="text-center text-xl font-semibold text-gray-800">
          Faltantes por hora del día
        </h2>
        <p className="text-center text-gray-500 mt-6 italic">
          No hay datos para graficar.
        </p>
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

  const COLORS = ["#3B82F6", "#60A5FA", "#2563EB"];

  return (
    <div className="w-full h-96 bg-white border rounded shadow p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Faltantes por Hora
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="hour"
            tickFormatter={(h) => `${h.toString().padStart(2, "0")}h`}
            interval={0} // 👈 fuerza a mostrar todas las horas
            tick={{ fontSize: 12, fill: "#374151" }}
          >
            <Label value="Hora" offset={-5} position="insideBottom" />
          </XAxis>
          <YAxis allowDecimals={false}>
            <Label
              value="Cantidad"
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: "middle" }}
            />
          </YAxis>
          <Tooltip
            formatter={(value) => [`${value} faltantes`, "Cantidad"]}
            labelFormatter={(label) => `Hora: ${label.toString().padStart(2, "0")}h`}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraphDailyMissing;
