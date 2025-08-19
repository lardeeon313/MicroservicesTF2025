import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import { CustomerSatisfaction, CustomerWithCount } from "../../../types/CustomerTypes";

interface Props {
  customers: CustomerWithCount[];
}

const classifySatisfaction = (text?: string): CustomerSatisfaction => {
  if (!text || text.trim() === "") return CustomerSatisfaction.Neutra;

  const lower = text.toLowerCase().trim();
  const positivas = ["buena", "positiva", "excelente", "amable", "rápida", "satisfecho"];
  const negativas = ["mala", "negativa", "poca", "insatisfecho", "tarde", "demora"];

  if (positivas.some((p) => lower.includes(p))) return CustomerSatisfaction.Positiva;
  if (negativas.some((n) => lower.includes(n))) return CustomerSatisfaction.Negativa;

  return CustomerSatisfaction.Neutra;
};

export const GraphSatisfactionCustomer: React.FC<Props> = ({ customers }) => {
  const stats = { Positiva: 0, Negativa: 0, Neutra: 0 };

  customers.forEach((c) => {
    const tipo = classifySatisfaction(c.satisfaction ?? "");
    stats[tipo]++;
  });

  const data = [
    { tipo: "Positiva", cantidad: stats.Positiva },
    { tipo: "Negativa", cantidad: stats.Negativa },
    { tipo: "Neutra", cantidad: stats.Neutra },
  ];

  // Colores por tipo
  const COLORS: Record<string, string> = {
    Positiva: "#22c55e", // verde
    Negativa: "#ef4444", // rojo
    Neutra: "#facc15", // amarillo
  };

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { tipo, cantidad } = payload[0].payload;
      return (
        <div
          className="p-2 rounded-lg shadow-md text-white"
          style={{ backgroundColor: COLORS[tipo] }}
        >
          <p className="font-semibold">{tipo}</p>
          <p>{`Cantidad: ${cantidad}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-full mt-20 h-96 mb-14">
      <h1 className="text-center text-2xl font-bold text-red-600 mb-6">
        Clasificación de Comentarios
      </h1>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barSize={80}>
          {/* 📌 Líneas de referencia */}
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          <XAxis dataKey="tipo" />
          <YAxis allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="cantidad" radius={[10, 10, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.tipo]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
