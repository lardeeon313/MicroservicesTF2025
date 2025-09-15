import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SalesPerfomanceDto } from "../../../types/OrderTypes";

interface Props {
  data: SalesPerfomanceDto[];
}

export const GraphSalesPerfomanceReport = ({ data }: Props) => {
  const hasData = data.some((d) => d.totalOrders > 0 || d.totalUnitsSold > 0);

  return (
    <div className="max-w-full mt-20 h-96 mb-14">
      <h1 className="text-center text-3xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent mb-8">
        Rendimiento de Ventas
      </h1>

      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl border border-gray-200/50 p-6">
      <ResponsiveContainer width="100%" height={350}>
        {hasData ? (
          <BarChart 
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorPedidos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="#dc2626" stopOpacity={0.7}/>
              </linearGradient>
              <linearGradient id="colorUnidades" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.7}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e2e8f0" 
              opacity={0.6}
              vertical={false}
            />
            <XAxis 
              dataKey="salespersonName" 
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={{ stroke: '#cbd5e1' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                fontSize: '14px'
              }}
              cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Bar 
              dataKey="totalOrders" 
              fill="url(#colorPedidos)" 
              name="Pedidos"
              radius={[4, 4, 0, 0]}
              maxBarSize={80}
            />
            <Bar 
              dataKey="totalUnitsSold" 
              fill="url(#colorUnidades)" 
              name="Unidades"
              radius={[4, 4, 0, 0]}
              maxBarSize={80}
            />
          </BarChart>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
            <div className="w-12 h-12 mb-3 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm font-medium">No hay datos disponibles para mostrar.</p>
          </div>
        )}
      </ResponsiveContainer>
      </div>
    </div>
  );
};