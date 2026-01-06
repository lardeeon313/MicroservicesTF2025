import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Package, AlertTriangle } from "lucide-react";
import { DepotTeamPerformanceDto } from "../../Hocks/TeamProducitity/useAdminTeamProductivity";

interface Props {
  data: DepotTeamPerformanceDto[];
  agruparPorEquipo: boolean;
}

export const AdminGraphTeamProductivity: React.FC<Props> = ({ data, agruparPorEquipo }) => {
  // Filtrar según el modo de agrupación
  const filteredData = agruparPorEquipo 
    ? data.filter((x) => x.isTeam)
    : data.filter((x) => !x.isTeam);

  // Formatear datos para el gráfico
  const chartData = filteredData.map((item) => ({
    name: item.name,
    pedidosArmados: item.ordersHandled,
    faltantes: item.missingItemsReported,
  }));

  // Calcular totales
  const totalPedidos = filteredData.reduce((sum, item) => sum + item.ordersHandled, 0);
  const totalFaltantes = filteredData.reduce((sum, item) => sum + item.missingItemsReported, 0);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="flex flex-col items-center">
          <div className="p-3 bg-gray-100 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sin datos disponibles</h3>
          <p className="text-gray-600">No hay información para mostrar en el gráfico</p>
        </div>
      </div>
    );
  }

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">{payload[0].payload.name}</p>
          <div className="space-y-1">
            <p className="text-sm text-green-600 flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              Pedidos: <span className="font-bold">{payload[0].value}</span>
            </p>
            <p className="text-sm text-red-600 flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              Faltantes: <span className="font-bold">{payload[1].value}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-md mt-10 overflow-hidden">
      {/* Header con título */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Análisis de Rendimiento
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {agruparPorEquipo ? "Vista por equipos" : "Vista por operarios"}
            </p>
          </div>
        </div>

        {/* Métricas con el nuevo diseño */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card Total Pedidos */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Total Pedidos
                </p>
                <p className="text-4xl font-bold text-green-600">
                  {totalPedidos}
                </p>
              </div>
              <div className="bg-green-100 text-green-600 p-3 rounded-full">
                <Package className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Card Total Faltantes */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Total Faltantes
                </p>
                <p className="text-4xl font-bold text-red-600">
                  {totalFaltantes}
                </p>
              </div>
              <div className="bg-red-100 text-red-600 p-3 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="p-6">
        <ResponsiveContainer width="100%" height={Math.max(300, chartData.length * 60)}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis 
              type="category" 
              dataKey="name" 
              tick={{ fill: '#374151', fontSize: 13, fontWeight: 500 }}
              width={110}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(229, 231, 235, 0.3)' }} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Bar 
              dataKey="pedidosArmados" 
              name="Pedidos Armados" 
              fill="#10b981" 
              radius={[0, 8, 8, 0]}
              barSize={20}
            />
            <Bar 
              dataKey="faltantes" 
              name="Faltantes" 
              fill="#ef4444" 
              radius={[0, 8, 8, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};