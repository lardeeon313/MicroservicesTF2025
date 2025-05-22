import { useState, useEffect, useCallback } from "react";
import { Order } from "../types/OrderTypes";
import { getAllOrders } from "../services/OrderService";
import toast from "react-hot-toast";


export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
      toast.error("No se pudo cargar las órdenes");
      setError("Error al cargar las órdenes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { orders, loading, error, refetch: fetch };
}