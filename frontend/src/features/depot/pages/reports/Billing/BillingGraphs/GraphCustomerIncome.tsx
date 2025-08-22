import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { Billing } from "../../../../billingmanager/types/BillingType";

type Props = {
  data: {
    BillingDate: Billing["orderDate"];
    TotalAmount: Billing["totalAmount"];
  }[];
};

const GraphCustomerIncome: React.FC<Props> = ({ data }) => {
    const resume = data.reduce((acc, curr) => {
  // ✅ Parseo seguro de fecha
  const fechaObj = new Date(curr.BillingDate);
  const fecha = isNaN(fechaObj.getTime())
    ? String(curr.BillingDate)
    : fechaObj.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

  const existente = acc.find((d) => d.fecha === fecha);
  if (existente) {
    existente.total += curr.TotalAmount;
  } else {
    acc.push({ fecha, total: curr.TotalAmount });
  }
  return acc;
}, [] as { fecha: string; total: number }[]);


  return (
    <div className="h-72 bg-white rounded-2xl shadow-md p-6">
      <h4 className="text-lg font-semibold mb-4 text-center">
        Totales Facturados por Fecha
      </h4>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={resume} margin={{ top: 10, right: 30, left: 10, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="fecha"
            angle={0}             // recto
            textAnchor="middle"   // centrado
            height={50}           // espacio extra
        />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number) =>
              `$${value.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}`
            }
            labelFormatter={(label) => `Fecha: ${label}`}
          />
          <Bar dataKey="total" fill="#4f46e5" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraphCustomerIncome;
