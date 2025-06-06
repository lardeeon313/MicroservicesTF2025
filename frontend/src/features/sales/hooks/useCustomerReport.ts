import { useEffect, useState, useCallback } from "react";
import { CustomerWithCount } from "../types/CustomerTypes";
import { getPagedOrders } from "../services/OrderService";
import { handleFormikError } from "../../../components/ErrorHandler";
import { getPagedCustomers } from "../services/CustomerService";


export function useCustomerReport(page: number, pageSize: number) {
  const [data, setData] = useState<CustomerWithCount[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [customerData, orderData] = await Promise.all([
        getPagedCustomers(page, pageSize),
        getPagedOrders(1, 1000), // Podés paginar orders también si querés performance
      ]);

      const customers = customerData.customers;
      const orders = orderData.orders;

      const combined = customers.map((c) => {
        const orderCount = orders.filter((o) => o.customerId === c.id).length;
        return {
          ...c,
          fullName: `${c.firstName} ${c.lastName}`,
          orderCount,
        };
      });

      setData(combined);
      setTotalPages(customerData.totalPages);
    } catch (error) {
      handleFormikError({
        error,
        customMessages: {
          400: "Datos inválidos.",
          404: "Clientes no encontrados.",
          500: "Error interno del servidor.",
        },
      });
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, totalPages, refetch: fetchData };
}
