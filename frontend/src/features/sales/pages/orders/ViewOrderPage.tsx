import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { OrderTableData } from "../../types/OrderTypes";
import { getOrderById } from "../../services/OrderService";
import { handleFormikError } from "../../../../components/ErrorHandler";
import OrderDetails from "../../components/Orders/OrderDetails";
import LoadingSpinner from "../../../../components/LoadingSpinner";

export default function ViewOrderPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderTableData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!id) return;
        const data = await getOrderById(Number(id));
        console.log(data)
        setOrder(data);
      } catch (error) {
        handleFormikError({
          error,
          customMessages: {
            404: "Orden no encontrada.",
            500: "Error del servidor al obtener la orden.",
          },
        });
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

    if (loading) {
      return (
        <LoadingSpinner message="Cargando órden..." height="h-screen"/>
      );
    }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
        <div className="flex items-center justify-between mb-6">
          <Link to="/sales/orders" className="text-red-600 hover:underline pl-10">
            ← Volver al listado
          </Link>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl justify-center">
        <h2 className="text-center text-4xl font-bold text-red-600 mb-12">
              Detalles de la Órden {order?.id}
        </h2>
        <OrderDetails order={order} />
      </div>
    </div>
  );
}
