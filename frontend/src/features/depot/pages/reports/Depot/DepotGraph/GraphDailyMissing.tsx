import React from "react";
import {BarChart,Bar,XAxis,YAxis,Tooltip,CartesianGrid,ResponsiveContainer,Label,} from "recharts";
import type { Order } from "../../../../../sales/types/OrderTypes";
import type { OrderItem } from "../../../../../sales/types/OrderTypes";

type DailyMissing = {
  orderID: Order["id"];
  ItemID: OrderItem["id"];
  MissingHour: number;
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

  const hourCountMap: { [key: string]: number } = {};

  data.forEach((item) => {
    const hour = item.MissingHour;
    hourCountMap[hour] = (hourCountMap[hour] || 0) + 1;
  });

  const chartData = Object.entries(hourCountMap).map(([hour, count]) => ({
    hour,
    count,
  }));

  return (
    <div className="w-full h-80 bg-white border rounded shadow p-4 mb-6">
      <h2 className="text-lg font-semibold mb-2">Faltantes por Hora</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour">
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
          <Tooltip />
          <Bar dataKey="count" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraphDailyMissing;
