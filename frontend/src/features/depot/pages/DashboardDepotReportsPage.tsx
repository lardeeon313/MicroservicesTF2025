import { User, FilePlus2, BarChart2, FileText, PieChart } from "lucide-react";
import { Link } from "react-router-dom";

const cards = [
    //reportes de deposito
  {
    title: "Tiempos promedio de armado",
    description: "Visualizá el tiempo promedio que le toma a cada equipo armar el pedido para su pronta facturacion.",
    icon: <FileText className="h-10 w-10 text-red-600" />,
    link: "/depot/report/AverageOrders",
  },
  {
    title: "Faltantes diarios",
    description: "Muestra aquellos pedidos los cuales se producieron faltantes de tales productos",
    icon: <PieChart className="h-10 w-10 text-red-600" />,
    link: "/depot/report/Missings",
  },
  {
    title: "Pedidos completados por dia",
    description: "Analiza la cantidad de pedidos que son completados al dia por los diferentes equipos.",
    icon: <FilePlus2 className="h-10 w-10 text-red-600" />,
    link: "/depot/report/ordersCompleted",
  },
  {
    title: "Productividad del equipo",
    description: "Visualiza la productividad de los diferentes equipos al momento de armar el pedido",
    icon: <User className="h-10 w-10 text-red-600" />,
    link: "/depot/report/Teams",
  },
  //Reportes de facturacion
  {
    title: "Ingresos por cliente",
    description: "Visualiza los ingresos generados por cada unos de los clientes",
    icon: <User className="h-10 w-10 text-red-600" />,
    link: "/depot/reports/IncomeCustomers"
  },
  {
    title: "Pedidos facturados",
    description: "Analiza los pedidos que ya se encuentran facturados para su pronta verificacion",
    icon: <User className="h-10 w-10 text-red-600" />,
    link: "/depot/reports/OrdersBilled"
  },
  {
    title: "Tiempos de proceso de facturacion",
    description: "Mide y visaluiza el tiempo necesario que le toma al empleado de facturacion facturar el pedido",
    icon: <User className="h-10 w-10 text-red-600" />,
    link: "/depot/reports/BillingTimeProcess",
  },
];

export const DashboardDepotReportsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">Panel de reportes de Deposito</h1>
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
