import { CustomerSatisfaction, CustomerWithCount } from "../../../types/CustomerTypes";
import { CustomerSatisfactionBadge } from "../../Customers/CustomerSatisfactionBadge";

interface Props {
  data: (CustomerWithCount & { pedidoID?: string | number })[];
}

export const CustomerSatisfactionTable: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full overflow-hidden rounded-lg border shadow-md border-gray-200">
        <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-800">
            <thead className="bg-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-600">
            <tr>
                <th className="px-4 py-3 text-left">Cliente</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Pedido ID</th>
                <th className="px-4 py-3 text-left">Satisfacción</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
            {data.map((row, index) => (
                <tr key={row.id} className={index % 2 === 0 ? "bg-white" : "bg-red-50"}>
                <td className="px-4 py-3">{row.firstName} {row.lastName}</td>
                <td className="px-4 py-3">{row.email}</td>
                <td className="px-4 py-3">{row.pedidoID ?? "N/A"}</td>
                <td className="px-4 py-3"><CustomerSatisfactionBadge status={row.satisfaction ?? CustomerSatisfaction.Neutra}></CustomerSatisfactionBadge></td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    </div>
  );
};
