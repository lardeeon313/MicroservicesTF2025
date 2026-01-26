// useOrderBilled.ts
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
  salesOrderId: number;
  customerName: string;
  totalAmount: number;
  orderDate: string;
  status: number;
  items: DepotOrderItem[];
  productCount: number;
};

type Filters = {
  customerName?: string;
  fromDate?: string;
  toDate?: string;
  minAmount?: number;
  maxAmount?: number;
  period?: "day" | "week" | "month" | "fortnight";
};

// 🔥 ESTADOS FACTURADOS REALES
const INVOICED_STATUSES = [8];

export function useInvoicedOrdersByCustomer() {
  const [data, setData] = useState<DepotOrderDtoBilling[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (filters: Filters) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (filters.customerName)
        params.append("CustomerName", filters.customerName);
      if (filters.fromDate)
        params.append("FromDate", filters.fromDate);
      if (filters.toDate)
        params.append("ToDate", filters.toDate);
      if (filters.minAmount !== undefined)
        params.append("MinAmount", filters.minAmount.toString());
      if (filters.maxAmount !== undefined)
        params.append("MaxAmount", filters.maxAmount.toString());
      if (filters.period)
        params.append("Period", filters.period);

      const res = await API.get<DepotOrderDtoBilling[]>(
        `/depot/billingmanager/invoiced-orders-by-customer?${params.toString()}`
      );

      const rawData = res.data ?? [];

      console.log("RAW DATA:", rawData);

      // ✅ FILTRO REAL
      const onlyInvoiced = rawData.filter(order => {
        const valid =
          order.totalAmount > 0 &&
          INVOICED_STATUSES.includes(order.status);

        if (!valid) {
          console.warn("DESCARTADO POR STATUS:", {
            salesOrderId: order.salesOrderId,
            status: order.status,
            total: order.totalAmount,
          });
        }

        return valid;
      });

      // ✅ DEDUPLICADO FINAL
      const unique = new Map<number, DepotOrderDtoBilling>();

      onlyInvoiced.forEach(order => {
        if (!unique.has(order.salesOrderId)) {
          unique.set(order.salesOrderId, {
            ...order,
            productCount: order.items.reduce(
              (acc, item) => acc + item.quantity,
              0
            ),
          });
        }
      });

      const sanitized = Array.from(unique.values());

      console.log("FACTURADOS REALES:", sanitized);

      setData(sanitized);
    } catch (err: any) {
      console.error("ERROR:", err);
      setError(err.message || "Error al obtener pedidos facturados");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    fetchOrders,
  };
}
