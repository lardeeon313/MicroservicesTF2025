import { ShoppingCart, User, FilePlus2, Users, BarChart2 } from "lucide-react";
import { Link } from "react-router-dom";

const cards = [
  {
    title: "Lista de Pedidos",
    description: "Visualizá todos los pedidos creados en el sistema.",
    icon: <ShoppingCart className="h-10 w-10 text-red-600" />,
    link: "/sales/orders",
  },
  {
    title: "Lista de Clientes",
    description: "Accedé al listado de clientes registrados.",
    icon: <Users className="h-10 w-10 text-red-600" />,
    link: "/sales/customers",
  },
  {
    title: "Crear Pedido",
    description: "Generá un nuevo pedido para un cliente.",
    icon: <FilePlus2 className="h-10 w-10 text-red-600" />,
    link: "/sales/orders/registerOrder",
  },
  {
    title: "Crear Cliente",
    description: "Registrá un nuevo cliente fácilmente.",
    icon: <User className="h-10 w-10 text-red-600" />,
    link: "/sales/customer/registerCustomer",
  },
  {
    title: "Reportes",
    description: "Visualizá reportes e informes detallados.",
    icon: <BarChart2 className="h-10 w-10 text-red-600" />,
    link: "/sales/reports/dashboard",
  },
];

export const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">Panel de Ventas</h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Todo lo que necesitás para gestionar los pedidos y clientes
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
