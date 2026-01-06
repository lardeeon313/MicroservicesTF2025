import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Package, AlertCircle, XCircle, CheckCircle } from "lucide-react";
import { TeamActivityReport } from "../../../../../verification/types/Report";

interface Props {
  data: TeamActivityReport[];
}

const COLORS = {
  primary: "#DC2626",
  success: "#10B981",
  warning: "#F59E0B",
  info: "#3B82F6",
  danger: "#EF4444",
  purple: "#8B5CF6",
  teal: "#14B8A6",
};

const AdminGraphDeliveryTeamActivity: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="flex flex-col items-center">
          <div className="p-3 bg-gray-100 rounded-full mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Sin datos para mostrar
          </h3>
          <p className="text-gray-600">
            No hay información disponible para generar gráficos.
          </p>
        </div>
      </div>
    );
  }

  // Preparar datos para gráficos
  const chartData = data.map(team => ({
    name: team.teamName,
    id: team.deliveryTeamId,
    total: team.totalOrders,
    entregados: team.deliveredOrders,
    enCamino: team.onTheWayOrders,
    incidencias: team.incidentsCount,
    cancelados: team.rejectionsCount,
    efectivo: team.pendingCashVerificationOrders,
    tasaExito: team.deliverySuccessRatePercent,
    tasaIncidencias: team.incidentRatePercent,
    tiempoPromedio: team.averageDeliveryTimeHours,
  }));

  // Estadísticas generales
  const totalStats = {
    totalOrders: data.reduce((sum, t) => sum + t.totalOrders, 0),
    delivered: data.reduce((sum, t) => sum + t.deliveredOrders, 0),
    incidents: data.reduce((sum, t) => sum + t.incidentsCount, 0),
    rejections: data.reduce((sum, t) => sum + t.rejectionsCount, 0),
    onTheWay: data.reduce((sum, t) => sum + t.onTheWayOrders, 0),
  };

  // Datos para gráfico de distribución general
  const distributionData = [
    { name: "Entregados", value: totalStats.delivered, color: COLORS.success },
    { name: "En Camino", value: totalStats.onTheWay, color: COLORS.info },
    { name: "Incidencias", value: totalStats.incidents, color: COLORS.warning },
    { name: "Cancelados", value: totalStats.rejections, color: COLORS.danger },
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{payload[0].payload.name}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold">{entry.value}</span>
              {entry.name.includes("Tasa") || entry.name.includes("tasa") ? "%" : ""}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 text-blue-600" />
            <span className="text-3xl font-bold text-blue-900">{totalStats.totalOrders}</span>
          </div>
          <p className="text-sm font-medium text-blue-700">Total de Órdenes</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-3xl font-bold text-green-900">{totalStats.delivered}</span>
          </div>
          <p className="text-sm font-medium text-green-700">Entregadas</p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5 border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8 text-amber-600" />
            <span className="text-3xl font-bold text-amber-900">{totalStats.incidents}</span>
          </div>
          <p className="text-sm font-medium text-amber-700">Incidencias</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-8 h-8 text-red-600" />
            <span className="text-3xl font-bold text-red-900">{totalStats.rejections}</span>
          </div>
          <p className="text-sm font-medium text-red-700">Canceladas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de distribución general */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-bold text-gray-900">Distribución General de Órdenes</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de órdenes por equipo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-bold text-gray-900">Órdenes por Equipo</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="total" fill={COLORS.info} name="Total" radius={[8, 8, 0, 0]} />
              <Bar dataKey="entregados" fill={COLORS.success} name="Entregados" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default AdminGraphDeliveryTeamActivity;