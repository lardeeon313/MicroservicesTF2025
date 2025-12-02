import { BarChart2, Boxes, Receipt, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import BackButton from "../../../components/BackButton";

const reportSectors = [
  {
    title: "Ventas",
    description: "Accedé a los indicadores y reportes comerciales de los clientes.",
    icon: <BarChart2 className="h-10 w-10 text-red-600" />,
    link: "/admin/reports/sales",
  },
  {
    title: "Depósito",
    description: "Supervisá la productividad de los equipos y el armado de pedidos.",
    icon: <Boxes className="h-10 w-10 text-red-600" />,
    link: "/admin/reports/depot",
  },
  {
    title: "Facturación",
    description: "Revisa los tiempos y estados del proceso de facturación de los clientes.",
    icon: <Receipt className="h-10 w-10 text-red-600" />,
    link: "/admin/reports/billing",
  },
  {
    title: "Logística",
    description: "Controlá incidencias, desempeño y entregas de los pedidos.",
    icon: <Truck className="h-10 w-10 text-red-600" />,
    link: "/admin/reports/logistics",
  },
];

export const AdminReportsDashboardPage = () => {
  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-8 px-16 sm:max-w-8xl">
        <BackButton to="/admin/dashboard" />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Panel general de reportes
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Elegí el sector para acceder a su tablero de reportes
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reportSectors.map((card, idx) => (
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


