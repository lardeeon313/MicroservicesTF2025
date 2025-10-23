import { useState, useEffect, useCallback } from "react";
import { getOrderById } from "../services/getOneOrderDetail";
import { LogisticOrder } from "../types/DeliveryOrderTypeDto";

export const useOrderById = (orderId: number | null) => {
  const [order, setOrder] = useState<LogisticOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (orderId === null) {
      console.log("No se proporcionó orderId.");
      return;
    }

    setLoading(true);
    setError(null);
    console.log(`Iniciando carga de la orden con ID: ${orderId}`);

    try {
      const data = await getOrderById(orderId);
      setOrder(data);
      console.log("Orden obtenida con éxito:", data);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
      console.log("Error al obtener la orden:", err);
    } finally {
      setLoading(false);
      console.log("Carga finalizada.");
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return { order, loading, error, refetch: fetchOrder };
};
