import { ClipboardList, Clock, BarChart2, FileDown  } from "lucide-react";
import { Link } from "react-router-dom";

const cards = [
  {
    title: "Órdenes Pendientes de Facturación",
    description: "Gestioná y asigná precios a las órdenes que esperan ser facturadas.",
    Icon: ClipboardList,
    link: "/depot/billingmanager/pending-orders",
  },
  {
    title: "Órdenes Facturadas",
    description: "Visualizá y gestioná todas las órdenes ya facturadas.",
    Icon: Clock,
    link: "/depot/billingmanager/invoiced-orders",   
  },
  {
    title: "Reportes",
    description: "Consultá informes y métricas de facturación.",
    Icon: BarChart2,
    link: "/depot/billingmanager/reports",
  },  
  {
    title: "Exportaciones",
    description: "Aqui podras exportar todos los pedidos facturados en pdf , word e inclusive en excel",
    Icon: FileDown,
    link: "/depot/billingmanager/exports",
  },
];

const BillingManagerDashboardPage = () => {
  return (
    <div className="min-h-full bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">Panel de Facturación</h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Todo lo que necesitás para gestionar las operaciones de facturación
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
export default BillingManagerDashboardPage; 
  