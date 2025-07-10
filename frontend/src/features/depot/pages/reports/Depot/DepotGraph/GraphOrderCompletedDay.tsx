import React from "react";
import type { Order } from "../../../../../sales/types/OrderTypes";
import { BarChart, Bar, XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,Legend,} from "recharts";

type DataProps = {
    data : {orderId: Order['id'], finishDate: Order['finishDate']}[];
}

const GraphOrderCompletedDay : React.FC<DataProps> = ({data}) => {
    const groupedData = data.reduce(
        (acc: Record<string, number>, curr: { orderId: Order['id']; finishDate: Order['finishDate'] }) => {
        const dateKey = new Date(curr.finishDate).toISOString().split("T")[0];
        acc[dateKey] = (acc[dateKey] || 0) + 1;
        return acc;
        },
        {}
    );

    const chartData = Object.entries(groupedData).map(([date, total]) => ({
        date,
        total,
    }));

    return(
        <div className="w-full h-80 bg-white rounded-lg shadow p-4 mt-6">
            <h3 className="text-xl font-semibold mb-4">Gráfico de Pedidos Completados por Día</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" name="Completados" fill="#4CAF50" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default GraphOrderCompletedDay;