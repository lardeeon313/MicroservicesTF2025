import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Package, DollarSign, Users } from 'lucide-react';

import { OperatorProductivityReport } from '../../../../../verification/types/Report';

interface Props {
  data: OperatorProductivityReport[];
}

export const AdminGraphOperatorProductivity: React.FC<Props> = ({ data }) => {

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="flex flex-col items-center">
          <div className="p-3 bg-gray-100 rounded-full mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay datos para mostrar
          </h3>
          <p className="text-gray-600">
            Ajusta los filtros para visualizar las estadísticas.
          </p>
        </div>
      </div>
    );
  }

  // Datos para gráfico de barras (comparación de repartidores)
  const barChartData = data.map(op => ({
    name: op.fullNameDeliveringOperator.split(' ').slice(0, 2).join(' '),
    'Entregados': op.deliveredOrders,
    'Pendientes': op.pendingOrders,
    'Cancelados': op.rejectedOrders,
    'Monto': op.totalCollectedAmount / 100
  }));

  // Datos para gráfico circular (totales generales)
  const totals = data.reduce((acc, op) => ({
    delivered: acc.delivered + op.deliveredOrders,
    pending: acc.pending + op.pendingOrders,
    rejected: acc.rejected + op.rejectedOrders,
    total: acc.total + op.totalOrders,
    amount: acc.amount + op.totalCollectedAmount
  }), { delivered: 0, pending: 0, rejected: 0, total: 0, amount: 0 });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-semibold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Cards de estadísticas con diseño estandarizado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card Total Repartidores */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">
                Total Repartidores
              </p>
              <p className="text-4xl font-bold text-blue-600">
                {data.length}
              </p>
            </div>
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Card Pedidos Entregados */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">
                Pedidos Entregados
              </p>
              <p className="text-4xl font-bold text-green-600">
                {totals.delivered}
              </p>
            </div>
            <div className="bg-green-100 text-green-600 p-3 rounded-full">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Card Total Recaudado */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">
                Total Recaudado
              </p>
              <p className="text-4xl font-bold text-purple-600">
                ${totals.amount.toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de barras */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Análisis de Productividad</h3>
            <p className="text-sm text-gray-600 mt-1">Comparación de pedidos por repartidor</p>
          </div>
        </div>

        {/* Contenido del gráfico */}
        <div className="p-6">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                height={60}
              />
              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="Entregados" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Pendientes" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Cancelados" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top performers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Top Repartidores
        </h3>
        <div className="space-y-3">
          {[...data]
            .sort((a, b) => b.deliveredOrders - a.deliveredOrders)
            .slice(0, 5)
            .map((op, idx) => {
              const successRate = op.totalOrders > 0 
                ? Math.round((op.deliveredOrders / op.totalOrders) * 100) 
                : 0;
              
              return (
                <div key={op.operatorId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-600' : 'bg-blue-500'
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{op.fullNameDeliveringOperator}</p>
                      <p className="text-sm text-gray-600">{op.teamName || 'Sin equipo'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Entregas</p>
                      <p className="text-lg font-bold text-green-600">{op.deliveredOrders}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Éxito</p>
                      <p className="text-lg font-bold text-blue-600">{successRate}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Recaudado</p>
                      <p className="text-lg font-bold text-purple-600">${op.totalCollectedAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};