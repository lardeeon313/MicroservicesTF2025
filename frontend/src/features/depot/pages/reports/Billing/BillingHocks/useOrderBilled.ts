import { useState, useCallback } from "react";
import API from "../../../../../../api/axios";

export type DepotOrderItem = {
  id: number;
  productName: string;
  productBrand: string;
  packaging: string | null;
  unitPrice: number | null;
  quantity: number;
  total: number;
  isReady: boolean;
};


export type DepotOrderDtoBilling = {
  salesOrderId: string;
  customerName: string;
  totalAmount: number;
  orderDate: string;
  items: DepotOrderItem[];
  productCount: number
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

      
      const mapped = res.data
        .map(order => ({
          ...order,
          productCount: order.items.reduce((acc, item) => acc + item.quantity, 0)
        }))
        .filter(order => order.totalAmount > 0);

      setData(mapped);

    } catch (err: any) {
      
      setError(err.message || "Error al obtener órdenes facturadas.");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchOrders };
}
