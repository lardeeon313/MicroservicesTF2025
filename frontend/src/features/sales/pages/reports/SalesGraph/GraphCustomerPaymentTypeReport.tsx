import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, Package, Calculator } from "lucide-react";

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

// Paleta de colores rojos/rosados para cada tipo de pago
const RED_PALETTE = [
  "#dc2626", // rojo fuerte
  "#ef4444", // rojo medio
  "#f87171", // rojo claro
  "#fb923c", // naranja-rojo
  "#ec4899", // rosa fuerte
  "#f43f5e", // rosa-rojo
  "#be123c", // rojo oscuro
];

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
      .map(([name, count], index) => ({
        name,
        cantidad: count,
        color: RED_PALETTE[index % RED_PALETTE.length]
      }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }, [data]);

  const totalCustomers = data.length;

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8" style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-red-500 mb-3">
          Distribución de Tipos de Pago
        </h2>
        <p className="text-gray-600 text-sm font-bold">
          Total de clientes analizados: <span className="text-red-700">{totalCustomers}</span>
        </p>
      </div>

      {/* Estadísticas resumidas */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tipo más usado */}
          <div className="bg-red-50 rounded-xl p-5 border border-red-100 relative overflow-hidden">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">Tipo más usado</p>
                <p className="text-2xl font-bold text-red-600">
                  {chartData[0]?.name || "N/A"}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-red-500" />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {chartData[0]?.cantidad || 0} clientes
            </p>
          </div>
          
          {/* Total tipos activos */}
          <div className="bg-orange-50 rounded-xl p-5 border border-orange-100 relative overflow-hidden">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">Total tipos activos</p>
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

          {/* Promedio por cliente */}
          <div className="bg-pink-50 rounded-xl p-5 border border-pink-100 relative overflow-hidden">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">Promedio por cliente</p>
                <p className="text-2xl font-bold text-pink-600">
                  {totalCustomers > 0 
                    ? (chartData.reduce((sum, item) => sum + item.cantidad, 0) / totalCustomers).toFixed(1)
                    : "0"}
                </p>
              </div>
              <div className="bg-pink-100 p-3 rounded-lg">
                <Calculator className="w-6 h-6 text-pink-500" />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Tipos de pago
            </p>
          </div>
        </div>
      </div>

      {/* Gráfico de barras */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: "#6b7280", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              angle={0}
              textAnchor="middle"
              height={80}
              interval={0}
            />
            <YAxis 
              tick={{ fill: "#6b7280", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              label={{ 
                value: "Cantidad de clientes", 
                angle: -90, 
                position: "insideLeft", 
                fill: "#6b7280",
                style: { textAnchor: "middle", fontSize: 12 }
              }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "#ffffff",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
              }}
              formatter={(value: number) => [value, "Clientes"]}
              cursor={{ fill: 'rgba(239, 68, 68, 0.05)' }}
            />
            <Bar 
              dataKey="cantidad" 
              radius={[6, 6, 0, 0]}
              maxBarSize={60}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraphCustomerPaymenTypeReport;