import React from "react";
import type { CustomerIncome } from "../../../../../sales/types/CustomerTypes";


type Props = {
  data: {
    id: CustomerIncome['id'];
    FirstName : CustomerIncome['FirstName']
    LastName : CustomerIncome['LastName']
    TotalIncome: CustomerIncome['TotalIncome']
  }[]
};

const BillingTimeProcessTable : React.FC<Props> = ({data}) => {
    return(
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 shadow rounded-lg">
                <thead className="bg-gray-200 text-gray-700">
                <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Cliente: </th>
                    <th className="px-4 py-2 text-left">($) Total Ingresos </th>
                </tr>
                </thead>
            <tbody>
            {data.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                    <td className="px-4 py-2">{item.id}</td>
                    <td className="px-4 py-2">{item.FirstName} - {item.LastName}</td>
                    <td className="px-4 py-2">${item.TotalIncome.toLocaleString()}</td>
                </tr>
            ))}
            </tbody>
            </table>
        </div>
    )
}

export default BillingTimeProcessTable;