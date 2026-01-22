import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package, AlertCircle, CheckCircle } from 'lucide-react';
import { ZonePerformanceReport } from '../../../../../verification/types/Report';

interface Props {
  data: ZonePerformanceReport[];
}

export const AdminGraphZonePerformance: React.FC<Props> = ({ data }) => {
  // Preparar datos para el gráfico
  const chartData = data.map(zone => ({
    name: zone.deliveryZoneName,
    'Órdenes Totales': zone.totalOrders,
    'Órdenes Entregadas': zone.deliveredOrders,
    'Con Incidentes': zone.incidentsCount,
    successRate: zone.deliverySuccessRatePercent
  }));

  // Calcular totales para las tarjetas
  const totalOrders = data.reduce((sum, zone) => sum + zone.totalOrders, 0);
  const totalDelivered = data.reduce((sum, zone) => sum + zone.deliveredOrders, 0);
  const totalIncidents = data.reduce((sum, zone) => sum + zone.incidentsCount, 0);

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-bold text-gray-800 mb-2">{payload[0].payload.name}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-semibold">{entry.value}</span>
            </p>
          ))}
          <p className="text-sm text-gray-600 mt-2 pt-2 border-t">
            Tasa de éxito: <span className="font-semibold">{payload[0].payload.successRate.toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-12 text-center">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No hay datos disponibles para mostrar</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tarjetas de resumen con diseño estandarizado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card Órdenes Totales */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">
                Órdenes Totales
              </p>
              <p className="text-4xl font-bold text-blue-600">
                {totalOrders}
              </p>
            </div>
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Card Entregadas */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">
                Entregadas
              </p>
              <p className="text-4xl font-bold text-green-600">
                {totalDelivered}
              </p>
            </div>
            <div className="bg-green-100 text-green-600 p-3 rounded-full">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Card Con Incidentes */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">
                Con Incidentes
              </p>
              <p className="text-4xl font-bold text-red-600">
                {totalIncidents}
              </p>
            </div>
            <div className="bg-red-100 text-red-600 p-3 rounded-full">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico principal */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <div className="w-1 h-6 bg-red-600 rounded-full"></div>
            Comparativa de pedidos totales, entregados y con incidentes
          </h2>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart 
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              angle={0}
              height={80}
              tick={{ fill: '#374151', fontSize: 13, fontWeight: 500 }}
              interval={0}
            />
            <YAxis tick={{ fill: '#374151', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Bar 
              dataKey="Órdenes Totales" 
              fill="#3b82f6" 
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
            />
            <Bar 
              dataKey="Órdenes Entregadas" 
              fill="#10b981" 
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
            />
            <Bar 
              dataKey="Con Incidentes" 
              fill="#ef4444" 
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AdminGraphZonePerformance;