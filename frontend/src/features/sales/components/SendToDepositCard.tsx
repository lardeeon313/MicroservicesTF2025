import { OrderProps } from "./Order";
import Swal from "sweetalert2";
import caja from "../styles/Caja (2).png";

interface Props {
  order: OrderProps;
}

export const SendToDepositCard = ({ order }: Props) => {
  const handleSendToDeposit = () => {
    Swal.fire({
      title: "¿Estás seguro de que quieres enviar el pedido?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("¡Pedido enviado exitosamente!", "", "success");
      } else {
        Swal.fire("Pedido descartado para el envío a depósito", "", "info");
      }
    });
  };

  return (
    <div className="bg-white border rounded-md p-4 shadow mb-4">
      <div className="flex justify-between items-center">
        <div className="block items-center gap-2">
          <img src={caja} alt="Pedido" className="h-8" />
          <h2 className="text-lg ">{order.id}</h2>
          <h2 className="text-lg font-bold">{order.cliente}</h2>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm cursor-pointer"
          onClick={handleSendToDeposit}
        >
          Enviar pedido a depósito
        </button>
      </div>
    </div>
  );
};

export default SendToDepositCard;
