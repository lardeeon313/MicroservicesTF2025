import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  LabelList,
} from "recharts";

import type { DepotOrderDtoBilling } from "../../../../../depot/pages/reports/Billing/BillingHocks/useOrderBilled";

type Props = {
  data: DepotOrderDtoBilling[];
};

const AdminOrderBilledGraph: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) return null;

  const chartData = data.map((order) => ({
    orderId: order.salesOrderId,
    customerName: order.customerName,
    productsCount: order.productCount ?? order.items?.length ?? 0,
    totalAmount: order.totalAmount,
    orderDate: order.orderDate,
  }));

  const totalFacturado = data.reduce((sum, o) => sum + (o.totalAmount ?? 0), 0);
  const totalPedidos = data.length;
  const totalProductos = chartData.reduce((sum, o) => sum + o.productsCount, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;

      return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-xl p-4">
          <p className="text-sm font-bold text-gray-900 mb-2">
            🧾 Pedido N° {d.orderId}
          </p>

          <div className="space-y-1">
            <p className="text-xs text-gray-600">
              <span className="font-medium">Cliente:</span> {d.customerName}
            </p>

            <p className="text-xs text-gray-600">
              <span className="font-medium">Productos:</span> {d.productsCount}
            </p>

            <p className="text-xs text-gray-600">
              <span className="font-medium">Total:</span>{" "}
              ${d.totalAmount.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}
            </p>

            <p className="text-xs text-gray-500">
              📅 {new Date(d.orderDate).toLocaleDateString("es-AR")}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-lg p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Productos por Pedido
        </h2>
        <p className="text-sm text-gray-600">
          Cantidad de productos en cada pedido facturado
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-gray-600 mb-2">Total Facturado</p>
          <p className="text-3xl font-bold text-green-600">
            ${totalFacturado.toLocaleString("es-AR", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="bg-blue-50 rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-gray-600 mb-2">Total Pedidos</p>
          <p className="text-3xl font-bold text-blue-600">{totalPedidos}</p>
        </div>

        <div className="bg-purple-50 rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-gray-600 mb-2">Total Productos</p>
          <p className="text-3xl font-bold text-purple-600">{totalProductos}</p>
        </div>
      </div>

      <div className="h-[500px] bg-white rounded-xl p-4 shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 30, right: 30, left: 40, bottom: 40 }}
          >
            <defs>
              <linearGradient id="colorProducts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#fca5a5" stopOpacity={0.85} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />

            {/* ❌ ya no usamos orderId en el eje X */}
            <XAxis
              dataKey="orderId"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              stroke="#9ca3af"
            />

            <YAxis
              tick={{ fontSize: 12, fill: "#6b7280" }}
              stroke="#9ca3af"
              label={{
                value: "Cantidad de Productos",
                angle: -90,
                position: "insideLeft",
                style: { fill: "#6b7280", fontSize: 12, fontWeight: 600 },
              }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend />

            <Bar
              dataKey="productsCount"
              name="Cantidad de productos" 
              fill="url(#colorProducts)"
              radius={[8, 8, 0, 0]}
              maxBarSize={50}
              animationDuration={900}
            >
              {/* ✅ NUMERO DE PEDIDO ARRIBA DE LA BARRA */}
              <LabelList
                dataKey="orderId"
                position="top"
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  fill: "#111827",
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminOrderBilledGraph;
