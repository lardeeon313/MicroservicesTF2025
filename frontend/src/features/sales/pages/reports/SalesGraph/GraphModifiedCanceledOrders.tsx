import React from "react";
import type { Order } from "../../../types/OrderTypes";
import { OrderStatus } from "../../../types/OrderTypes";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Props{
    orders: Order[];
}

const GraphModifiedCanceledOrders : React.FC<Props> = ({orders}) => {
    const filteredOrders = orders.filter(
        (order) =>
            order.status === OrderStatus.Canceled ||
            order.status === OrderStatus.Modified
    ); 

    //en base al estado que tenga realiza el grafico 
    const countByStatus = {
        Cancelado: filteredOrders.filter((o) => o.status === OrderStatus.Canceled).length,
        Modificado: filteredOrders.filter((o) => o.status === OrderStatus.Modified).length,
    };

    const ChartData = [
        { name: "Cancelado", cantidad: countByStatus.Cancelado },
        { name: "Modificado", cantidad: countByStatus.Modificado },
    ]

    return(
        <div>
            <div className="w-full h-64 rounded-xl p-4" style={{ backgroundColor: "#1e3a8a" }}>
                <h1 className="text-blue-800 text-1xl font-bold">Grafico de pedidos cancelados y modificados</h1>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ChartData}>
                        <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
                        <XAxis dataKey="name" stroke="#ffffff" />
                        <YAxis allowDecimals={false} stroke="#ffffff" />
                        <Tooltip
                            contentStyle={{ backgroundColor: "#1e3a8a", border: "none", color: "white" }}
                            labelStyle={{ color: "white" }}
                            itemStyle={{ color: "white" }}
                        />
                        <Legend wrapperStyle={{ color: "white" }} />
                        <Bar dataKey="cantidad" fill="#60a5fa" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default GraphModifiedCanceledOrders;