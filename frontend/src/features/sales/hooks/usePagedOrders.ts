import { useEffect, useState } from "react";
import { getPagedOrders } from "../services/OrderService";
import { OrderTableData } from "../types/OrderTypes";
import { handleFormikError } from "../../../components/Form/ErrorHandler";

export function usePagedOrders(page: number, pageSize: number) {
  const [orders, setOrders] = useState<OrderTableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => {
    try {
        setLoading(true);
        const result = await getPagedOrders(page, pageSize);
        setOrders(result.orders);
        setTotalPages(result.totalPages);
    } catch (error) {
      handleFormikError({
        error,
        customMessages: {
            400: "Datos inválidos, por favor verificá los campos.",
            404: "Cliente no encontrado.",
            500: "Error interno del servidor.",
        },
    });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize]);

  return { orders, loading, error, totalPages, refetch: fetchData };
}
