import { ClipboardList, PackageCheck, AlertTriangle, Users, BarChart2 } from "lucide-react";
import { Link } from "react-router-dom";

const cards = [
  {
    title: "Pedidos Pendientes",
    description: "Revisá todos los pedidos que esperan ser preparados.",
    Icon: ClipboardList,
    link: "/depot/pending-orders",
  },
  {
    title: "Pedidos Armados",
    description: "Visualizá los pedidos ya preparados y listos para continuar.",
    Icon: PackageCheck,
    link: "/depot/assembled-orders",
  },
  {
    title: "Pedidos con Faltantes",
    description: "Gestioná los pedidos que tienen productos faltantes.",
    Icon: AlertTriangle,
    link: "/depot/missing-items",
  },
  {
    title: "Gestión de Equipos",
    description: "Administrá los operarios y equipos de depósito.",
    Icon: Users,
    link: "/depot/team",
  },
  {
    title: "Reportes",
    description: "Consultá informes y métricas del depósito.",
    Icon: BarChart2,
    link: "/depot/reports",
  },
];

export const DepotDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">Panel de Depósito</h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Todo lo que necesitás para gestionar las operaciones del depósito
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ title, description, Icon, link }, idx) => (
            <Link
              key={idx}
              to={link}
              className="flex flex-col items-start gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition"
            >
              <div className="flex items-center justify-center rounded-full bg-red-100 p-3">
                <Icon className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
              <p className="text-gray-600 text-sm">{description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
export default DepotDashboardPage;