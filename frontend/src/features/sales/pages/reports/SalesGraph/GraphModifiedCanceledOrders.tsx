import React from "react";
import type { Order } from "../../../types/OrderTypes";
import { OrderStatus } from "../../../types/OrderTypes";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

interface Props {
  orders: Order[];
}

const GraphModifiedCanceledOrders: React.FC<Props> = ({ orders }) => {
  const filteredOrders = orders.filter(
    (order) =>
      order.status === OrderStatus.Canceled ||
      order.status === OrderStatus.Modified
  );

  // Contar por estado
  const countByStatus = {
    Cancelado: filteredOrders.filter((o) => o.status === OrderStatus.Canceled).length,
    Modificado: filteredOrders.filter((o) => o.status === OrderStatus.Modified).length,
  };

  const ChartData = [
    { estado: "Cancelado", cantidad: countByStatus.Cancelado },
    { estado: "Modificado", cantidad: countByStatus.Modificado },
  ];

  // Colores asignados por estado
  const COLORS: Record<string, string> = {
    Cancelado: "#ef4444",   // rojo
    Modificado: "#3b82f6",  // azul
  };

  return (
    <div className="w-full h-80 bg-white rounded-xl shadow-md p-4">
      <h2 className="text-lg font-semibold text-center text-red-600 mb-4">
        Pedidos Cancelados vs Modificados
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={ChartData}>
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
          <XAxis dataKey="estado" stroke="#374151" />
          <YAxis allowDecimals={false} stroke="#374151" />
          <Tooltip
            contentStyle={{ backgroundColor: "#1e3a8a", border: "none", color: "white" }}
            labelStyle={{ color: "white" }}
            itemStyle={{ color: "white" }}
          />
          <Legend
            formatter={(value) => (value === "cantidad" ? "Cantidad" : value)}
            wrapperStyle={{ color: "#374151" }}
          />
          <Bar dataKey="cantidad" name="Cantidad">
            {ChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.estado]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraphModifiedCanceledOrders;

