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
} from "recharts";

import type { Billing } from "../../../../../depot/billingmanager/types/BillingType";

type Props = {
  data: {
    BillingDate: Billing["orderDate"];
    TotalAmount: Billing["totalAmount"];
  }[];
};

const AdminGraphCustomerIncome: React.FC<Props> = ({ data }) => {
  const resume = data.reduce((acc, curr) => {
    // Parseo seguro de fecha
    const fechaObj = new Date(curr.BillingDate);
    const fecha = isNaN(fechaObj.getTime())
      ? String(curr.BillingDate)
      : fechaObj.toLocaleDateString("es-AR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

    const existente = acc.find((d) => d.fecha === fecha);
    if (existente) {
      existente.total += curr.TotalAmount;
    } else {
      acc.push({ fecha, total: curr.TotalAmount });
    }
    return acc;
  }, [] as { fecha: string; total: number }[]);

  // Calcular estadísticas
  const totalGeneral = resume.reduce((sum, item) => sum + item.total, 0);
  const promedio = totalGeneral / resume.length;

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const porcentaje = ((data.value / totalGeneral) * 100).toFixed(1);
      
      return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-xl p-4 backdrop-blur-sm">
          <p className="text-sm font-bold text-gray-900 mb-2">
            📅 {data.payload.fecha}
          </p>
          <div className="space-y-1">
            <p className="text-lg font-bold text-green-600">
              ${data.value.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-gray-500">
              {porcentaje}% del total
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-lg p-8">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Ingresos Facturados por Fecha
        </h3>
        <p className="text-sm text-gray-600">
          Evolución de facturación por día
        </p>
      </div>

      {/* Estadísticas con nuevo diseño */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Card Total Facturado */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">
                Total Facturado
              </p>
              <p className="text-4xl font-bold text-green-600">
                ${totalGeneral.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-green-100 text-green-600 p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Card Promedio Diario */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">
                Promedio Diario
              </p>
              <p className="text-4xl font-bold text-blue-600">
                ${promedio.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="h-[500px] bg-white rounded-xl p-4 shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={resume} 
            margin={{ top: 10, right: 30, left: 20, bottom: 50 }}
          >
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={0.7} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
            
            <XAxis
              dataKey="fecha"
              angle={0}
              textAnchor="middle"
              height={60}
              tick={{ fontSize: 11, fill: "#6b7280" }}
              stroke="#9ca3af"
            />
            
            <YAxis
              tick={{ fontSize: 12, fill: "#6b7280" }}
              stroke="#9ca3af"
              tickFormatter={(value) => 
                `$${(value / 1000).toFixed(0)}k`
              }
              label={{
                value: "Monto Facturado",
                angle: -90,
                position: "insideLeft",
                style: { fill: "#6b7280", fontSize: 12, fontWeight: 600 },
              }}
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(16, 185, 129, 0.08)" }} />
            
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
              }}
              content={() => (
                <div className="flex justify-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-500 to-emerald-400" />
                    <span className="text-sm font-medium text-green-900">Total Facturado</span>
                  </div>
                </div>
              )}
            />
            
            <Bar
              dataKey="total"
              fill="url(#colorTotal)"
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminGraphCustomerIncome;