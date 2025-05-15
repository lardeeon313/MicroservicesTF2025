import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EditOrderForm from "../../components/Forms/EditOrderForm";
import { Order } from "../../types/OrderTypes";
import { handleFormikError } from "../../../../components/Form/ErrorHandler";
import { getOrderById } from "../../services/OrderService";

export default function EditOrderPage() {
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
    <EditOrderForm order={order} loading={loading} />
  );
}
