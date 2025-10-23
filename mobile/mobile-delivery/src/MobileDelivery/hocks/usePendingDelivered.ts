import { useState, useEffect } from "react";
import { getMyPendingDeliveredOrders } from "../services/getPendingDeliveredOrders";
import { LogisticOrder } from "../types/DeliveryOrderTypeDto";

export const useMyPendingDeliveredOrders = (operatorId: string) => {
  const [orders, setOrders] = useState<LogisticOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!operatorId) return; // evita llamadas sin ID

    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getMyPendingDeliveredOrders(operatorId);
        setOrders(data);
      } catch (err: any) {
        setError(err.message || "Error desconocido al obtener pedidos pendientes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [operatorId]);

  return { orders, isLoading, error };
};
