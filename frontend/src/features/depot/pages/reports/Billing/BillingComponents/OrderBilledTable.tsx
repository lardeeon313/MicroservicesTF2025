import type { BillingTimeProcess } from "../../../../billingmanager/types/BillingTimeProcessType";

type Props = {
    data : BillingTimeProcess[];
}

const OrderBilledTable: React.FC<Props> = ({data}) => {
    return(
        <div className="overflow-x-auto rounded shadow bg-white">
            <table className="w-full border mt-4">
            <thead className="bg-gray-100 text-gray-700">
                <tr>
                    <th className="px-4 py-2">Pedido ID</th>
                    <th className="px-4 py-2">Fecha Pedido</th>
                    <th className="px-4 py-2">Fecha Factura</th>
                    <th className="px-4 py-2">Tiempo (días)</th>
                </tr>
            </thead>
            <tbody>
            {data.map((row) => (
                <tr key={row.OrderId}>
                    <td className="px-4 py-2">{row.OrderId}</td>
                    <td className="px-4 py-2">{row.dateOrder}</td>
                    <td className="px-4 py-2">{row.dateBilling}</td>
                    <td className="px-4 py-2">{row.TimeProcess}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
    )
}

export default OrderBilledTable;