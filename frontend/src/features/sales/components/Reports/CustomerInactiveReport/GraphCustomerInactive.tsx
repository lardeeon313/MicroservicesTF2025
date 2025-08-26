import React from "react";
import {
  Cell,
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { CustomerStatus, CustomerWithCount } from "../../../types/CustomerTypes";

const COLORS = ["#FFA500", "#FF0000", "#33aa22"]; // naranja, rojo, verde
const RADIAN = Math.PI / 180;

type Props = {
  customers: CustomerWithCount[];
};

// 🎯 función para renderizar las etiquetas externas mejoradas
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  name,
  value,
}: any) => {
  if (percent === 0) return null; // evitar etiquetas de 0%

  const radius = outerRadius * 1.4; // mayor separación para mejor legibilidad
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <g>
      {/* Línea conectora elegante */}
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
      
      {/* Fondo elegante para la etiqueta */}
      <rect
        x={x > cx ? x - 5 : x - 95}
        y={y - 16}
        width={100}
        height={32}
        fill="rgba(255, 255, 255, 0.95)"
        stroke="rgba(0, 0, 0, 0.1)"
        strokeWidth={1}
        rx={6}
        filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
      />
      
      {/* Texto del nombre */}
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
      
      {/* Porcentaje con estilo */}
      <text
        x={x}
        y={y + 8}
        fill="#7f8c8d"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={11}
        fontWeight="500"
        opacity={0.8}
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    </g>
  );
};

const GraphCustomerInactive: React.FC<Props> = ({ customers }) => {
  const inactiveCount = customers.filter(
    (c) => c.status === CustomerStatus.Inactive
  ).length;
  const lostCount = customers.filter(
    (c) => c.status === CustomerStatus.Lost
  ).length;
  const activeCount = customers.filter(
    (c) => c.status === CustomerStatus.Active
  ).length;

  const data = [
    { name: "Inactivos", value: inactiveCount },
    { name: "Perdidos", value: lostCount },
    { name: "Activos", value: activeCount },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="max-w-full mt-8 mb-16 px-6">
      {/* Header mejorado con diseño moderno */}
      <div className="text-center mb-10">
        <div className="inline-block">
          <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-green-600 mb-3">
            Distribución de Clientes
          </h3>
          <div className="h-1 w-full bg-gradient-to-r from-red-500 via-orange-400 to-green-500 rounded-full opacity-60"></div>
        </div>
        <p className="text-gray-600 text-sm font-medium mt-4 opacity-80">
          Estado actual de la base de clientes • Análisis de actividad
        </p>
      </div>

      {/* Contenedor del gráfico con sombra elegante */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <ResponsiveContainer width="100%" height={380}>
          {total === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center max-w-md">
                <div className="text-6xl mb-4 opacity-40">📊</div>
                <h4 className="text-xl font-semibold text-gray-700 mb-2">
                  Sin datos disponibles
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  No hay información de clientes para mostrar en este momento.<br/>
                  Agregue clientes para visualizar la distribución.
                </p>
              </div>
            </div>
          ) : (
            <PieChart>
              {/* Sombra sutil para profundidad */}
              <Pie
                data={data}
                cx="50%"
                cy="52%"
                outerRadius={92}
                innerRadius={28}
                dataKey="value"
                stroke="none"
                fill="rgba(0,0,0,0.08)"
              />
              
              {/* Gráfico principal mejorado */}
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={25}
                dataKey="value"
                labelLine={false}
                label={renderCustomizedLabel}
                stroke="#ffffff"
                strokeWidth={4}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    style={{
                      filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.15)) brightness(1.05)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    }}
                  />
                ))}
              </Pie>
              
              {/* Tooltip elegante */}
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.98)",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                  fontSize: "14px",
                  padding: "12px 16px"
                }}
                labelStyle={{ 
                  color: "#2c3e50", 
                  fontWeight: "600",
                  marginBottom: "4px"
                }}
                itemStyle={{
                  color: "#34495e",
                  fontWeight: "500"
                }}
              />
              
              {/* Leyenda mejorada */}
              <Legend
                verticalAlign="bottom"
                height={50}
                iconType="circle"
                wrapperStyle={{
                  paddingTop: "25px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#2c3e50"
                }}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Resumen estadístico elegante */}
      {total > 0 && (
        <div className="flex justify-center mt-8">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl px-6 py-3 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700 font-medium">
                Total de clientes: 
                <span className="ml-2 text-lg font-bold text-gray-900 bg-white px-3 py-1 rounded-lg border">
                  {total.toLocaleString()}
                </span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphCustomerInactive;