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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="flex flex-col items-center">
          <div className="p-3 bg-green-100 rounded-full mb-4">
            <Package className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">¡Todo en orden!</h3>
          <p className="text-gray-600">No hay faltantes registrados para hoy.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-red-50 to-orange-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Faltantes Diarios</h2>
              <p className="text-sm text-gray-600">
                {totalMissing} faltante{totalMissing !== 1 ? 's' : ''} • 
                {uniqueOrders} pedido{uniqueOrders !== 1 ? 's' : ''} • 
                {uniqueItems} producto{uniqueItems !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="hidden md:flex gap-3">
            <div className="text-center px-3 py-2 bg-white rounded-lg border border-red-200">
              <div className="text-lg font-bold text-red-600">{totalMissing}</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
            <div className="text-center px-3 py-2 bg-white rounded-lg border border-orange-200">
              <div className="text-lg font-bold text-orange-600">{uniqueOrders}</div>
              <div className="text-xs text-gray-600">Pedidos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Pedido ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Producto ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Hora del Faltante
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr
                key={`${item.orderID}-${item.ItemID}-${index}`}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.orderID}</div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.ItemID}</div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
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
