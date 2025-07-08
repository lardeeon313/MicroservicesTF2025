import { useEffect, useState, useCallback } from 'react';
import { DepotOrderDto } from '../types/OrderTypes';

export function useOrderDetails(orderId: number | undefined, fetcher: (id: number) => Promise<DepotOrderDto>) {
  const [order, setOrder] = useState<DepotOrderDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(() => {
    if (!orderId) return;
    setLoading(true);
    fetcher(orderId)
      .then(setOrder)
      .catch(() => setError('No se pudo cargar la orden.'))
      .finally(() => setLoading(false));
  }, [orderId, fetcher]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return { order, loading, error, refetch: fetchOrder };
} 