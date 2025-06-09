import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { Billing } from "../../../../billingmanager/types/BillingType";


type Props = {
    data: {
        BillingDate: Billing['billingDate'],
        TotalAmount: Billing['totalAmount']
    }[];
}

const GraphCustomerIncome : React.FC<Props> = ({data}) => {
    const resume = data.reduce((acc, curr) => {
        const fecha = curr.BillingDate;
        const existente = acc.find((d) => d.fecha === fecha);
        if (existente) {
            existente.total += curr.TotalAmount;
        } else {
            acc.push({ fecha, total: curr.TotalAmount });
        }
        return acc;
    }, [] as { fecha: string; total: number }[]);

    return(
        <div className="h-64 bg-white rounded shadow p-4">
            <h4 className="text-lg font-semibold mb-2">Totales Facturados por Fecha</h4>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={resume}>
                        <XAxis dataKey="fecha" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="total" fill="#4f46e5" />
                    </BarChart>
                </ResponsiveContainer>
        </div>
    )


}

export default GraphCustomerIncome;