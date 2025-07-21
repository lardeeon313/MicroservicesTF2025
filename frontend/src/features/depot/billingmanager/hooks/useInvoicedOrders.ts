import { useEffect, useState, useCallback } from 'react';
import { getAllInvoicedOrders } from '../services/OrderService';
import { DepotOrderDto } from '../types/OrderTypes';

export function useInvoicedOrders() {
  const [orders, setOrders] = useState<DepotOrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    getAllInvoicedOrders()
      .then(setOrders)
      .catch(() => setError('Error al cargar las órdenes facturadas.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
} 