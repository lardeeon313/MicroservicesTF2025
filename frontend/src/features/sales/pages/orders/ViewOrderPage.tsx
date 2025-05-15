import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Order } from "../../types/OrderTypes";
import { getOrderById } from "../../services/OrderService";
import { handleFormikError } from "../../../../components/Form/ErrorHandler";
import OrderDetails from "../../components/Orders/OrderDetails";

export default function ViewOrderPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!id) return;
        const data = await getOrderById(Number(id));
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

  return (
    <OrderDetails order={order} loading={loading} />
  );
}
