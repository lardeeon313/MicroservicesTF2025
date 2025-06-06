import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CustomerSatisfaction, CustomerWithCount } from "../../../types/CustomerTypes";

interface Props {
  customers: CustomerWithCount[];
}

const classifySatisfaction = (text?: string): CustomerSatisfaction => {
  if (!text || text.trim() === "") return CustomerSatisfaction.Neutra; // Maneja valores vacíos

  const lower = text.toLowerCase().trim();
  const positivas = ["buena","positiva", "excelente", "amable", "rápida", "satisfecho"];
  const negativas = ["mala","negativa", "poca", "insatisfecho", "tarde", "demora"];

  if (positivas.some(p => lower.includes(p))) return CustomerSatisfaction.Positiva;
  if (negativas.some(n => lower.includes(n))) return CustomerSatisfaction.Negativa;

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

  return (
    <div className="max-w-full mt-20 h-96 mb-14">
      <h1 className="text-center text-2xl font-bold text-red-600 mb-6">
        Clasificación de Comentarios
      </h1>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="tipo" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="cantidad" fill="#AA2222" className="opacity-90" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};