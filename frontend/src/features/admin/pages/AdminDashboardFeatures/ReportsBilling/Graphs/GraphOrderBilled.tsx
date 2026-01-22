import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import type { DepotOrderDtoBilling } from "../../../../../depot/pages/reports/Billing/BillingHocks/useOrderBilled";

type Props = {
  data: DepotOrderDtoBilling[];
};

const AdminOrderBilledGraph: React.FC<Props> = ({ data }) => {
  if (data.length === 0) return null;

  // Agrupar por cliente y sumar montos
  const customerTotals = data.reduce((acc, order) => {
    const customer = order.customerName;
    if (!acc[customer]) {
      acc[customer] = {
        name: customer,
        amount: 0,
        ordersCount: 0
      };
    }
    acc[customer].amount += order.totalAmount ?? 0;
    acc[customer].ordersCount += 1;
    return acc;
  }, {} as Record<string, { name: string; amount: number; ordersCount: number }>);

  const chartData = Object.values(customerTotals).sort((a, b) => b.amount - a.amount);

  // Calcular estadísticas
  const totalFacturado = chartData.reduce((sum, item) => sum + item.amount, 0);
  const totalPedidos = data.length;

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const porcentaje = ((data.amount / totalFacturado) * 100).toFixed(1);
      
      return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-xl p-4 backdrop-blur-sm">
          <p className="text-sm font-bold text-gray-900 mb-2 truncate max-w-[200px]">
            {data.name}
          </p>
          <div className="space-y-1">
            <p className="text-xs text-gray-600">
              <span className="font-medium">Pedidos:</span> {data.ordersCount}
            </p>
            <p className="text-lg font-bold text-purple-600">
              ${data.amount.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-gray-500">
              {porcentaje}% del total
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-lg p-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
         Facturación por Cliente
        </h2>
        <p className="text-sm text-gray-600">
          Montos totales facturados agrupados por cliente
        </p>
      </div>

      {/* Estadísticas con diseño estandarizado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Card Total Facturado */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">
                Total Facturado
              </p>
              <p className="text-4xl font-bold text-purple-600">
                ${totalFacturado.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card Total Pedidos */}
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">
                Total Pedidos
              </p>
              <p className="text-4xl font-bold text-pink-600">
                {totalPedidos}
              </p>
            </div>
            <div className="bg-pink-100 text-pink-600 p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="h-[500px] bg-white rounded-xl p-4 shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData}
            margin={{ top: 10, right: 30, left: 20, bottom: 60 }}
          >
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#c084fc" stopOpacity={0.7} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
            
            <XAxis
              dataKey="name"
              angle={0}
              textAnchor="middle"
              height={60}
              interval={0}
              tick={{ fontSize: 11, fill: "#6b7280" }}
              stroke="#9ca3af"
            />
            
            <YAxis
              tick={{ fontSize: 12, fill: "#6b7280" }}
              stroke="#9ca3af"
              tickFormatter={(value) => 
                `$${(value / 1000).toFixed(0)}k`
              }
              label={{
                value: "Monto Facturado",
                angle: -90,
                position: "insideLeft",
                style: { fill: "#6b7280", fontSize: 12, fontWeight: 600 },
              }}
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(168, 85, 247, 0.08)" }} />
            
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
              }}
              content={() => (
                <div className="flex justify-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-500 to-purple-400" />
                    <span className="text-sm font-medium text-purple-900">Monto Total</span>
                  </div>
                </div>
              )}
            />
            
            <Bar
              dataKey="amount"
              fill="url(#colorAmount)"
              radius={[8, 8, 0, 0]}
              maxBarSize={50}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer con información adicional */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span>{chartData.length} clientes únicos</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500"></span>
            <span>{totalPedidos} pedidos totales</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderBilledGraph;