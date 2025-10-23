import { useState } from "react";
import { PostMarkOrderOnTheWay } from "../services/postMarkOnTheWay";
import { MarkOrderOnTheWayRequest } from "../types/Request";

export const useMarkOrderOnTheWay = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const markOnTheWay = async (request: MarkOrderOnTheWayRequest) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await PostMarkOrderOnTheWay(request);
      setSuccess(true);
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Error al marcar la orden como 'En camino'.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    markOnTheWay,
    loading,
    error,
    success,
  };
};
