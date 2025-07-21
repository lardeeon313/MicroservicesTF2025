import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { SalesPerfomanceDto } from "../../../types/OrderTypes";

interface Props {
  data: SalesPerfomanceDto[];
}

export const GraphSalesPerfomanceReport = ({ data }: Props) => {
  const hasData = data.some((d) => d.totalOrders > 0 || d.totalUnitsSold > 0);

  return (
    <div className="max-w-full mt-20 h-96 mb-14">
      <h1 className="text-center text-2xl font-bold text-red-600 mb-6">
        Rendimiento de Ventas
      </h1>

      <ResponsiveContainer>
        {hasData ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="salesPersonName" />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalOrders" fill="#60a5fa" name="Pedidos" />
            <Bar dataKey="totalUnitsSold" fill="#1e3a8a" name="Unidades" />
          </BarChart>
        ) : (
          // 👇 Se mantiene la altura y estructura
          <div className="w-full h-full flex items-center justify-center border border-dashed rounded text-gray-500 text-sm">
            No hay datos disponibles para mostrar.
          </div>
        )}
      </ResponsiveContainer>
    </div>
  );
};
