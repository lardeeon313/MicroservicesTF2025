import { User, FilePlus2, BarChart2, FileText, PieChart } from "lucide-react";
import { Link } from "react-router-dom";

const cards = [
  {
    title: "Ventas por Cliente",
    description: "Visualizá todos los pedidos creados por cliente.",
    icon: <FileText className="h-10 w-10 text-red-600" />,
    link: "/sales/report/orders",
  },
  {
    title: "Estados de los clientes inactivos",
    description: "Analiza los clientes que hayan dejado de realizar pedidos en un lapso de tiempo.",
    icon: <PieChart className="h-10 w-10 text-red-600" />,
    link: "/sales/report/customers",
  },
  {
    title: "Satisfacción del cliente",
    description: "Mide la satisfacción según las opiniones del cliente.",
    icon: <FilePlus2 className="h-10 w-10 text-red-600" />,
    link: "/sales/report/customerSatisfaction",
  },
  {
    title: "Pedidos cancelados y modificados",
    description: "Consulta los pedidos que han tenido alteraciones.",
    icon: <User className="h-10 w-10 text-red-600" />,
    link: "/sales/report/orderStatus",
  },
  {
    title: "Desempeño por ventas",
    description: "Revisá cómo ha rendido el equipo de ventas.",
    icon: <BarChart2 className="h-10 w-10 text-red-600" />,
    link: "/sales/reports/salesTeam",
  },
];

export const DashboardReportsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">Panel de reportes de Ventas</h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Todos los reportes para la toma de decisiones
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, idx) => (
            <Link
              key={idx}
              to={card.link}
              className="flex flex-col items-start gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition"
            >
              <div className="flex items-center justify-center rounded-full bg-red-100 p-3">
                {card.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{card.title}</h3>
              <p className="text-gray-600 text-sm">{card.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
