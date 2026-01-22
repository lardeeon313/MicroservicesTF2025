import React, { useMemo } from "react";
import {
  Cell,
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { CustomerStatus } from "../../../../../sales/types/CustomerTypes";
import { CustomerStatusReportDto } from "../Types/CustomerStatusReportType";

const COLORS = ["#FFA500", "#FF0000", "#33aa22"]; // Inactivo, Perdido, Activo
const RADIAN = Math.PI / 180;

type Props = {
  customers: CustomerStatusReportDto[];
};

/* =======================
   Labels (MISMO DISEÑO)
======================= */
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  name,
  value,
}: any) => {
  if (percent === 0) return null;

  const radius = outerRadius * 1.4;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <g>
      <line
        x1={cx + (outerRadius + 8) * Math.cos(-midAngle * RADIAN)}
        y1={cy + (outerRadius + 8) * Math.sin(-midAngle * RADIAN)}
        x2={x - (x > cx ? 8 : -8)}
        y2={y}
        stroke="#666"
        strokeWidth={1.5}
        opacity={0.7}
        strokeDasharray="2,2"
      />

      <rect
        x={x > cx ? x - 5 : x - 95}
        y={y - 16}
        width={100}
        height={32}
        fill="rgba(255, 255, 255, 0.95)"
        stroke="rgba(0, 0, 0, 0.1)"
        strokeWidth={1}
        rx={6}
      />

      <text
        x={x}
        y={y - 4}
        fill="#2c3e50"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={13}
        fontWeight="600"
      >
        {`${name}: ${value}`}
      </text>

      <text
        x={x}
        y={y + 8}
        fill="#7f8c8d"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={11}
        fontWeight="500"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    </g>
  );
};

const GraphCustomerStatusReport: React.FC<Props> = ({ customers }) => {
  /* =======================
     CONTEO CORRECTO
     (DTO DEL BACK)
  ======================= */
  const data = useMemo(() => {
    const active = customers.filter(
      c => c.status === CustomerStatus.Active
    ).length;

    const inactive = customers.filter(
      c => c.status === CustomerStatus.Inactive
    ).length;

    const lost = customers.filter(
      c => c.status === CustomerStatus.Lost
    ).length;

    return [
      { name: "Inactivos", value: inactive },
      { name: "Perdidos", value: lost },
      { name: "Activos", value: active },
    ];
  }, [customers]);

  const total = data.reduce((acc, d) => acc + d.value, 0);

  return (
    <div className="max-w-full mt-8 mb-16 px-6">
      <div className="text-center mb-10">
        <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-green-600">
          Distribución de Clientes
        </h3>
      </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <ResponsiveContainer width="100%" height={380}>
            {total === 0 ? (
                <div className="flex justify-center items-center h-full text-gray-500">
                Sin datos para mostrar
                </div>
            ) : (
                <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="52%"
                outerRadius={92}
                    innerRadius={28}
                    dataKey="value"
                    fill="rgba(0,0,0,0.08)"
                    stroke="none"
                />

                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={25}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    stroke="#fff"
                    strokeWidth={4}
                >
                    {data.map((_, index) => (
                    <Cell
                        key={index}
                        fill={COLORS[index]}
                        style={{
                        filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.15))",
                        }}
                    />
                    ))}
                </Pie>

                <Tooltip />
                <Legend verticalAlign="bottom" iconType="circle" />
                </PieChart>
            )}
            </ResponsiveContainer>
            </div>
            <div className="flex justify-center mt-6">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-gray-50 to-indigo-50 px-6 py-3 rounded-lg border border-gray-200 shadow-sm">
                    <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                        <span className="text-gray-700 font-medium">Total de clientes:</span>
                        <span className="text-2xl font-bold text-gray-600 bg-white px-4 py-1 rounded-md border border-gray-300">
                        {total}
                    </span>
                </div>
            </div>
    </div>
  );
};

export default GraphCustomerStatusReport;
