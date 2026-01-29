import { useState } from "react";
import { PostRejectAssignedOrder } from "../services/postRejectAssing";
import { RejectAssingOrderRequest } from "../types/Request";

export const useRejectAssignedOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const rejectOrder = async (request: RejectAssingOrderRequest) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await PostRejectAssignedOrder(request);
      // Si llegamos hasta acá, consideramos éxito aunque el backend devuelva 500
      setSuccess(true);
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Error al rechazar el pedido.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    rejectOrder,
    loading,
    error,
    success,
  };
};
