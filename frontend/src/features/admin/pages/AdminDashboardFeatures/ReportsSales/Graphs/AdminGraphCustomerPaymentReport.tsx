import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TrendingUp, Package, Calculator } from "lucide-react";
import { AdminCustomerReportRow } from "../Types/CustomerPaymentType";

interface Props {
  data: AdminCustomerReportRow[];
}

/* Paleta */
const RED_PALETTE = [
  "#dc2626",
  "#ef4444",
  "#f87171",
  "#fb923c",
  "#ec4899",
  "#f43f5e",
  "#be123c",
];

const AdminGraphCustomerPaymenTypeReport: React.FC<Props> = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const paymentCount: Record<string, number> = {};

    data.forEach((customer) => {
      customer.paymentTypes.forEach((paymentType) => {
        paymentCount[paymentType] = (paymentCount[paymentType] || 0) + 1;
      });
    });

    return Object.entries(paymentCount)
      .map(([name, count], index) => ({
        name,
        cantidad: count,
        color: RED_PALETTE[index % RED_PALETTE.length],
      }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }, [data]);

  const totalCustomers = data.length;
  const totalPaymentRelations = chartData.reduce(
    (sum, item) => sum + item.cantidad,
    0
  );

  if (totalCustomers === 0) {
    return (
      <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-500">
        No hay datos suficientes para mostrar el gráfico.
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-3xl shadow-xl p-8"
      style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.08)" }}
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-red-500 mb-3">
          Distribución de Tipos de Pago
        </h2>
        <p className="text-gray-600 text-sm font-bold">
          Total de clientes analizados:{" "}
          <span className="text-red-700">{totalCustomers}</span>
        </p>
      </div>

      {/* KPIs */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Más usado */}
          <div className="bg-red-50 rounded-xl p-5 border border-red-100">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">Tipo más usado</p>
                <p className="text-2xl font-bold text-red-600">
                  {chartData[0]?.name ?? "N/A"}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-red-500" />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {chartData[0]?.cantidad ?? 0} clientes
            </p>
          </div>

          {/* Tipos activos */}
          <div className="bg-orange-50 rounded-xl p-5 border border-orange-100">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Total tipos activos
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {chartData.length}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Package className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Métodos de pago distintos
            </p>
          </div>

          {/* Promedio */}
          <div className="bg-pink-50 rounded-xl p-5 border border-pink-100">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Promedio por cliente
                </p>
                <p className="text-2xl font-bold text-pink-600">
                  {(totalPaymentRelations / totalCustomers).toFixed(1)}
                </p>
              </div>
              <div className="bg-pink-100 p-3 rounded-lg">
                <Calculator className="w-6 h-6 text-pink-500" />
              </div>
            </div>
            <p className="text-xs text-gray-500">Tipos de pago</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "#6b7280", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <YAxis
              tick={{ fill: "#6b7280", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value: number) => [value, "Clientes"]}
              cursor={{ fill: "rgba(239, 68, 68, 0.05)" }}
            />
            <Bar dataKey="cantidad" radius={[6, 6, 0, 0]} maxBarSize={60}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminGraphCustomerPaymenTypeReport;
