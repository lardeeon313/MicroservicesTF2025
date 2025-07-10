import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { Customer } from "../../../types/CustomerTypes";

interface Props {
  customers: Customer[];
}

const classifySatisfaction = (text: string): "Positiva" | "Negativa" | "Neutra" => {
  const lower = text.toLowerCase();
  const positivas = ["buena", "excelente", "amable", "rápida", "satisfecho"];
  const negativas = ["mala", "poca", "insatisfecho", "tarde", "demora"];

  if (positivas.some((p) => lower.includes(p))) return "Positiva";
  if (negativas.some((n) => lower.includes(n))) return "Negativa";
  return "Neutra";
};

const GraphSatisfactionCustomer: React.FC<Props> = ({ customers }) => {
  const stats = { Positiva: 0, Negativa: 0, Neutra: 0 };

  customers.forEach((c) => {
    const tipo = classifySatisfaction(c.descriptionsatisfaction ?? "");
    stats[tipo]++;
  });

  const data = [
    { tipo: "Positiva", cantidad: stats.Positiva },
    { tipo: "Negativa", cantidad: stats.Negativa },
    { tipo: "Neutra", cantidad: stats.Neutra },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4 text-blue-800">
        Clasificación de Comentarios
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="tipo" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="cantidad" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraphSatisfactionCustomer;