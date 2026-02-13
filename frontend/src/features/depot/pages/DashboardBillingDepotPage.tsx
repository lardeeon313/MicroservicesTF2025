// dashboard de reportes de Billing:

import { User, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import BackButton from "../../../components/BackButton";

const BillingCards = [
  {
    title: "Ingresos por clientes",
    description:
      "En base a los ingresos por clientes, visualiza cuáles tuvieron el mayor impacto",
    icon: <User className="h-10 w-10 text-red-600" />,
    link: "/depot/billingmanager/reports/customerIncome",
  },
  {
    title: "Cantidad de pedidos facturados por cliente",
    description: "Visualiza todos los pedidos que ya han sido facturados por cliente.",
    icon: <FileText className="h-10 w-10 text-red-600" />,
    link: "/depot/billingmanager/reports/orderBilled",
  },
];

export const DashboardBillingReportsPage = () => {

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-8 px-16 sm:max-w-8xl">
        <BackButton to="/depot/billingmanager"></BackButton>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
