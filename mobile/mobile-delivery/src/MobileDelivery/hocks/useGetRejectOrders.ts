import { useState, useEffect } from "react";
import { getMyRejectOrders } from "../services/getRejectOrders";
import { LogisticOrder } from "../types/DeliveryOrderTypeDto";

export const useMyRejectOrders = (operatorId: string) => {
  const [orders, setOrders] = useState<LogisticOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchRejectOrders = async () => {
      // ⚠️ Evitamos ejecutar si no hay operatorId
      if (!operatorId) {
        setError(new Error("No se encontró el operador para obtener los pedidos."));
        setOrders([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      console.log("🚀 useMyRejectOrders iniciado para operador:", operatorId);

      try {
        const data = await getMyRejectOrders(operatorId);

        // Validación: el backend debe devolver array
        if (!Array.isArray(data)) {
          throw new Error("El formato de respuesta del servidor no es válido.");
        }

        console.log("📦 Órdenes rechazadas recibidas:", data);

        // Si no hay pedidos rechazados
        if (data.length === 0) {
          console.warn("⚠️ No se encontraron pedidos rechazados.");
        }

        setOrders(data);
      } catch (err: any) {
        setError(err);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRejectOrders();
  }, [operatorId]);

  return { orders, isLoading, error };
};