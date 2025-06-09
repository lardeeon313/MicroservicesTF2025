import type React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import type { Order } from "../../../../../sales/types/OrderTypes";


const COLORS = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899"];

type Props = {
    data: Order[]
}

const GraphAverageTimeOrder: React.FC<Props> = ({data}) => {
    const chartData = data
    .filter(order => order.startedDate && order.finishDate)
    .map(order => {
      const start = new Date(order.startedDate).getTime();
      const end = new Date(order.finishDate).getTime();
      const minutes = Math.round((end - start) / 60000); // milisegundos a minutos
      return {
        name: `Pedido ${order.id}`,
        minutes,
      };
    });

    return(
    <PieChart width={400} height={400}>
      <Pie
        dataKey="minutes"
        nameKey="name"
        data={chartData}
        cx="50%"
        cy="50%"
        outerRadius={130}
        fill="#8884d8"
        label
      >
        {chartData.map((_, i) => (
          <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
    )
}

export default GraphAverageTimeOrder;