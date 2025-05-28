import { useEffect, useState, useCallback } from "react";
import { CustomerSatisfaction, CustomerWithCount } from "../types/CustomerTypes";
import { getPagedOrders } from "../services/OrderService";
import { handleFormikError } from "../../../components/ErrorHandler";
import { getPagedCustomers } from "../services/CustomerService";


export function useCustomerSatisfaction(page: number, pageSize: number) {
  const [data, setData] = useState<CustomerWithCount[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const randomSatisfaction = (): CustomerSatisfaction => {
    const values = [CustomerSatisfaction.Positiva, CustomerSatisfaction.Negativa, CustomerSatisfaction.Neutra];
    return values[Math.floor(Math.random() * values.length)];
  };

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
        const customerOrders = orders.filter((o) => o.customerId === c.id);
        const randomOrder = customerOrders[Math.floor(Math.random() * customerOrders.length)];

        return {
            ...c,
            fullName: `${c.firstName} ${c.lastName}`,
            orderCount: customerOrders.length,
            pedidoID: randomOrder?.id ?? "N/A",
            satisfaction: randomSatisfaction(),
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
