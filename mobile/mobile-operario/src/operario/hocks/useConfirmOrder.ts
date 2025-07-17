//hock para confirmar un pedido de forma individual

import { useState } from "react";
//Services
import { ConfirmedOrder } from "../services/SetOrderToBilled";


export function useConfirmOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | Error>(null);
  const [success, setSuccess] = useState(false);

  const confirmOrder = async (DepotOrderId: number, OperatorUserId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await ConfirmedOrder(DepotOrderId, OperatorUserId);
      setSuccess(true);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { confirmOrder, loading, error, success };
}