import { CustomerWithCount } from "../../../types/CustomerTypes"
import { CustomerStatusBadge } from "../../Customers/CustomerStatusBadge";


type Props = {
    data: CustomerWithCount[];
}

const aggregateCustomerOrders = (data: CustomerWithCount[]) => {
  const groupedData = data.reduce((acc, customer) => {
    const customerId = Number(customer.id);
    acc[customerId] = acc[customerId] || { ...customer, orderCount: 0 };
    acc[customerId].orderCount += customer.orderCount;
    return acc;
  }, {} as Record<number, CustomerWithCount>);

  return Object.values(groupedData);
};


const CustomerInactiveTable: React.FC<Props> = ({ data }) => {
    const aggregatedData = aggregateCustomerOrders(data); 
    const totalOrders = aggregatedData.reduce((acc, customer) => acc + customer.orderCount, 0);

    return (
    <div className="w-full overflow-hidden rounded-lg border shadow-md border-gray-200">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-800">
                <thead className="bg-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-600">
                <tr>
                    <th className="px-4 py-3 text-left">Nombre</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Teléfono</th>
                    <th className="px-4 py-3 text-left">Cantidad de Pedidos</th>
                    <th className="px-4 py-3 text-left">Estado de Cliente</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {data.map((cliente, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-red-50"}>
                    <td className="px-4 py-3">{cliente.fullName}</td>
                    <td className="px-4 py-3">{cliente.email}</td>
                    <td className="px-4 py-3">{cliente.phoneNumber}</td>
                    <td className="px-4 py-3 text-center">{cliente.orderCount}</td>
                    <td className="px-4 py-3"><CustomerStatusBadge status={cliente.status}></CustomerStatusBadge></td>

                    </tr>
                ))}
                <tr className="bg-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-600">
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3">Total de pedidos {totalOrders}</td>
                    <td className="px-4 py-3"></td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
    )
}

export default CustomerInactiveTable;