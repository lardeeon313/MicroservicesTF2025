import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { TeamActivityReport } from "../../../../types/Report";

const GraphDeliveryTeamActivity: React.FC<{ data: TeamActivityReport[] }> = ({ data }) => {

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
            Sin Equipos
          </h2>
          <p className="text-gray-500 text-sm">
            No se encontraron equipos de reparto para las fechas o filtros seleccionados.
          </p>
        </div>
      </div>
    );
  }

  const totalOrders = data.reduce((sum, item) => sum + item.totalOrders, 0);
  const totalDelivered = data.reduce((sum, item) => sum + item.deliveredOrders, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2 text-red-600">
            Rendimiento de equipos
        </h2>
        <p className="text-sm text-gray-500">Comparación de estados de pedidos</p>
      </div>

      {/* Chart */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis 
              dataKey="teamName" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 13 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 13 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '13px'
              }}
              cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
            />
            <Bar 
              dataKey="totalOrders" 
              fill="#ef4444" 
              radius={[6, 6, 0, 0]}
              maxBarSize={100}
            />
            <Bar 
              dataKey="deliveredOrders" 
              fill="#3b82f6" 
              radius={[6, 6, 0, 0]}
              maxBarSize={100}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend/Stats */}
      <div className="flex justify-center items-center gap-8 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm text-gray-600">Pedidos</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-gray-600">Entregados</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalDelivered}</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-gray-600"></div>
            <span className="text-sm text-gray-600">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
        </div>
      </div>
    </div>
  );
};

export default GraphDeliveryTeamActivity;