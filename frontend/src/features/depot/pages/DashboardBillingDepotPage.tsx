// dashboard de reportes de Billing:

import { User, FileText, PieChart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const BillingCards = [
  {
    title: "Tiempos de proceso de facturación",
    description:
      "Visualiza los tiempos que llevó la facturación de cada uno de los pedidos",
    icon: <PieChart className="h-10 w-10 text-red-600" />,
    link: "/depot/billingmanager/reports/billingTimeProcess",
  },
  {
    title: "Ingresos por clientes",
    description:
      "En base a los ingresos por clientes, visualiza cuáles tuvieron el mayor impacto",
    icon: <User className="h-10 w-10 text-red-600" />,
    link: "/depot/billingmanager/reports/customerIncome",
  },
  {
    title: "Pedidos facturados",
    description: "Visualiza todos los pedidos que ya han sido facturados.",
    icon: <FileText className="h-10 w-10 text-red-600" />,
    link: "/depot/billingmanager/reports/orderBilled",
  },
];

export const DashboardBillingReportsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Botón Volver */}
        <div className="flex justify-between items-center mb-4">
            <button
                onClick={() => navigate('/depot/billingmanager')}
                className="text-red-600 hover:underline font-medium"
            >
            ← Volver atrás
            </button>
        </div>

        {/* Título */}
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Panel de reportes de Facturación
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Todos los reportes para la toma de decisiones
        </p>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BillingCards.map((card, idx) => (
            <Link
              key={idx}
              to={card.link}
              className="flex flex-col items-start gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition"
            >
              <div className="flex items-center justify-center rounded-full bg-red-100 p-3">
                {card.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {card.title}
              </h3>
              <p className="text-gray-600 text-sm">{card.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
