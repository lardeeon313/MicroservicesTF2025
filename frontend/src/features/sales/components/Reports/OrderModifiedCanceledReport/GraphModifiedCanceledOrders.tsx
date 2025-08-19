import { Order, OrderStatus } from "../../../types/OrderTypes"
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type props = {
    orders: Order[];
}

const GraphModifiedCanceledOrders: React.FC<props> = ({ orders }) => {

    const filteredOrders = orders.filter(
        (order) =>
            order.status === OrderStatus.Canceled ||
            order.status === OrderStatus.Issued
    );

    const charData = [
        {
            name: "Cancelado",
            cantidad: filteredOrders.filter((o) => o.status === OrderStatus.Canceled).length,
        },
        {
            name: "Modificado",
            cantidad: filteredOrders.filter((o) => o.status === OrderStatus.Issued).length,
        },
    ];

    return (
        <div className="max-w-full mt-20 h-96 mb-14">
            <h1 className="text-center text-2xl font-bold text-red-600 mb-6">
                Pedidos Cancelados vs Modificados
            </h1>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={charData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" stroke="#ffffff" />
                    <YAxis allowDecimals={false} stroke="#ffffff" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#1e3a8a",
                            border: "none",
                            color: "white",
                        }}
                        labelStyle={{ color: "white" }}
                        itemStyle={{ color: "white" }}
                    />
                    <Legend wrapperStyle={{ color: "black" }} />
                    <Bar dataKey="cantidad">
                        {charData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.name === "Cancelado" ? "#f87171" : "#60a5fa"} 
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GraphModifiedCanceledOrders;
