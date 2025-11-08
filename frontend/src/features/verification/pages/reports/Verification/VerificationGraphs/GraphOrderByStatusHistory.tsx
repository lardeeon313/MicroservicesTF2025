import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { OrderStatusHistoryReport } from "../../../../types/Report";
import { OrderStatusLabelsReportEs } from "../../../../types/Report";
import { ChartColumnBig } from "lucide-react";

interface Props {
  data: OrderStatusHistoryReport[];
}

export const GraphOrderStatusHistory: React.FC<Props> = ({ data }) => {

  if (data.length === 0 || !data) {
    return (
      <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 mt-10">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Sin pedidos
          </h2>
          <p className="text-gray-500 text-sm">
            No se encontraron pedidos para las fechas o filtros seleccionados.
          </p>
        </div>
      </div>
    );
  }

  const chartData = Object.values(
    data.reduce((acc, cur) => {
      acc[cur.newStatus] = acc[cur.newStatus] || { status: cur.newStatus, count: 0 };
      acc[cur.newStatus].count++;
      return acc;
    }, {} as any)
  ).map((item: any) => ({
    name: OrderStatusLabelsReportEs[item.status] || item.status,
    value: item.count
  }));

  const totalOrders = chartData.reduce((sum, item) => sum + item.value, 0);
  const maxCategory = chartData.reduce((max, item) => item.value > max.value ? item : max, chartData[0]);

  const colors = [
    '#ef4444', '#f97316', '#fb923c', '#f43f5e', 
    '#dc2626', '#e11d48', '#ea580c', '#fb7185',
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / totalOrders) * 100).toFixed(1);
      return (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          padding: '14px 18px',
          borderRadius: '12px',
          border: '2px solid #fee2e2',
          boxShadow: '0 10px 30px rgba(239, 68, 68, 0.25)',
        }}>
          <p style={{ 
            margin: 0, 
            fontWeight: 700, 
            color: '#7f1d1d',
            fontSize: '15px',
            marginBottom: '6px'
          }}>
            {payload[0].name}
          </p>
          <p style={{ 
            margin: 0, 
            color: '#991b1b',
            fontSize: '14px',
            marginBottom: '3px'
          }}>
            Cantidad: <span style={{ fontWeight: 700, color: payload[0].payload.fill }}>{payload[0].value}</span>
          </p>
          <p style={{ 
            margin: 0, 
            color: '#b91c1c',
            fontSize: '13px',
            fontWeight: 600
          }}>
            Porcentaje: {percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Solo mostrar label si el porcentaje es mayor al 3%
    if (percent < 0.03) return null;

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        style={{ fontSize: '16px', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
      >
        {value}
      </text>
    );
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 via-red-50 to-orange-50 rounded-2xl shadow-xl border border-gray-200 p-8">
      {/* Header con estadísticas */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <ChartColumnBig className="text-red-600" size={32} />
          <h3 className="text-2xl font-bold text-gray-800">
            Distribución de Estados de Pedidos
          </h3>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-xl p-4 shadow-md border border-red-100">
            <p className="text-gray-600 text-sm font-medium mb-1">Total de Pedidos</p>
            <p className="text-3xl font-bold text-red-600">{totalOrders}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-orange-100">
            <p className="text-gray-600 text-sm font-medium mb-1">Categorías</p>
            <p className="text-3xl font-bold text-orange-600">{chartData.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-rose-100">
            <p className="text-gray-600 text-sm font-medium mb-1">Estado Principal</p>
            <p className="text-lg font-bold text-rose-700 truncate">{maxCategory.name}</p>
            <p className="text-sm text-gray-600">{maxCategory.value} pedidos</p>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <ResponsiveContainer width="100%" height={450}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={150}
              innerRadius={90}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={3}
            >
              {chartData.map((__, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]}
                  style={{
                    filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={60}
              iconType="circle"
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value, entry: any) => {
                const percentage = ((entry.payload.value / totalOrders) * 100).toFixed(1);
                return (
                  <span style={{ 
                    color: '#7f1d1d', 
                    fontSize: '14px', 
                    fontWeight: 600 
                  }}>
                    {value} ({percentage}%)
                  </span>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Footer con insight */}
      <div className="mt-4 bg-gradient-to-r from-red-100 to-orange-100 rounded-lg p-4 border border-red-200">
        <p className="text-sm text-gray-700">
          <span className="font-bold text-red-700">💡 Dato importante:</span> El estado "{maxCategory.name}" representa el{' '}
          <span className="font-bold text-red-800">
            {((maxCategory.value / totalOrders) * 100).toFixed(1)}%
          </span>{' '}
          del total de pedidos.
        </p>
      </div>
    </div>
  );
};