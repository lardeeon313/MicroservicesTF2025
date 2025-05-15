import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Order } from "../../types/OrderTypes";

type Props = {
  order: Order | null;
  loading: boolean;
};

export default function OrderDetails({ order, loading }: Props) {
  const navigate = useNavigate();

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("es-AR");

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <button
        className="mb-4 flex items-center text-sm text-blue-600 hover:underline"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Volver
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Detalle de la Orden</h2>

        {loading && <p className="text-gray-600">Cargando orden...</p>}

        {order && (
          <div className="space-y-2 text-sm text-gray-700">
            <div><span className="font-medium">ID:</span> {order.id}</div>
            <div><span className="font-medium">Cliente:</span> {order.customerFirstName} {order.customerLastName}</div>
            <div><span className="font-medium">Fecha Pedido:</span> {formatDate(order.orderDate)}</div>
            <div><span className="font-medium">Fecha Entrega:</span> {order.deliveryDate ? formatDate(order.deliveryDate) : "No asignada"}</div>
            <div><span className="font-medium">Estado:</span> {order.status}</div>
          </div>
        )}
      </div>
    </div>
  );
}
