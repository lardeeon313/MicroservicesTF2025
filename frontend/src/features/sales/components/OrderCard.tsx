import { FaEye, FaEdit, FaTrash } from "react-icons/fa"; // Íconos de FontAwesome
import { OrderProps } from "./Order";
import caja from "../styles/Caja (2).png";
import localizacion from "../styles/Localization.png";
import { useNavigate } from "react-router-dom";
import { BusinessRules } from "../pages/BusinessRules/BusinessRules";

interface Props {
  order: OrderProps;
  onDelete?: (id: string) => void;
}

export const OrderCard = ({ order, onDelete }: Props) => {
  const statusColors: Record<string, string> = {
    Emitido: "bg-yellow-500",
    "En preparacion": "bg-amber-700",
    EnPreparacion: "bg-amber-700",
    Entregado: "bg-green-700",
    Confirmado: "bg-red-600",
  };

  const navegador = useNavigate();

  return (
    <div className="bg-white border border-gray-300 rounded-xl p-5 shadow-md mb-5 transition hover:shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          <img src={caja} alt="Pedido" className="h-8 w-8" />
          <div>
            <h2 className="text-md font-bold text-gray-800">{order.id}</h2>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${statusColors[order.estado] || "bg-gray-400"}`}>
          {order.estado}
        </div>
      </div>

      <div className="flex items-start gap-3 mb-4 ml-2">
        <img src={localizacion} alt="Ubicación" className="h-5 mt-1" />
        <div>
          <p className="text-gray-800 font-medium">{order.cliente}</p>
          <p className="text-gray-500 text-xs">{order.tipoLocal}</p>
        </div>
      </div>

      <div className="flex justify-end gap-2 flex-wrap">
        <button
          className="bg-black text-white px-4 py-1.5 rounded-full text-sm hover:bg-gray-800 transition flex items-center gap-2"
          onClick={() => navegador(`/sales/detalle/${order.id}`)}
        >
          <FaEye /> Ver detalle
        </button>
        <BusinessRules estado={order.estado} actionType="update">
          <button
            className="bg-yellow-500 text-white px-4 py-1.5 rounded-full text-sm hover:bg-yellow-600 transition flex items-center gap-2"
            onClick={() => navegador(`/sales/editar/${order.id}`)}
          >
            <FaEdit /> Actualizar pedido
          </button>
        </BusinessRules>
        <BusinessRules estado={order.estado} actionType="delete">
          <button
            className="bg-red-500 text-white px-4 py-1.5 rounded-full text-sm hover:bg-red-700 transition flex items-center gap-2"
            onClick={() => {
              if (onDelete) {
                onDelete(order.id);
              }
            }}
          >
            <FaTrash /> Eliminar Pedido
          </button>
        </BusinessRules>
      </div>
    </div>
  );
};

export default OrderCard;
