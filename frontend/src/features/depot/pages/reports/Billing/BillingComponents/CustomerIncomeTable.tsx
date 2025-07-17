import React from "react";
import type { Billing } from "../../../../billingmanager/types/BillingType";

type Props = {
    data: {
        orderid: Billing['orderID']
        billingDate: Billing['billingDate']
        totalAmount: Billing['totalAmount']
    }[];
};

const CustomerIncomeTable: React.FC<Props> = ({data}) => {
    return(
        <div className="overflow-x-auto rounded shadow bg-white">
            <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="px-4 py-2">Pedido ID</th>
                        <th className="px-4 py-2">Fecha Factura</th>
                        <th className="px-4 py-2">Total Factura</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.orderid} className="border-t">
                            <td className="px-4 py-2">{item.orderid}</td>
                            <td className="px-4 py-2">{item.billingDate}</td>
                            <td className="px-4 py-2">${item.totalAmount.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CustomerIncomeTable;