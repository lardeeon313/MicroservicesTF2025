import { useEffect, useState, useCallback } from "react";

import type { Billing } from "../../../../../depot/billingmanager/types/BillingType";
import API from "../../../../../../api/axios";

export const AdminuseCustomerIncome = () => {
  const [orders, setOrders] = useState<Billing[]>([]);
  const [filteredByCustomer, setFilteredByCustomer] = useState<Billing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get<Billing[]>("/depot/billingmanager/all-invoiced-orders");
      console.log("Datos recibidos (sin filtrar):", res.data);

      if (!res.data) {
        setOrders([]);
        setError("No hay órdenes facturadas.");
      } else {
        // Filtrar solo si hay datos y si tienen la propiedad Status
        const filteredOrders = res.data.filter(order => {
          // Verificar si el pedido tiene la propiedad Status y si es igual a 8
          return order.Status !== undefined ? order.Status === 8 : true;
        });
        console.log("Datos filtrados por Status=8:", filteredOrders);
        setOrders(filteredOrders);
      }
    } catch (err) {
      console.error("Error al obtener órdenes:", err);
      setError("Error al conectar con el servidor.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // useCustomerIncome.tsx
const fetchOrdersByCustomer = useCallback(async (customerName: string) => {
  if (!customerName.trim()) {
    setFilteredByCustomer([]);
    return;
  }
  try {
    setLoading(true);
    const params = new URLSearchParams();
    params.append("customerName", customerName);
    const res = await API.get<Billing[]>(
      `/depot/billingmanager/invoiced-orders-by-customer?${params.toString()}`
    );
    console.log("Datos recibidos para cliente (sin filtrar):", res.data);
    setFilteredByCustomer(res.data ?? []);
  } catch (error) {
    console.error("Error al obtener pedidos por cliente:", error);
    setFilteredByCustomer([]);
  } finally {
    setLoading(false);
  }
}, []);


  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    filteredByCustomer,
    loading,
    error,
    refetch: fetchOrders,
    fetchOrdersByCustomer,
  };
};
