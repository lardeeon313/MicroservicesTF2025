import { useState, useEffect } from "react";
import { getMyAssignedOrders } from "../services/getOrdersToDistribute";
import { LogisticOrder } from "../types/DeliveryOrderTypeDto";

export const useMyAssignedOrders = (operatorId: string) => {
  const [orders, setOrders] = useState<LogisticOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!operatorId) {
      console.log("⚠️ No se recibió operatorId, se cancela la llamada.");
      return;
    }

    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getMyAssignedOrders(operatorId);
        
        setOrders(data);
      } catch (err: any) {
        
        setError(err.message || "Error desconocido al obtener pedidos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [operatorId]);

  return { orders, isLoading, error };
};
