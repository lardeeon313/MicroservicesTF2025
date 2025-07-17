
import { ShoppingCart, User, FilePlus2, Users, BarChart2, Icon } from "lucide-react";
import { Link } from "react-router-dom";

const CardsOperator = [
  {
    title: "Lista de pedidos",
    description : "Visualiza todos los pedidos asingados",
    Icon: <ShoppingCart className="h-10 w-10 text-red-600" />,
    link: "/depot/operator/orders",
  }
]

const OperatorDashboard = () => {
    return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">Panel de Operario de deposito</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CardsOperator.map((card, idx) => (
            <Link
              key={idx}
              to={card.link}
              className="flex flex-col items-start gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition"
            >
              <div className="flex items-center justify-center rounded-full bg-red-100 p-3">
                {card.Icon}
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
  
export default OperatorDashboard;
  