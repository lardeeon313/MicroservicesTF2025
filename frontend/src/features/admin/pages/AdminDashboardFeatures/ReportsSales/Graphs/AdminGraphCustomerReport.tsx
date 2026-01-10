import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users } from "lucide-react";

// Tipos simulados para el ejemplo
interface AdminCustomerReportItem {
  fullName: string;
  orderCount: number;
}

interface Props {
  data: AdminCustomerReportItem[];
}

export default function AdminGraphCustomerReport({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500">
          No hay datos suficientes para mostrar el gráfico
        </p>
      </div>
    );
  }

  const totalCustomers = data.length;

  return (
    <div className="max-w-full mt-20 mb-20">
      {/* Header con gradiente y línea decorativa */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-rose-400 bg-clip-text text-transparent mb-3">
          Cantidad de Pedidos por Cliente
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-rose-400 mx-auto rounded-full mb-2"></div>
        <p className="text-gray-600 text-sm">Análisis de actividad por cliente</p>
      </div>

      {/* Container del gráfico con diseño premium */}
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
        
        {/* Decoración superior */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-rose-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <div className="bg-gradient-to-r from-red-50 to-rose-50 px-3 py-1 rounded-full">
            <span className="text-sm text-red-700 font-medium">
              📊 Dashboard
            </span>
          </div>
        </div>

        {/* Card de Total de Clientes */}
        <div className="flex justify-center mb-8">
          <div className="bg-red-50 rounded-xl p-6 border border-red-100 relative overflow-hidden w-80">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">Total de Clientes</p>
                <p className="text-3xl font-bold text-red-600">
                  {totalCustomers}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <Users className="w-7 h-7 text-red-500" />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Clientes con pedidos registrados
            </p>
          </div>
        </div>

        {/* Gráfico mejorado */}
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            className="drop-shadow-sm"
          >
            <defs>
              {/* Gradiente para las barras */}
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#DC2626" stopOpacity={0.9} />
                <stop offset="50%" stopColor="#EF4444" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#F87171" stopOpacity={0.7} />
              </linearGradient>

              {/* Sombra */}
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3" />
              </filter>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              opacity={0.8}
            />

            <XAxis
                dataKey="fullName"
                tick={{ fontSize: 12, fill: "#64748b" }}
                height={60}
                interval={0}
            />

            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={{ stroke: "#e2e8f0" }}
            />

            {/* Tooltip modificado para mostrar "Cantidad de pedidos" */}
            <Tooltip
              formatter={(value) => [`${value}`, "Cantidad de pedidos"]}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                fontSize: "14px",
              }}
              labelStyle={{ color: "#1f2937", fontWeight: "bold" }}
              cursor={{ fill: "rgba(239, 68, 68, 0.1)" }}
            />

            <Bar
              dataKey="orderCount"
              fill="url(#barGradient)"
              radius={[4, 4, 0, 0]}
              filter="url(#shadow)"
              className="hover:opacity-80 transition-opacity duration-200"
              barSize={80}
              maxBarSize={100}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}