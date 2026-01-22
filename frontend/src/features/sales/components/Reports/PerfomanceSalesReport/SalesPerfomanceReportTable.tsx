//import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import LoadingSpinner from "../../../../../components/LoadingSpinner";
//import { SalesPerfomanceReportType } from "../Types/SalesPerfomanceReportType";
import { SalesPerfomanceReportType } from "../../../../admin/pages/AdminDashboardFeatures/ReportsSales/Types/SalesPerfomanceReportType";
import { format, parseISO } from "date-fns";

interface Props {
  data: SalesPerfomanceReportType[];
  loading: boolean;
}

export const SalesStaffPerfomanceTable = ({ data, loading }: Props) => {
  if (loading) {
    return <LoadingSpinner message="Cargando..." height="h-screen" />;
  }

  // Calcular totales
  const totalOrders = data.reduce((acc, item) => acc + item.totalOrders, 0);
  const totalUnitsSold = data.reduce((acc, item) => acc + item.totalUnitsSold, 0);

  // Estado vacío cuando no hay datos
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <p className="text-gray-600 text-lg">No hay datos de ventas disponibles</p>
        <p className="text-gray-400 text-sm mt-2">Los datos de rendimiento de ventas aparecerán aquí una vez registrados</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">
              <th className="px-6 py-4 text-left bg-gray-50">VENDEDOR</th>
              <th className="px-6 py-4 text-left bg-white">ÓRDENES TOTALES</th>
              <th className="px-6 py-4 text-left bg-white">UNIDADES VENDIDAS</th>
              <th className="px-6 py-4 text-left bg-white">ÚLTIMA ORDEN</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                      {item.salespersonName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.salespersonName}</div>
                      <div className="text-xs text-gray-500">Vendedor</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.totalOrders}</div>
                      <div className="text-xs text-gray-500">Órdenes</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zM8 6V5a2 2 0 114 0v1H8zm2 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.totalUnitsSold}</div>
                      <div className="text-xs text-gray-500">Unidades</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="text-sm text-gray-900">
                        {item.lastOrderDate
                          ? format(parseISO(item.lastOrderDate), "dd/MM/yyyy")
                          : "—"}
                      </div>
                      <div className="text-xs text-gray-500">Última venta</div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 border-t border-gray-200 text-sm">
              <td className="px-6 py-4">
                <div className="text-gray-600 font-medium">
                  Total de vendedores:
                  <span className="ml-1 text-gray-900 font-semibold">
                    {data.length}
                  </span>
                </div>
              </td>

              <td className="px-6 py-4">
                <div className="text-gray-600 font-medium">
                  Total de órdenes:
                  <span className="ml-1 text-gray-900 font-semibold">
                    {totalOrders}
                  </span>
                </div>
              </td>

              <td className="px-6 py-4">
                <div className="text-gray-600 font-medium">
                  Unidades vendidas:
                  <span className="ml-1 text-gray-900 font-semibold">
                    {totalUnitsSold}
                  </span>
                </div>
              </td>

              <td className="px-6 py-4"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};