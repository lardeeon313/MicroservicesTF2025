import { ModifiedCanceledOrder } from "../../../../admin/pages/AdminDashboardFeatures/ReportsSales/Types/ModifiedCanceledReportType";
import { ModifiedCanceledOrderStatus } from "../../../../admin/pages/AdminDashboardFeatures/ReportsSales/Types/ModifiedCanceledReportType";

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
    orders: ModifiedCanceledOrder[];
};

const AdminGraphModifiedCanceledOrders: React.FC<Props> = ({ orders }) => {

    // Estados considerados en la tabla
    const filteredOrders = orders.filter((order) =>
        [
            ModifiedCanceledOrderStatus.Canceled,
            ModifiedCanceledOrderStatus.PendingReissued,
            ModifiedCanceledOrderStatus.Pending,
            ModifiedCanceledOrderStatus.PendingResolution,
            ModifiedCanceledOrderStatus.ReIssued,
        ].includes(order.status)
    );

    // Contadores
    const counts = {
        canceled: filteredOrders.filter(o => o.status === ModifiedCanceledOrderStatus.Canceled).length,
        pendingReissued: filteredOrders.filter(o => o.status === ModifiedCanceledOrderStatus.PendingReissued).length,
        pending: filteredOrders.filter(o => o.status === ModifiedCanceledOrderStatus.Pending).length,
        pendingResolution: filteredOrders.filter(o => o.status === ModifiedCanceledOrderStatus.PendingResolution).length,
        reissued: filteredOrders.filter(o => o.status === ModifiedCanceledOrderStatus.ReIssued).length,
    };

    const total = filteredOrders.length;

    // Mapeo datos del gráfico
    const chartData = [
        { name: "Cancelado", cantidad: counts.canceled, color: "#ef4444" },
        { name: "Pend. Reemisión", cantidad: counts.pendingReissued, color: "#0ea5e9" },
        { name: "Pendiente", cantidad: counts.pending, color: "#f59e0b" },
        { name: "Pend. Resolución", cantidad: counts.pendingResolution, color: "#8b5cf6" },
        { name: "Reemitido", cantidad: counts.reissued, color: "#10b981" },
    ];

    // Tooltip custom
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const barColor = payload[0].payload.color;

            return (
                <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-4">
                    <p className="font-semibold text-gray-800 mb-2">{label}</p>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: barColor }} />
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
                        Estados de Pedidos Irregulares
                    </h1>
                    <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-red-500 rounded-full"></div>
                </div>
                <p className="text-gray-600 text-sm">Comparación de pedidos cancelados y modificados</p>
            </div>

            {/* Chart */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl border border-gray-200/50 p-6">
                <ResponsiveContainer width="100%" height={350}>
                    {total === 0 ? (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center max-w-md">
                                <div className="text-6xl mb-4 opacity-40">📊</div>
                                <h4 className="text-xl font-semibold text-gray-700 mb-2">
                                    Sin datos disponibles
                                </h4>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    No hay pedidos irregulares para mostrar en este momento.<br/>
                                </p>
                            </div>
                        </div>
                    ) : (
                        <BarChart
                            data={chartData}
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
                                tickLine={false}
                                axisLine={{ stroke: "#d1d5db" }}
                            />

                            <YAxis
                                allowDecimals={false}
                                stroke="#6b7280"
                                fontSize={12}
                                tickLine={false}
                                axisLine={{ stroke: "#d1d5db" }}
                                tickMargin={10}
                            />

                            <Tooltip content={<CustomTooltip />} />

                            <Legend
                                wrapperStyle={{ color: "#374151", fontWeight: 500, paddingTop: 20 }}
                                iconType="circle"
                            />

                            <Bar dataKey="cantidad" radius={[6, 6, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={index}
                                        fill={entry.color}
                                        className="hover:opacity-80 transition-all duration-300 drop-shadow-sm"
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    )}
                </ResponsiveContainer>

                {/* Stats - Solo mostrar si hay datos */}
                {total > 0 && (
                    <div className="flex justify-center gap-10 mt-6 pt-4 border-t border-gray-200">
                        {/* Cancelado */}
                        <Stat label="Cancelados" value={counts.canceled} color="bg-red-500" />

                        {/* Pend Reemisión */}
                        <Stat label="Pend. Reemisión" value={counts.pendingReissued} color="bg-sky-500" />

                        {/* Pendiente */}
                        <Stat label="Pendientes" value={counts.pending} color="bg-yellow-500" />

                        {/* Pend Resolución */}
                        <Stat label="Pend. Resolución" value={counts.pendingResolution} color="bg-violet-500" />

                        {/* Reemitidos */}
                        <Stat label="Reemitidos" value={counts.reissued} color="bg-green-500" />

                        {/* Total */}
                        <Stat label="Total" value={total} color="bg-gray-500" />
                    </div>
                )}
            </div>
        </div>
    );
};

const Stat = ({ label, value, color }: any) => (
    <div className="text-center">
        <div className="flex items-center gap-2 justify-center mb-1">
            <div className={`w-3 h-3 rounded-full ${color}`}></div>
            <span className="text-sm font-medium text-gray-600">{label}</span>
        </div>
        <span className="text-2xl font-bold text-gray-700">{value}</span>
    </div>
);

export default AdminGraphModifiedCanceledOrders;