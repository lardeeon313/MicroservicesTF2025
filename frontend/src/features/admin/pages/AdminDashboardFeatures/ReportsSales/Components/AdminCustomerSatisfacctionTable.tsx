import { AdminCustomerSatisfactionReportItem } from "../Types/CustomerSatisfactionType";
import { CustomerSatisfactionLevelBadge } from "../Types/CustomerSatisfactionLevelBadge";

interface Props {
  data: AdminCustomerSatisfactionReportItem[];
}

export const AdminCustomerSatisfactionTable: React.FC<Props> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <p className="text-gray-600 text-lg">No hay datos de satisfacción</p>
        <p className="text-gray-400 text-sm mt-2">
          Los datos de satisfacción del cliente aparecerán aquí una vez registrados
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">
              <th className="px-3 py-4 text-left bg-white w-24">Nº Pedido</th>
              <th className="px-6 py-4 text-left bg-gray-50">Cliente</th>
              <th className="px-6 py-4 text-left bg-white">Email</th>
              <th className="px-6 py-4 text-left bg-white">Satisfacción</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row) => (
              <tr
                key={row.orderId}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                {/* Nº Pedido */}
                <td className="px-3 py-3 w-24 text-sm text-gray-900">
                  {row.orderId ?? "N/A"}
                </td>

                {/* Cliente */}
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                      {row.customer.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {row.customer}
                      </div>
                      <div className="text-xs text-gray-500">
                        Cliente registrado
                      </div>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="px-6 py-4 text-sm text-gray-900">
                  {row.email}
                </td>

                {/* Satisfacción (5 niveles reales) */}
                <td className="px-6 py-4">
                  <CustomerSatisfactionLevelBadge level={row.score} />
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr className="bg-gray-50 border-t border-gray-200">
              <td colSpan={4} className="px-6 py-4 text-sm text-gray-600">
                Mostrando {data.length}{" "}
                {data.length === 1 ? "registro" : "registros"} de satisfacción
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
