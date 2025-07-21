import LoadingSpinner from "../../../../../components/LoadingSpinner";
import { SalesPerfomanceDto } from "../../../types/OrderTypes";
import { format, parseISO } from "date-fns";

interface Props {
  data: SalesPerfomanceDto[];
  loading: boolean;
}

export const SalesPerfomanceReportTable = ({ data, loading }: Props) => {
  if (loading) return <LoadingSpinner message="Cargando..." height="h-screen" />;

  return (
    <div className="w-full overflow-hidden rounded-lg border shadow-md border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-800">
          <thead className="bg-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Vendedor</th>
              <th className="px-4 py-3 text-left">Órdenes Totales</th>
              <th className="px-4 py-3 text-left">Unidades Vendidas</th>
              <th className="px-4 py-3 text-left">Última Orden</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.length > 0 ? (
              data.map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-red-50"}>
                  <td className="px-4 py-2">{item.salespersonName}</td>
                  <td className="px-4 py-2">{item.totalOrders}</td>
                  <td className="px-4 py-2">{item.totalUnitsSold}</td>
                  <td className="px-4 py-2">
                    {item.lastOrderDate
                      ? format(parseISO(item.lastOrderDate), "dd/MM/yyyy")
                      : "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  No hay datos disponibles para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
