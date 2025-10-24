// src/hocks/useGetMyPendingCashOrders.ts
import { useEffect, useState } from "react";
import { LogisticOrder } from "../types/DeliveryOrderTypeDto";
import { getMyPendingCashOrders } from "../services/getPendingCashOrders";

export const useGetMyPendingCashOrders = (operatorId: string | null) => {
  const [orders, setOrders] = useState<LogisticOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!operatorId) return; // Evita llamadas innecesarias
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getMyPendingCashOrders(operatorId);
        setOrders(data);
      } catch (err: any) {
        setError(err.message || "Error al obtener pedidos pendientes.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [operatorId]);

  return { orders, loading, error, refetch: () => operatorId && getMyPendingCashOrders(operatorId) };
};
