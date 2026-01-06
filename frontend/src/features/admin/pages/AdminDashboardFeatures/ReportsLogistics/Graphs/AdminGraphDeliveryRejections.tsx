import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TrendingDown } from "lucide-react";
import { DeliveryRejectionReport } from "../../../../../verification/types/Report";

interface Props {
  data: DeliveryRejectionReport[];
}

const AdminGraphDeliveryRejections: React.FC<Props> = ({ data }) => {
  const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e'];
  
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    // Agrupar rechazos por empleado
    const byOperator = data.reduce((acc, item) => {
      acc[item.fullNameDeliveringOperator] = (acc[item.fullNameDeliveringOperator] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Convertir a array y ordenar de mayor a menor
    return Object.entries(byOperator)
      .map(([empleado, cantidad]) => ({
        empleado,
        cantidad,
        percentage: ((cantidad / data.length) * 100).toFixed(1)
      }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }, [data]);
  
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="flex flex-col items-center">
          <div className="p-3 bg-blue-100 rounded-full mb-4">
            <TrendingDown className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Sin datos para graficar
          </h3>
          <p className="text-gray-600">
            No hay rechazos registrados para mostrar estadísticas.
          </p>
        </div>
      </div>
    );
  }
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border-2 border-gray-200">
          <p className="font-bold text-gray-900 mb-2">{payload[0].payload.empleado}</p>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              Rechazos: <span className="font-bold text-red-600">{payload[0].value}</span>
            </p>
            <p className="text-sm text-gray-600">
              Porcentaje: <span className="font-bold text-blue-600">{payload[0].payload.percentage}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <TrendingDown className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Rechazos por Motivo</h3>
            <p className="text-sm text-gray-500">Distribución de las asignaciones canceladas</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total de rechazos</p>
          <p className="text-3xl font-bold text-red-600">{data.length}</p>
        </div>
      </div>

      {/* Gráfico de barras */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="motivo" 
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 12, fill: '#4b5563' }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#4b5563' }}
            label={{ value: 'Cantidad de Rechazos', angle: -90, position: 'insideLeft', style: { fontSize: 14, fill: '#6b7280' } }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
          <Bar 
            dataKey="cantidad"
            barSize={100} 
            radius={[8, 8, 0, 0]}
            label={{ position: 'top', fontSize: 12, fill: '#374151', fontWeight: 'bold' }}
          >
            {chartData.map((__, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Leyenda personalizada con porcentajes */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm font-semibold text-gray-700 mb-3">Lista de los repartidores: </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div 
                className="w-4 h-4 rounded flex-shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.empleado}</p>
                <p className="text-xs text-gray-500">
                  {item.cantidad} rechazos ({item.percentage}%)
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminGraphDeliveryRejections;