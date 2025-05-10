import { OrderProps } from "./Order";
import Swal from "sweetalert2";
import caja from "../styles/Caja (2).png";
import { FaWarehouse } from "react-icons/fa"; // Cambiado aquí

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
    <div className="bg-white border rounded-xl p-6 shadow-lg mb-5 transition hover:shadow-xl">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img src={caja} alt="Pedido" className="h-10 w-10" />
          <div>
            <h2 className="text-gray-500 text-sm">ID: {order.id}</h2>
            <h2 className="text-lg font-semibold text-gray-800">{order.cliente}</h2>
          </div>
        </div>
        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition text-sm shadow"
          onClick={handleSendToDeposit}
        >
          <FaWarehouse />
          Enviar a depósito
        </button>
      </div>
    </div>
  );
};

export default SendToDepositCard;
