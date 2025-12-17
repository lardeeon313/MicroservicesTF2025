import { useEffect, useState, useCallback } from "react";
import type { Billing } from "../../../../billingmanager/types/BillingType";
import API from "../../../../../../api/axios";

export const useCustomerIncome = () => {
  const [orders, setOrders] = useState<Billing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await API.get<Billing[]>("/depot/billingmanager/all-invoiced-orders");

      console.log("RTA:" , res);

      if (!res.data || res.data.length === 0) {
        setOrders([]);
        setError("No hay órdenes facturadas.");
      } else {
        setOrders(res.data);
      }
    } catch (err: any) {
      
      setError("Error al conectar con el servidor.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
};
