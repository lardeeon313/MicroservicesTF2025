import { useState, useCallback } from "react";
import { PostMarkOrderDelivered } from "../services/postMarkDelivered";

export const useMarkOrderDelivered = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [success, setSuccess] = useState(false);

  const markDelivered = useCallback(async (logisticOrderId: number) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await PostMarkOrderDelivered(logisticOrderId);
      setSuccess(true);
      console.log("✅ Orden entregada con éxito");
    } catch (err: any) {
      setError(err);
      console.error("❌ Error al marcar la orden como entregada", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { markDelivered, isLoading, error, success };
};
