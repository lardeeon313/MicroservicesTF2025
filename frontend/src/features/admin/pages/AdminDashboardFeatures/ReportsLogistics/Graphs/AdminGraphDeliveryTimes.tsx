import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {  Package, AlertCircle, CheckCircle } from 'lucide-react';
import { GeneralGridRow } from '../../../../../verification/pages/reports/Verification/VerificationHocks/useDeliveryTimesReport';
import { DeliveryTimeReportDto } from '../../../../../verification/pages/reports/Verification/VerificationHocks/useDeliveryTimesReport';

interface Props {
  generalGrid: GeneralGridRow[];
  onTimeList: DeliveryTimeReportDto[];
  lateList: DeliveryTimeReportDto[];
}

export const AdminGraphDeliveryTimes: React.FC<Props> = ({ generalGrid, lateList }) => {
  // Colores del tema
  const COLORS = {
    onTime: '#10b981',
    late: '#ef4444',
    total: '#6366f1',
    gradient1: '#4f46e5',
    gradient2: '#06b6d4'
  };

  // Calcular estadísticas generales
  const totalDeliveries = generalGrid.reduce((sum, row) => sum + row.total, 0);
  const totalOnTime = generalGrid.reduce((sum, row) => sum + row.onTime, 0);
  const totalLate = generalGrid.reduce((sum, row) => sum + row.late, 0);
  const onTimePercentage = totalDeliveries > 0 ? ((totalOnTime / totalDeliveries) * 100).toFixed(1) : '0';
  const latePercentage = totalDeliveries > 0 ? ((totalLate / totalDeliveries) * 100).toFixed(1) : '0';

  // Datos para el gráfico de pastel
  const pieData = [
    { name: 'A Tiempo', value: totalOnTime, color: COLORS.onTime },
    { name: 'Fuera de Tiempo', value: totalLate, color: COLORS.late }
  ];

  // Datos para el gráfico de barras por equipo/zona
  const barData = generalGrid.map(row => ({
    name: `${row.teamName || 'Sin equipo'} - ${row.zoneName || 'Sin zona'}`,
    'A Tiempo': row.onTime,
    'Fuera de Tiempo': row.late,
    'Total': row.total
  }));

  // Análisis de retrasos por rango de horas
  const delayRanges = {
    '0-12h': 0,
    '12-24h': 0,
    '24-48h': 0,
    '+48h': 0
  };

  lateList.forEach(item => {
    const hours = item.delayInHours || 0;
    if (hours <= 12) delayRanges['0-12h']++;
    else if (hours <= 24) delayRanges['12-24h']++;
    else if (hours <= 48) delayRanges['24-48h']++;
    else delayRanges['+48h']++;
  });

  const delayRangeData = Object.entries(delayRanges).map(([range, count]) => ({
    range,
    count
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{payload[0].payload.name}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-8">
      {/* Tarjetas de estadísticas con diseño estandarizado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card Total Entregas */}
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">
                Total Entregas
              </p>
              <p className="text-4xl font-bold text-indigo-600">
                {totalDeliveries}
              </p>
            </div>
            <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Card A Tiempo */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">
                A Tiempo
              </p>
              <p className="text-4xl font-bold text-green-600">
                {totalOnTime}
              </p>
              <p className="text-xs text-green-700 mt-1 font-medium">
                {onTimePercentage}% del total
              </p>
            </div>
            <div className="bg-green-100 text-green-600 p-3 rounded-full">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Card Fuera de Tiempo */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">
                Fuera de Tiempo
              </p>
              <p className="text-4xl font-bold text-red-600">
                {totalLate}
              </p>
              <p className="text-xs text-red-700 mt-1 font-medium">
                {latePercentage}% del total
              </p>
            </div>
            <div className="bg-red-100 text-red-600 p-3 rounded-full">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de pastel */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
            Distribución General
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS.onTime }}></div>
              <span className="text-sm font-medium text-gray-700">A Tiempo ({totalOnTime})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS.late }}></div>
              <span className="text-sm font-medium text-gray-700">Fuera de Tiempo ({totalLate})</span>
            </div>
          </div>
        </div>

        {/* Gráfico de rangos de retraso */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-red-600 rounded-full"></div>
            Análisis de Retrasos
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={delayRangeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="range" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill={COLORS.late} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de barras por equipo/zona */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
          Rendimiento por Equipo y Zona
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              angle={0} 
              textAnchor="middle"
              interval={0}
              height={80}
              stroke="#6b7280"
              style={{ fontSize: '11px' }}
              tick={{ width: 150 }}
            />
            <YAxis stroke="#6b7280" />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="A Tiempo" fill={COLORS.onTime} radius={[8, 8, 0, 0]} />
            <Bar dataKey="Fuera de Tiempo" fill={COLORS.late} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};