import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

// Colores para cada tipo de pago
const PAYMENT_COLORS: Record<string, string> = {
  "Transferencia": "#3b82f6",
  "Tarjeta de crédito": "#8b5cf6", 
  "Tarjeta de débito": "#ec4899",
  "Efectivo": "#10b981",
  "Cuenta corriente": "#f59e0b",
  "Cheque": "#06b6d4",
  "Pagaré": "#6366f1"
};

interface CustomerReportRow {
  customerId: string;
  nroCustomer: string;
  fullName: string;
  paymentTypes: string[];
  address: string;
}

interface Props {
  data: CustomerReportRow[];
}

const GraphCustomerPaymenTypeReport: React.FC<Props> = ({ data }) => {
  // Calcular frecuencia de cada tipo de pago
  const chartData = useMemo(() => {
    const paymentCount: Record<string, number> = {};

    data.forEach((customer) => {
      customer.paymentTypes.forEach((paymentType) => {
        paymentCount[paymentType] = (paymentCount[paymentType] || 0) + 1;
      });
    });

    // Convertir a array y ordenar por cantidad (descendente)
    return Object.entries(paymentCount)
      .map(([name, count]) => ({
        name,
        cantidad: count,
        color: PAYMENT_COLORS[name] || "#94a3b8"
      }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }, [data]);

  const totalCustomers = data.length;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Distribución de Tipos de Pago
        </h2>
        <p className="text-gray-600">
          Total de clientes analizados: <span className="font-semibold text-red-600">{totalCustomers}</span>
        </p>
      </div>

      {/* Gráfico de barras */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fill: "#4b5563", fontSize: 12 }}
          />
          <YAxis 
            tick={{ fill: "#4b5563", fontSize: 12 }}
            label={{ value: "Cantidad de clientes", angle: -90, position: "insideLeft", fill: "#4b5563" }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
            }}
            formatter={(value: number) => [`${value} clientes`, "Cantidad"]}
          />
          <Legend 
            wrapperStyle={{ paddingTop: "20px" }}
            formatter={() => "Cantidad de clientes"}
          />
          <Bar 
            dataKey="cantidad" 
            radius={[8, 8, 0, 0]}
            maxBarSize={80}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Estadísticas resumidas */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Tipo más usado</p>
            <p className="text-xl font-bold text-blue-600">
              {chartData[0]?.name || "N/A"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {chartData[0]?.cantidad || 0} clientes
            </p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total tipos activos</p>
            <p className="text-xl font-bold text-green-600">
              {chartData.length}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Métodos de pago distintos
            </p>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Promedio por cliente</p>
            <p className="text-xl font-bold text-purple-600">
              {totalCustomers > 0 
                ? (chartData.reduce((sum, item) => sum + item.cantidad, 0) / totalCustomers).toFixed(1)
                : "0"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Tipos de pago
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphCustomerPaymenTypeReport;