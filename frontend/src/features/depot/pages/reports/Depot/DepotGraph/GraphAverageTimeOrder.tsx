import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, Sector } from "recharts";
import type { ArmTime } from "../DepotComponents/AverageTimeOrderTable";

const COLORS = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899"];

type Props = {
  data: ArmTime[];
};

const GraphAverageTimeOrder: React.FC<Props> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const chartData = data.map((item) => ({
    name: `Pedido ${item.orderId}`,
    minutes: item.averageDuration,
  }));

  const hasData = chartData.length > 0;

  // renderiza la porción activa más grande
  const renderActiveShape = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10} // agrandar un poco el sector activo
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <text x={mx} y={my} fill={fill} textAnchor="middle" dominantBaseline="central">
          {`${payload.name} (${value})`}
        </text>
      </g>
    );
  };

  return (
    <div className="w-full h-[400px] flex justify-center items-center bg-gray-100 rounded-xl shadow-inner">
      {hasData ? (
        <PieChart width={420} height={420}>
          <Pie
            dataKey="minutes"
            nameKey="name"
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={130}
            fill="#8884d8"
            label
            activeIndex={activeIndex ?? -1}
            activeShape={renderActiveShape}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            isAnimationActive={true}
            animationBegin={0}
            animationDuration={2000}
            animationEasing="ease-in-out"
          >
            {chartData.map((_, i) => (
              <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      ) : (
        <div className="text-center text-gray-600 text-lg">
          No hay datos disponibles para calcular el tiempo promedio de armado.
        </div>
      )}
    </div>
  );
};

export default GraphAverageTimeOrder;
