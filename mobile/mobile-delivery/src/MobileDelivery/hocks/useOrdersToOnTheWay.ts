import { useState, useEffect } from "react";
import { getMyOnTheWayOrders } from "../services/getOnTheWayOrders";
import { LogisticOrder } from "../types/DeliveryOrderTypeDto";

export const useMyOnTheWayOrders = (operatorId: string) => {
  const [orders, setOrders] = useState<LogisticOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!operatorId) return;

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMyOnTheWayOrders(operatorId);
        setOrders(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [operatorId]);

  return { orders, loading, error };
};
