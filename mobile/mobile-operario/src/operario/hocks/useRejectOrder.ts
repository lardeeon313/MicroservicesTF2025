import { useState } from "react";
import { RejectOrder } from "../services/SetOrderToBilled";

export function useRejectOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | Error>(null);
  const [success, setSuccess] = useState(false);

  const rejectOrder = async (DepotOrderId: number, OperatorUserId: string, RejectionReason: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await RejectOrder(DepotOrderId, OperatorUserId, RejectionReason);
      setSuccess(true);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { rejectOrder, loading, error, success };
}