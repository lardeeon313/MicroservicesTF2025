import { useState, useEffect } from "react";
import { getMyOrdersWithIncident } from "../services/getOrdersToIncidents";
import { LogisticOrder } from "../types/DeliveryOrderTypeDto";

export const useGetMyOrdersWithIncident = (operatorId: string) => {
  const [orders, setOrders] = useState<LogisticOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
  const data = await getMyOrdersWithIncident(operatorId);
 
  setOrders(data);
} catch (err: any) {
  
  setError(err.message);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (operatorId) {
      fetchOrders();
    }
  }, [operatorId]);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
  };
};
