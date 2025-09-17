
import React from "react";
import { AlertTriangle, Package } from "lucide-react";

export type DailyMissing = {
  orderID: number;
  ItemID: number;
  MissingDate: string; // viene como string (ej: "2025-08-20T14:35:00")
};

type Props = {
  data: DailyMissing[];
};

const DailyMissingTable: React.FC<Props> = ({ data }) => {
  // Función para formatear la hora
  const formatHour = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Agrupar por fecha para mostrar estadísticas
  const totalMissing = data.length;
  const uniqueOrders = new Set(data.map(item => item.orderID)).size;
  const uniqueItems = new Set(data.map(item => item.ItemID)).size;

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="flex flex-col items-center">
          <div className="p-4 bg-green-50 rounded-2xl mb-6">
            <Package className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">¡Todo en orden!</h3>
          <p className="text-gray-500">No hay faltantes registrados para hoy.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-50/30 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Faltantes Diarios</h2>
              <p className="text-sm text-gray-500">
                {totalMissing} faltante{totalMissing !== 1 ? 's' : ''} • 
                {uniqueOrders} pedido{uniqueOrders !== 1 ? 's' : ''} • 
                {uniqueItems} producto{uniqueItems !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="hidden md:flex gap-4">
            <div className="text-center px-4 py-3 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="text-xl font-bold text-red-500">{totalMissing}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Total</div>
            </div>
            <div className="text-center px-4 py-3 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="text-xl font-bold text-orange-500">{uniqueOrders}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Pedidos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Pedido ID
              </th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Producto ID
              </th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Hora del Faltante
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.map((item, index) => (
              <tr
                key={`${item.orderID}-${item.ItemID}-${index}`}
                className="border-b border-gray-50 hover:bg-gray-50/30 transition-all duration-200"
              >
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-4">
                      <span className="text-sm font-semibold text-blue-600">
                        {item.orderID.toString().slice(-2)}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">#{item.orderID}</div>
                  </div>
                </td>
                
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center mr-4">
                      <Package className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="text-sm font-semibold text-gray-900">{item.ItemID}</div>
                  </div>
                </td>
                
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                    {formatHour(item.MissingDate)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyMissingTable;
