import { Cuboid, Square } from "lucide-react";
import React from "react";

interface OrderItemsTableProps {
  items: any[];
}

export const OrderItemsTable: React.FC<OrderItemsTableProps> = ({ items }) => {
  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Marca
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                Cantidad
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item: any, ) => (
              <tr 
                key={item.id} 
                className="hover:bg-gradient-to-r hover:from-red-50 hover:to-transparent transition-all duration-200 group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                      <Square className="w-6 h-6 text-red-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      {item.productName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-gray-800">
                    {item.productBrand}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <span className="inline-flex items-center justify-center min-w-[2.5rem] h-10 px-3 bg-gradient-to-br from-red-500 to-red-600 text-white text-sm font-bold rounded-xl shadow-md">
                      {item.quantity}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary footer */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t-2 border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-600">
            Total de productos:
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white text-red-600 text-sm font-bold rounded-lg shadow">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <Cuboid className="w-4 h-4 text-red-600" />
            </svg>
            {items.length} {items.length === 1 ? 'ítem' : 'ítems'}
          </span>
        </div>
      </div>
    </div>
  );
};