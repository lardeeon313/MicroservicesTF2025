//import { OrderProps } from "../types/Order";
import { OrderProps } from "./Order";
import caja from "../styles/Caja (2).png";
import localizacion from "../styles/Localization.png";
import { useNavigate } from "react-router-dom";
import { BusinessRules } from "../pages/BusinessRules/BusinessRules";

//Apartado principal para ver el listado del pedido 

interface Props {
  order: OrderProps;
  //OnDelete permite eliminar el pedido visualmente si este no esta en el estado de Confirmado 
  onDelete?: (id:string) => void;
}

export const OrderCard = ({ order,onDelete }: Props) => {
  const statusColors = {
    Emitido: "bg-yellow-500",
    "En preparacion": "bg-amber-700",
    Entregado: "bg-green-700",
    EnPreparacion:"bg-amber-700",
    Confirmado:"bg-red-600"
  };
  const navegador = useNavigate(); //permitira acceder a dicha page desde el boton: 

  return (
    <div className="bg-white border rounded-md p-4 shadow mb-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src={caja} alt="Pedido" className="h-8" />
          <h2 className="text-lg font-bold">{order.id}</h2>
        </div>
        <div className={`px-3 py-1 text-white rounded text-sm ${statusColors[order.estado]}`}>
          {order.estado}
          {order.estado === "Confirmado"}
        </div>
      </div>

      <div className="ml-10 mt-3 text-sm flex items-start gap-2">
        <img src={localizacion} alt="Ubicación" className="h-4 mt-1" />
        <div>
          <p className="text-gray-800">{order.cliente}</p>
          <p className="text-gray-500 text-xs">{order.tipoLocal}</p>
        </div>
      </div>

      {/**Basandose en el crud  */}
      <div className="text-right mt-4">
        <button className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800 text-sm cursor-pointer"
        onClick={() => navegador(`/sales/detalle/${order.id}`)}>
          Ver detalle
        </button>
        <BusinessRules estado={order.estado} actionType="update">
          <button className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 text-sm cursor-pointer"
          onClick={() => navegador(`/sales/editar/${order.id}`)}>
            Actualizar pedido
          </button>
        </BusinessRules>
        <BusinessRules estado={order.estado} actionType="delete">
          <button className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-800 text-sm cursor-pointer"
          onClick={() => {
            if(onDelete){
              onDelete(order.id)
            }
          }}>
            Eliminar Pedido
          </button>
        </BusinessRules>
      </div>
    </div>
  );
};

export default OrderCard;
