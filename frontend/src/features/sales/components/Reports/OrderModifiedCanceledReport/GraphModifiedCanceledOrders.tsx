import { Order, OrderStatus } from "../../../types/OrderTypes";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type Props = {
    orders: Order[];
};

const GraphModifiedCanceledOrders: React.FC<Props> = ({ orders }) => {
    // Filtrar solo estados relevantes
    const filteredOrders = orders.filter(
        (order) =>
            order.status === OrderStatus.Canceled ||
            order.status === OrderStatus.Issued ||
            order.status === OrderStatus.Pending
    );

    // Estadísticas
    const countCanceled = filteredOrders.filter((o) => o.status === OrderStatus.Canceled).length;
    const countModified = filteredOrders.filter((o) => o.status === OrderStatus.Issued).length;
    const countPending = filteredOrders.filter((o) => o.status === OrderStatus.Pending).length;

    // Datos del gráfico
    const charData = [
        {
            name: "Cancelado",
            cantidad: countCanceled,
            color: "#ef4444",
        },
        {
            name: "Modificado",
            cantidad: countModified,
            color: "#3b82f6",
        },
        {
            name: "Pendiente",
            cantidad: countPending,
            color: "#f59e0b",
        },
    ];

    // Tooltip corregido (payload[0].payload.color ahora sí existe)
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const barColor = payload[0].payload.color;

            return (
                <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-4">
                    <p className="font-semibold text-gray-800 mb-2">{label}</p>
                    <div className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: barColor }}
                        />
                        <span className="text-gray-700">
                            Cantidad:{" "}
                            <span className="font-bold text-gray-900">{payload[0].value}</span>
                        </span>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="max-w-full mt-20 mb-14">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 mb-4">
                    <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-blue-500 rounded-full"></div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                        Pedidos Cancelados, Modificados y Pendientes
                    </h1>
                    <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-red-500 rounded-full"></div>
                </div>
                <p className="text-gray-600 text-sm">Comparación de estados de pedidos</p>
            </div>

            {/* Gráfico */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl border border-gray-200/50 p-6">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                        data={charData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        barCategoryGap="25%"
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                            strokeOpacity={0.6}
                            vertical={false}
                        />

                        <XAxis
                            dataKey="name"
                            stroke="#6b7280"
                            fontSize={14}
                            fontWeight={500}
                            tickLine={false}
                            axisLine={{ stroke: "#d1d5db", strokeWidth: 1 }}
                        />

                        <YAxis
                            allowDecimals={false}
                            stroke="#6b7280"
                            fontSize={12}
                            tickLine={false}
                            axisLine={{ stroke: "#d1d5db", strokeWidth: 1 }}
                            tickMargin={10}
                        />

                        <Tooltip content={<CustomTooltip />} />

                        <Legend
                            wrapperStyle={{
                                color: "#374151",
                                fontWeight: "500",
                                paddingTop: "20px",
                            }}
                            iconType="circle"
                        />

                        <Bar dataKey="cantidad" radius={[6, 6, 0, 0]} stroke="none">
                            {charData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    className="hover:opacity-80 transition-all duration-300 drop-shadow-sm"
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>

                {/* Estadísticas */}
                <div className="flex justify-center gap-10 mt-6 pt-4 border-t border-gray-200">
                    {/* Cancelado */}
                    <div className="text-center">
                        <div className="flex items-center gap-2 justify-center mb-1">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-sm font-medium text-gray-600">Cancelados</span>
                        </div>
                        <span className="text-2xl font-bold text-red-600">{countCanceled}</span>
                    </div>

                    {/* Modificado */}
                    <div className="text-center">
                        <div className="flex items-center gap-2 justify-center mb-1">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span className="text-sm font-medium text-gray-600">Modificados</span>
                        </div>
                        <span className="text-2xl font-bold text-blue-600">{countModified}</span>
                    </div>

                    {/* Pendiente */}
                    <div className="text-center">
                        <div className="flex items-center gap-2 justify-center mb-1">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span className="text-sm font-medium text-gray-600">Pendientes</span>
                        </div>
                        <span className="text-2xl font-bold text-yellow-600">{countPending}</span>
                    </div>

                    {/* Total */}
                    <div className="text-center">
                        <div className="flex items-center gap-2 justify-center mb-1">
                            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                            <span className="text-sm font-medium text-gray-600">Total</span>
                        </div>
                        <span className="text-2xl font-bold text-gray-700">
                            {filteredOrders.length}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GraphModifiedCanceledOrders;
