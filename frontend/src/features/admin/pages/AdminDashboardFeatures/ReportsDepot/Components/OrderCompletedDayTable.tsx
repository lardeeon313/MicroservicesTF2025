import React from "react";
import { OperatorCompletedCount } from "../../../../../depot/pages/reports/Depot/DepotHocks/useOrderCompletedDay";

interface Props {
  data: OperatorCompletedCount[];
}

export const CompletedOrdersTable: React.FC<Props> = ({ data }) => {
  return (
    <div className="overflow-hidden"> {/* Quitamos overflow-x-auto innecesario si controlamos el ancho */}
      <table className="w-full divide-y divide-gray-200">
        <thead className="bg-gray-100"> {/* Un gris un poco más oscuro para diferenciar mejor */}
          <tr>
            <th 
                scope="col" 
                className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-1/2"
            >
              Operario
            </th>
            <th 
                scope="col" 
                className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-1/2"
            >
              Pedidos Completados
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {(!data || data.length === 0) ? (
            <tr>
              <td colSpan={2} className="px-4 py-8 text-center text-gray-500 italic">
                No se encontraron datos.
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr 
                key={index} 
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-4 py-3 whitespace-nowrap text-center font-medium text-gray-800 capitalize">
                  {row.operatorName}
                </td>
                
                <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                  <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    {row.count} {row.count === 1 ? 'pedido' : 'pedidos'}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};