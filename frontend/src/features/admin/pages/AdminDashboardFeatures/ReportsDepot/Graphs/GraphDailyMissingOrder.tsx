import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Package, AlertCircle } from "lucide-react";
import type { DailyMissing } from "../../../../../depot/pages/reports/Depot/DepotComponents/DailyMissingTable";

type Props = {
  data: DailyMissing[];
};

const AdminGraphDailyMissingOrder: React.FC<Props> = ({ data }) => {
  const chartData = useMemo(() => {
    // Agrupar por marca
    const brandMap = new Map<string, number>();
    
    data.forEach(item => {
      const current = brandMap.get(item.productBrand) || 0;
      brandMap.set(item.productBrand, current + item.missingQuantity);
    });

    return Array.from(brandMap.entries())
      .map(([brand, quantity]) => ({
        marca: brand,
        cantidad: quantity
      }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5); 
  }, [data]);

  const stats = useMemo(() => {
    const totalItems = data.reduce((sum, item) => sum + item.missingQuantity, 0);
    const totalOrders = new Set(data.map(item => item.orderID)).size;
    const topBrand = chartData[0]?.marca || "N/A";

    return { totalItems, totalOrders, topBrand };
  }, [data, chartData]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900">{payload[0].payload.marca}</p>
          <p className="text-sm text-gray-600">
            Faltantes: <span className="font-bold text-red-600">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-4 border border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Unidades</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{stats.totalItems}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Package className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Pedidos Afectados</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">{stats.totalOrders}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>


      </div>

      {/* Chart */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Grafico de todos los faltantes</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="marca" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(239, 68, 68, 0.1)' }} />
            <Bar 
              dataKey="cantidad" 
              fill="#ef4444" 
              radius={[8, 8, 0, 0]}
              maxBarSize={80}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminGraphDailyMissingOrder;