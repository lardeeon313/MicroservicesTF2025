import { useState, useEffect } from "react";
import { getMyRejectOrders } from "../services/getRejectOrders";
import { LogisticOrder } from "../types/DeliveryOrderTypeDto";

export const useMyRejectOrders = (operatorId: string) => {
  const [orders, setOrders] = useState<LogisticOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchRejectOrders = async () => {
      if (!operatorId) return;
      setIsLoading(true);
      console.log("🚀 useMyRejectOrders iniciado para operador:", operatorId);

      try {
        const data = await getMyRejectOrders(operatorId);

        // 🔍 Log completo del resultado
        console.log("📦 Órdenes rechazadas recibidas del backend:", data);

        // 🔍 Mostrar específicamente las razones de rechazo si existen
        data.forEach((order: any, index: number) => {
          if (order.rejections && order.rejections.length > 0) {
            console.log(
              `🧾 Pedido #${order.id} tiene ${order.rejections.length} rechazos:`,
              order.rejections
            );
          } else {
            console.log(`ℹ️ Pedido #${order.id} no tiene razones de rechazo.`);
          }
        });

        setOrders(data);
      } catch (err) {
        console.error("⚠️ Error al cargar órdenes rechazadas:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRejectOrders();
  }, [operatorId]);

  return { orders, isLoading, error };
};
