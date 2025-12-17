// src/features/sales/components/CustomerReportTable.tsx
import React from "react";
import { CustomerWithCount } from "../../../types/CustomerTypes";

type Props = {
  data: CustomerWithCount[];
};

const CustomerReportTable: React.FC<Props> = ({ data }) => {
  const TotalOrders = data.reduce((acc, customer) => acc + customer.orderCount, 0);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        </div>
        <p className="text-gray-600 text-lg">No hay clientes con las caracteristicas buscadas</p>
        <p className="text-gray-400 text-sm mt-2">Los clientes aparecerán aquí una vez registrados</p>
      </div>
    );
  }


  return (
    <div className="w-full bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">
              <th className="px-6 py-4 text-left bg-gray-50">CLIENTE</th>
              <th className="px-6 py-4 text-left bg-white">EMAIL</th>
              <th className="px-6 py-4 text-left bg-white">TELÉFONO</th>
              <th className="px-6 py-4 text-left bg-white">CANTIDAD DE PEDIDOS POR CLIENTE</th>
            </tr>
          </thead>
          <tbody>
            {data.map((cliente, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                      {cliente.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{cliente.fullName}</div>
                      <div className="text-xs text-gray-500">Cliente registrado</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                    <div>
                      <div className="text-sm text-gray-900">{cliente.email}</div>
                      <div className="text-xs text-gray-500">Contacto principal</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{cliente.phoneNumber || '-'}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{cliente.orderCount}</div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 border-t border-gray-200">
              <td className="px-6 py-4">
                <div className="text-sm text-gray-600">
                  Mostrando {data.length} {data.length === 1 ? 'cliente' : 'clientes'}
                  {data.length === 1 && <span className="ml-2 text-xs">• 1 cliente único</span>}
                </div>
              </td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4">
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">Total: {TotalOrders}</div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default CustomerReportTable;