import { useEffect, useState, useCallback } from "react";
import type { Billing } from "../../../../billingmanager/types/BillingType";
import API from "../../../../../../api/axios";

export const useCustomerIncome = () => {
  const [orders, setOrders] = useState<Billing[]>([]);
  const [filteredByCustomer, setFilteredByCustomer] = useState<Billing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await API.get<Billing[]>(
        "/depot/billingmanager/all-invoiced-orders"
      );

      if (!res.data || res.data.length === 0) {
        setOrders([]);
        setError("No hay órdenes facturadas.");
        return;
      }

      // ✅ Este endpoint YA devuelve solo facturadas
      setOrders(res.data);

      console.log("Órdenes facturadas (general):", res.data);
    } catch (err) {
      console.error("Error al obtener órdenes:", err);
      setError("Error al conectar con el servidor.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // PARTICULAR POR CLIENTE
  // PARCHE FRONTEND CORRECTO
  // =========================
  const fetchOrdersByCustomer = useCallback(
    (customerName: string) => {
      if (!customerName.trim()) {
        setFilteredByCustomer([]);
        return;
      }

      const filtered = orders.filter(order =>
        order.customerName
          .toLowerCase()
          .includes(customerName.toLowerCase())
      );

      console.log(
        "Pedidos facturados del cliente (desde general):",
        filtered
      );

      setFilteredByCustomer(filtered);
    },
    [orders]
  );


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
