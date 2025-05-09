import { useParams } from "react-router-dom";
import { MockOrders} from "../../data/MockOrders";
import UpdateOrderPage from "./UpdateOrderPage";

//Se comunica con el route ,le da el parametro de pedido original para que lo actualice 

export const UpdateOrderWrapper = () => {
  const { id } = useParams<{ id: string }>();
  const pedidoOriginal = MockOrders.find(p => p.id === id);

  if (!pedidoOriginal) {
    return <div className="p-6 text-red-600">Pedido no encontrado</div>;
  }

  return <UpdateOrderPage pedidoOriginal={pedidoOriginal} />;
}