import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AdminCustomerSatisfactionReportItem } from "../Types/CustomerSatisfactionType";

interface Props {
  data: AdminCustomerSatisfactionReportItem[];
}

export const AdminGraphSatisfactionCustomerSatisfaction: React.FC<Props> = ({ data }) => {
  const counts = {
    Positiva: 0,
    Negativa: 0,
    Neutra: 0,
  };

  data.forEach((d) => counts[d.level]++);

  const chartData = [
    { name: "Positiva", cantidad: counts.Positiva },
    { name: "Negativa", cantidad: counts.Negativa },
    { name: "Neutra", cantidad: counts.Neutra },
  ];

  return (
    <div className="bg-white rounded shadow p-6">
      <h3 className="text-xl font-semibold text-center mb-4">
        Clasificación de Comentarios
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="cantidad" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
