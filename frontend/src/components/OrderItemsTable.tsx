import React from "react";

interface OrderItemsTableProps {
  items: any[];
}

export const OrderItemsTable: React.FC<OrderItemsTableProps> = ({ items }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Producto
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Marca
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cantidad
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {items.map((item: any) => (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-6 py-4 text-sm text-gray-900">{item.productName}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{item.productBrand}</td>
              <td className="px-6 py-4 text-sm">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {item.quantity}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
