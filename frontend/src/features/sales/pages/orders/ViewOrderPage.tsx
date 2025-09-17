import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { OrderTableData } from "../../types/OrderTypes";
import { getOrderById } from "../../services/OrderService";
import { handleFormikError } from "../../../../components/ErrorHandler";
import OrderDetails from "../../components/Orders/OrderDetails";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import BackButton from "../../../../components/BackButton";

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
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/sales/orders"></BackButton>
        <h2 className="text-center text-4xl font-bold text-red-600 mb-12">
              Detalles de la Órden {order?.id}
        </h2>
        <OrderDetails order={order} />
      </div>
    </div>
  );
}
