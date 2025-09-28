import {Bus, TriangleAlert,ClockFading,CircleDollarSign,BadgeCheck,UserSearch,LandPlot  } from "lucide-react";
import { Link } from "react-router-dom";
import BackButton from "../../../../components/BackButton";

const cards = [
    {
        title: "Tiempos promedios de pago",
        description : "Visualiza los tiempos realizados al momento de realizar el pago",
        icon: <ClockFading className="h-10 w-10 text-red-600" />,
        link: "/verification/reports/AveragePaymentTimes",
    },
    {
        title: "Metodos de pago",
        description: "Revisa cuales fueron los metodos de pago mas utilizados luego de completar las operaciones",
        icon: <CircleDollarSign className="h-10 w-10 text-red-600"/>,
        link: "/verification/reports/PaymentMethods",
    },
    {
        title: "Pedidos verificados",
        description : "Visualiza cuales han sido los pedidos ya verificados para el despacho",
        icon: <BadgeCheck className="h-10 w-10 text-red-600"/>,
        link: "/verification/reports/VerifiedOrders",
    },
    //REPORTES DE DELIVERY 
    {
        title: "Alertas por incidentes de entrega",
        description: "Visualiza cuales han sidos los pedidos que tuvieron incidentes al momento de la entrega o durante el trayecto",
        icon: <TriangleAlert className="h-10 w-10 text-purple-600"/>,
        link: "/verification/reports/IncidentAlerts",
    },
    {
        title: "Entregas a tiempo",
        description: "Visualiza todos los pedidos que ya han sido entregados por los diferentes equipos",
        icon: <Bus className="h-10 w-10 text-purple-600"/>,
        link: "/verification/reports/OnTimeDeliveries",
    },
    {
        title: "Total de pedidos entregados por repartidor",
        description: "Visualiza los pedidos entregados por cada repartidor asignado",
        icon: <UserSearch className="h-10 w-10 text-purple-600"/>,
        link: "/verification/reports/TotalOrdersDeliveried",
    },
    {
        title: "Pedidos por zona",
        description: "Visualiza la cantidad de pedidos entregados por las diferentes zonas",
        icon: <LandPlot className="h-10 w-10 text-purple-600"/>,
        link: "/verification/reports/OrdersByArea"
    }
]

export const DashboardLogisticReportsPage = () => {
    return(
        <div className="container m-0 pt-10 min-w-full min-h-full">
            <div className="container mx-auto py-8 px-16 sm:max-w-8xl">
              <BackButton to="/verification"></BackButton>
            </div>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">      
            <h1 className="text-center text-4xl font-bold text-red-600 mb-2">Panel de reportes de Logistica</h1>
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
    )
}