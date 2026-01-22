import React from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Package, AlertCircle, CheckCircle } from 'lucide-react';
import {
  GeneralGridRow,
  DeliveryTimeReportDto
} from '../../../../../verification/pages/reports/Verification/VerificationHocks/useDeliveryTimesReport';

interface Props {
  generalGrid: GeneralGridRow[];
  onTimeList: DeliveryTimeReportDto[];
  lateList: DeliveryTimeReportDto[];
}

export const AdminGraphDeliveryTimes: React.FC<Props> = ({
  generalGrid,
}) => {
  const COLORS = {
    onTime: '#10b981',
    late: '#ef4444',
    total: '#6366f1'
  };

  const totalDeliveries = generalGrid.reduce((sum, row) => sum + row.total, 0);
  const totalOnTime = generalGrid.reduce((sum, row) => sum + row.onTime, 0);
  const totalLate = generalGrid.reduce((sum, row) => sum + row.late, 0);

  const onTimePercentage =
    totalDeliveries > 0
      ? ((totalOnTime / totalDeliveries) * 100).toFixed(1)
      : '0';

  const latePercentage =
    totalDeliveries > 0
      ? ((totalLate / totalDeliveries) * 100).toFixed(1)
      : '0';

  const pieData = [
    { name: 'A Tiempo', value: totalOnTime, color: COLORS.onTime },
    { name: 'Fuera de Tiempo', value: totalLate, color: COLORS.late }
  ];

  const barData = generalGrid.map(row => ({
    name: `${row.teamName || 'Sin equipo'} - ${row.zoneName || 'Sin zona'}`,
    'A Tiempo': row.onTime,
    'Fuera de Tiempo': row.late
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">
            {payload[0].payload.name}
          </p>
          {payload.map((entry: any, index: number) => (
            <p
              key={index}
              style={{ color: entry.color }}
              className="text-sm font-medium"
            >
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
      {/* Tarjetas de estadísticas (DISEÑO ORIGINAL) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
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

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
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

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
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

      {/* DISTRIBUCIÓN GENERAL */}
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
              outerRadius={100}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* RENDIMIENTO POR EQUIPO */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-lg p-10 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-10 flex items-center gap-2">
          <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
          Rendimiento por Equipo y Zona
        </h3>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart 
            data={barData} 
            margin={{ bottom: 60, left: 30, right: 30, top: 20 }}
            barCategoryGap="45%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis 
              dataKey="name" 
              interval={0} 
              angle={0}
              textAnchor="middle"
              height={70}
              tick={{ fontSize: 13, fill: '#4b5563', fontWeight: 500 }}
              axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 13, fill: '#4b5563', fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              label={{ value: 'Cantidad de pedidos', angle: -90, position: 'insideLeft', style: { fill: '#6b7280', fontSize: 14, fontWeight: 600 } }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
            <Bar dataKey="A Tiempo" fill={COLORS.onTime} radius={[8, 8, 0, 0]} barSize={50} />
            <Bar dataKey="Fuera de Tiempo" fill={COLORS.late} radius={[8, 8, 0, 0]} barSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
