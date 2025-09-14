import { CustomerSatisfaction, CustomerWithCount } from "../../../types/CustomerTypes";
import { CustomerSatisfactionBadge } from "../../Customers/CustomerSatisfactionBadge";

interface Props {
  data: (CustomerWithCount & { pedidoID?: string | number })[];
}

export const CustomerSatisfactionTable: React.FC<Props> = ({ data }) => {

  // Estado vacío cuando no hay datos
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-600 text-lg">No hay datos de satisfacción</p>
        <p className="text-gray-400 text-sm mt-2">Los datos de satisfacción del cliente aparecerán aquí una vez registrados</p>
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
              <th className="px-6 py-4 text-left bg-white">PEDIDO ID</th>
              <th className="px-6 py-4 text-left bg-white">SATISFACCIÓN</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                      {row.firstName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{row.firstName} {row.lastName}</div>
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
                      <div className="text-sm text-gray-900">{row.email}</div>
                      <div className="text-xs text-gray-500">Contacto principal</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2v8h12V6H4zm2 2h8v2H6V8zm0 4h8v2H6v-2z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-gray-900">{row.pedidoID ?? "N/A"}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <CustomerSatisfactionBadge status={row.satisfaction ?? CustomerSatisfaction.Neutra} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 border-t border-gray-200">
              <td className="px-6 py-4">
                <div className="text-sm text-gray-600">
                  Mostrando {data.length} {data.length === 1 ? 'registro' : 'registros'} de satisfacción
                </div>
              </td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
