import { useState, useCallback } from "react";
import API from "../../../../../../api/axios";

export type DepotOrderDtoBilling = {
  orderId: string;
  customerName: string;
  totalAmount: number;
  orderDate: string;
};

type Filters = {
  customerName?: string;
};

export function useInvoicedOrdersByCustomer() {
  const [data, setData] = useState<DepotOrderDtoBilling[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (filters: Filters) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.customerName) params.append("CustomerName", filters.customerName);

      const res = await API.get<DepotOrderDtoBilling[]>(
        `/depot/billingmanager/invoiced-orders-by-customer?${params.toString()}`
      );

      
      setData(res.data);
    } catch (err: any) {
      
      setError(err.message || "Error al obtener órdenes facturadas.");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchOrders };
}
