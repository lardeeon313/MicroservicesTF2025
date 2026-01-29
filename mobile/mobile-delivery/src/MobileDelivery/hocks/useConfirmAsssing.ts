import { useState } from "react";
import { PostConfirmAssignedOrder } from "../services/postConfirmAssing";
import { ConfirmAssignedOrderRequest } from "../types/Request";

export const useConfirmAssignedOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const confirmOrder = async (request: ConfirmAssignedOrderRequest) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await PostConfirmAssignedOrder(request);
      console.log("✅ Pedido confirmado exitosamente:", request);
      setSuccess(true);
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Error al confirmar el pedido.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    confirmOrder,
    loading,
    error,
    success,
  };
};
