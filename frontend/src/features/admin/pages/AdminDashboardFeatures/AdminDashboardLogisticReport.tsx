import { TriangleAlert,ShieldX,Users,History,LandPlot,Clock2,PersonStanding,Receipt } from "lucide-react";
import { Link } from "react-router-dom";
import BackButton from "../../../../components/BackButton";

const cards = [
    {
        title: "Incidentes de entrega",
        description: "Revisa cuales fueron los pedidos que tuvieron incidentes durante , antes o despues del reparto.",
        icon: <TriangleAlert className="h-10 w-10 text-purple-600"/>,
        link: "/verification/reports/admin/OrderIncidents",
    },
    {
        title: "Asignaciones canceladas",
        description : "Visualiza todas las asignaciones canceladas por los repartidores.",
        icon: <ShieldX className="h-10 w-10 text-red-600"/>,
        link: "/verification/reports/admin/RejectOrders",
    },
    {
        title: "Actividad por equipo",
        description : "Visualiza todos los niveles de rendimiento obtenidos por los diferentes equipos de reparto.",
        icon : <Users className="h-10 w-10 text-red-600"/>,
        link: "/verification/reports/admin/TeamDeliveryProdictivity"
    },
    {
        title: "Tiempos de entrega",
        description : "Visualiza todos los pedidos que ya han sido entregados por los diferentes equipos de reparto.",
        icon : <Clock2 className="h-10 w-10 text-red-600"/>,
        link : "/verification/reports/admin/DeliveryTimes",
    },
    {
        title : "Historial de estados de pedido",
        description : "Verifica cuales han sido que han obtenido los diferentes pedidos a lo largo de su historia.",
        icon: <History className="h-10 w-10 text-red-600"/>,
        link: "/verification/reports/admin/OrderStatusHistory",
    },
    {
        title: "Pedidos pendientes de pago en Efectivo",
        description : "Revisa todos los pedidos que se encuentran pendientes de verificar porque han sido pagados en efectivo",
        icon : <Receipt className="h-10 w-10 text-red-600"/>,
        link: "/verification/reports/admin/PendingCashVerification",
    },
    //REPORTES DE DELIVERY 
    {
        title: "Productividad por repartidor",
        description: "Verifica el rendimiento que ha tenido el repartidor . sus estadisticas y sus pedidos entregados",
        icon: <PersonStanding className="h-10 w-10 text-purple-600"/>,
        link: "/verification/reports/admin/OperatorProdictivity",
    },
    {
        title: "Cantidad de pedidos por zona",
        description: "Visualiza la cantidad de pedidos entregados por las diferentes zonas",
        icon: <LandPlot className="h-10 w-10 text-purple-600"/>,
        link: "/verification/reports/admin/ZonePerfomance"
    }
]

export const AdminDashboardLogisticReportPage = () => {
    return(
        <div className="container m-0 pt-10 min-w-full min-h-full">
            <div className="container mx-auto py-8 px-16 sm:max-w-8xl">
              <BackButton to="/admin/reports"></BackButton>
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