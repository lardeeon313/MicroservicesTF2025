import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { DepotOrderDtoBilling } from "../BillingHocks/useOrderBilled";

type Props = {
  data: DepotOrderDtoBilling[];
};

const OrderBilledGraph: React.FC<Props> = ({ data }) => {
  if (data.length === 0) return null;

  // Generar etiquetas limpias y en varias líneas
  const chartData = data.map((order) => ({
    name: [order.customerName || "Sin nombre", order.orderId ? `ID: ${order.orderId}` : ""],
    amount: order.totalAmount ?? 0,
  }));

  return (
    <div className="h-72 mt-6 bg-white rounded shadow p-4">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Monto facturado por pedido
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name"
            angle={0}        // Se elimina inclinación, ya que ahora se parte en varias líneas
            textAnchor="middle"
            interval={0}
            height={80}
          />
          <YAxis />
          <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
          <Bar dataKey="amount" fill="#4F46E5" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrderBilledGraph;
