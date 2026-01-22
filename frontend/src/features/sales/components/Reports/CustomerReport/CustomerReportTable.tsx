import { AdminCustomerReportItem } from "../../../../admin/pages/AdminDashboardFeatures/ReportsSales/Types/CustomerReportType";

interface Props {
  items: AdminCustomerReportItem[];
  total: number;
}

const SalesCustomerReportTable: React.FC<Props> = ({ items }) => {
  const TotalOrders = items.reduce(
    (acc, customer) => acc + customer.orderCount,
    0
  );

  if (items.length === 0) {
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1z"
            />
          </svg>
        </div>
        <p className="text-gray-600 text-lg">
          No hay clientes con las características buscadas
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
              <th className="px-6 py-4 text-left bg-gray-50">CLIENTE</th>
              <th className="px-6 py-4 text-left bg-white">EMAIL</th>
              <th className="px-6 py-4 text-left bg-white">TELÉFONO</th>
              <th className="px-6 py-4 text-left bg-white">
                CANTIDAD DE PEDIDOS POR CLIENTE
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((cliente) => (
              <tr
                key={cliente.customerId}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                      {cliente.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {cliente.fullName}
                      </div>
                      <div className="text-xs text-gray-500">
                        Cliente registrado
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {cliente.email}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {cliente.phoneNumber || "-"}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {cliente.orderCount}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr className="bg-gray-50 border-t border-gray-200">
              <td className="px-6 py-4 text-sm text-gray-600">
                Mostrando {items.length} clientes
              </td>
              <td />
              <td />
              <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                Total: {TotalOrders}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default SalesCustomerReportTable;