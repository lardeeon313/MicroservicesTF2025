import { ClipboardList, PackageCheck, AlertTriangle, Users, BarChart2, Clock, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import GeneralOrderSearch from "../components/GeneralOrderSearch";

const cards = [
  {
    title: "Pedidos Pendientes",
    description: "Revisá todos los pedidos que esperan ser preparados.",
    Icon: ClipboardList,
    link: "/depot/pending-orders",      
  },
  {
    title: "Pedidos en Preparación",
    description: "Visualizá los pedidos que están siendo preparados por operarios.",
    Icon: Clock,
    link: "/depot/in-preparation-orders",  
  },
  {
    title: "Pedidos Armados",
    description: "Visualizá los pedidos ya preparados y listos para continuar.",
    Icon: PackageCheck,
    link: "/depot/prepared-orders",    
  },
  {
    title: "Pedidos con Faltantes",
    description: "Gestioná los pedidos que tienen productos faltantes.",
    Icon: AlertTriangle,
    link: "/depot/missing-orders",  
  },
  {
    title: "Gestión de Equipos",
    description: "Administrá los operarios y equipos de depósito.",
    Icon: Users,
    link: "/depot/teams",  
  },
  {
    title: "Reportes",
    description: "Consultá informes y métricas del depósito.",
    Icon: BarChart2,
    link: "/depot/reports",
  },
];

const DepotManagerDashboardPage = () => {
  const [showSearchModal, setShowSearchModal] = useState(false);

  return (
    <div className="container m-0 min-w-full min-h-full py-20 pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">Panel de Depósito</h1>
        <p className="text-center text-lg text-gray-700 mb-8">
          Todo lo que necesitás para gestionar las operaciones del depósito
        </p>
        
        {/* Barra de búsqueda compacta */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar órdenes..."
                onClick={() => setShowSearchModal(true)}
                readOnly
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              />
            </div>
            <div className="flex justify-center space-x-3 mt-1">
              <p className="text-xs text-red-600 hover:text-red-700 font-medium cursor-default">
                Búsqueda por ID
              </p>
            </div>
          </div>
        </div>
        
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

      {/* Modal de búsqueda */}
      {showSearchModal && (
        <>
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-40" />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Búsqueda de Órdenes</h2>
                <button
                  onClick={() => setShowSearchModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <GeneralOrderSearch 
                  // onOrderSelected={() => setShowSearchModal(false)} // Comentado para permitir ver detalles
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default DepotManagerDashboardPage;