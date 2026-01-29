import { useState, useEffect } from "react";
import { getMyDeliveredOrders } from "../services/getOrdersToDelivered";
import { LogisticOrder } from "../types/DeliveryOrderTypeDto";

export const useMyDeliveredOrders = (operatorId: string) => {
  const [orders, setOrders] = useState<LogisticOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!operatorId) {
      console.warn("[useMyDeliveredOrders] No se recibió un operatorId válido:", operatorId);
      return;
    }

    const fetchDeliveredOrders = async () => {
      console.log(`[useMyDeliveredOrders] 🔄 Iniciando fetch de pedidos entregados para operador: ${operatorId}`);
      setLoading(true);
      setError(null);

      try {
        const data = await getMyDeliveredOrders(operatorId);
        console.log("[useMyDeliveredOrders] ✅ Pedidos obtenidos correctamente:", data);
        setOrders(data);
      } catch (err: any) {
        console.error("[useMyDeliveredOrders] ❌ Error al obtener pedidos:", err);
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
        console.log("[useMyDeliveredOrders] ⏹️ Finalizó el fetch — loading=false");
      }
    };

    fetchDeliveredOrders();
  }, [operatorId]);

  return { orders, loading, error };
};
