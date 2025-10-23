import { useState, useEffect, useCallback } from "react";
import { getOrdersByStatus } from "../services/getOrdersByStatus";
import { LogisticOrder } from "../types/DeliveryOrderTypeDto";

export const useGetOrdersByStatus = (status: string) => {
  const [orders, setOrders] = useState<LogisticOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrdersByStatus(status);
      setOrders(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Error al cargar las órdenes");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders, // para recargar manualmente
  };
};
