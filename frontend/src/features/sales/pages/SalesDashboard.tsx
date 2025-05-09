import { Link } from "react-router-dom";
import logo from "../styles/LogoVerona.png";
import persona from "../styles/Persona.png";
import Footer from "../components/Footer";
import Header from "../components/Header";

const SalesDashboard = () => {
  
  return (
    <div>
      <div className="min-h-screen bg-gray-100">
      <Header/>
      {/* Contenido principal */}
      <main className="px-6 py-10">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Panel de ventas</h2>
            <p className="text-gray-600 mb-8">Gestioná los pedidos desde aquí</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Link to="/cliente-existente" className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white text-center py-6 rounded-xl shadow transition-all duration-300 ease-in-out">
            <p className="text-lg font-semibold">Cliente existente</p>
          </Link>

          <Link to="/nuevo-cliente" className="bg-green-500 hover:bg-green-600 text-white text-center py-6 rounded-xl shadow transition">
            <p className="text-lg font-semibold">Nuevo cliente</p>
          </Link>

          <Link to="/sales/listado" className="bg-gray-200 hover:bg-gray-300 text-center py-6 rounded-xl shadow transition">
            <p className="text-lg font-semibold text-gray-800">Listado de todos los pedidos</p>
          </Link>

          <Link to="/sales/enviar-deposito" className="bg-yellow-500 hover:bg-yellow-600 text-white text-center py-6 rounded-xl shadow transition">
            <p className="text-lg font-semibold">Enviar pedidos a depósito</p>
          </Link>

          <Link to="/sales/pedidos-completos" className="bg-red-600 hover:bg-red-700 text-white text-center py-6 rounded-xl shadow transition">
            <p className="text-lg font-semibold">Pedidos completos</p>
          </Link>
        </div>
      </main>
    </div>
    <Footer/>
    </div>
  );
};

export default SalesDashboard;
