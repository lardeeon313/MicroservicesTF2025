import { useEffect, useState } from "react";
import type { DepotOrderDTO } from "../types/OrderDTO";
import { GetMissingNotifications } from "../services/GetMissingNotificationsService";

export const useGetNotificationMissing = (
  depotOrderId: number,
  operatorUserId: string
) => {
  const [order, setOrder] = useState<DepotOrderDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const data = await GetMissingNotifications(depotOrderId, operatorUserId);
        
        setOrder(data);
      } catch (err: any) {
        setError(err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [depotOrderId, operatorUserId]);

  return { order, loading, error };
};
