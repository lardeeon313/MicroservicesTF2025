import React from "react";
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { AlertTriangle, Users, CheckCircle2, XCircle } from "lucide-react";
import { DeliveryIncidentReport } from "../../../../../verification/types/Report";

interface Props {
  data: DeliveryIncidentReport[];
}

export const AdminGraphDeliveryIncidents: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="flex flex-col items-center">
          <div className="p-3 bg-gray-100 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Sin datos para mostrar
          </h3>
          <p className="text-gray-600">No hay incidentes registrados en el período seleccionado.</p>
        </div>
      </div>
    );
  }

  // 1. Incidentes resueltos vs no resueltos
  const resolvedCount = data.filter(item => item.resolvedAt && item.resolutionNote?.trim() !== "").length;
  const pendingCount = data.length - resolvedCount;

  const resolvedData = [
    {
      name: "Resueltos",
      value: resolvedCount,
      color: "#10b981"
    },
    {
      name: "Pendientes",
      value: pendingCount,
      color: "#ef4444"
    }
  ];

  // 2. Top repartidores con más incidentes
  const deliveryOperatorIncidents = data.reduce((acc, item) => {
    const name = item.fullNameReportedByOperator || "Sin asignar";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topOperators = Object.entries(deliveryOperatorIncidents)
    .map(([name, count]) => ({ name, incidentes: count }))
    .sort((a, b) => b.incidentes - a.incidentes)
    .slice(0, 8);

  // 3. Tendencia temporal (incidentes por día)


  // 4. Incidentes por zona de entrega
  const incidentsByZone = data.reduce((acc, item) => {
    const zone = item.deliveryZoneName || "Sin zona";
    acc[zone] = (acc[zone] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const zoneData = Object.entries(incidentsByZone)
    .map(([zona, incidentes]) => ({ zona, incidentes }))
    .sort((a, b) => b.incidentes - a.incidentes)
    .slice(0, 6);

  // 5. Estadísticas resumen
  const totalIncidents = data.length;
  

  const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-4">
            <AlertTriangle className="w-12 h-12 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-600">Total de Incidentes</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{totalIncidents}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-4">
            <CheckCircle2 className="w-12 h-12 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-600">Resueltos</p>
              <p className="text-3xl font-bold text-green-900 mt-1">{resolvedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
          <div className="flex items-center gap-4">
            <XCircle className="w-12 h-12 text-red-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-600">Pendientes</p>
              <p className="text-3xl font-bold text-red-900 mt-1">{pendingCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Pie: Resueltos vs Pendientes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Estado de Incidentes
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={resolvedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {resolvedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Barras: Top Repartidores */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Top Repartidores con Incidentes
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topOperators} maxBarSize={topOperators.length === 1 ? 100 : 60}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                interval={0}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="incidentes" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Barras: Incidentes por Zona */}
      {zoneData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Incidentes por Zona de Entrega
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={zoneData} maxBarSize={zoneData.length === 1 ? 100 : 60}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="zona" 
                tick={{ fontSize: 12 }}
                interval={0}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="incidentes">
                {zoneData.map((__, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};