import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { ShoppingCart, UserPlus, Users, Send, CheckCircle } from "lucide-react";

const SalesDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow px-6 py-10">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Panel de ventas</h1>
          <p className="text-gray-600 text-lg">Gestioná los pedidos desde aquí</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <CardLink to="/cliente-existente" color="blue" icon={<Users size={32} />}>
            Cliente existente
          </CardLink>

          <CardLink to="/nuevo-cliente" color="green" icon={<UserPlus size={32} />}>
            Nuevo cliente
          </CardLink>

          <CardLink to="/sales/listado" color="gray" icon={<ShoppingCart size={32} />}>
            Listado de todos los pedidos
          </CardLink>

          <CardLink to="/sales/enviar-deposito" color="yellow" icon={<Send size={32} />}>
            Enviar pedidos a depósito
          </CardLink>

          <CardLink to="/sales/pedidos-completos" color="red" icon={<CheckCircle size={32} />}>
            Pedidos completos
          </CardLink>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Componente reutilizable
const CardLink = ({ to, color, icon, children }: { to: string; color: string; icon: React.ReactNode; children: React.ReactNode }) => {
  const base = {
    blue: "bg-blue-500 hover:bg-blue-600 text-white",
    green: "bg-green-500 hover:bg-green-600 text-white",
    gray: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    yellow: "bg-yellow-500 hover:bg-yellow-600 text-white",
    red: "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center py-8 px-4 rounded-2xl shadow-md transition-all duration-300 ${base[color as keyof typeof base]}`}
    >
      <div className="mb-3">{icon}</div>
      <p className="text-lg font-semibold">{children}</p>
    </Link>
  );
};

export default SalesDashboard;

