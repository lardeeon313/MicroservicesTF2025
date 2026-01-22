//import { CustomerSatisfactionReportItem } from "../../types/CustomerSatisfactionReport";
//import { CustomerSatisfactionBadge } from "../../../Customers/CustomerSatisfactionBadge"; AdminCustomerSatisfactionReportItem  AdminMapCustomerSatisfaction
import { CustomerSatisfactionBadge } from "../../../../../sales/components/Customers/CustomerSatisfactionBadge";
import { AdminCustomerSatisfactionReportItem } from "../Types/CustomerSatisfactionType";
import { AdminMapCustomerSatisfaction } from "../Types/CustomerSatisfactionType";

interface Props {
  data: AdminCustomerSatisfactionReportItem[];
}

export const AdminCustomerSatisfactionTable: React.FC<Props> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="bg-white p-12 text-center rounded border">
        No hay datos de satisfacción
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow">
      <table className="w-full">
        <thead>
          <tr className="text-xs uppercase text-gray-500 border-b">
            <th className="px-4 py-3 text-left">N° Pedido</th>
            <th className="px-6 py-3 text-left">Cliente</th>
            <th className="px-6 py-3 text-left">Email</th>
            <th className="px-6 py-3 text-left">Satisfacción</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row.orderId} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3">{row.orderId}</td>

              <td className="px-6 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center">
                    {row.customer.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{row.customer}</div>
                    <div className="text-xs text-gray-400">Cliente registrado</div>
                  </div>
                </div>
              </td>

              <td className="px-6 py-3">{row.email}</td>

              <td className="px-6 py-3">
                <CustomerSatisfactionBadge
                 status={AdminMapCustomerSatisfaction(row.level)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
