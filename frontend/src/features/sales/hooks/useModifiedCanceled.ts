import { useCallback, useEffect, useState } from "react";
import { Order } from "../types/OrderTypes";
import { handleFormikError } from "../../../components/ErrorHandler";
import { getPagedCustomers } from "../services/CustomerService";
import { getPagedOrders } from "../services/OrderService";

export function useModifiedCanceled(page: number, pageSize:number) {
    const [data, setData] = useState<Order[]>([]);
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

        const combined = orders.map((o) => {
            const customer = customers.find((c) => c.id === o.customer?.id);
            return {
            ...o,
            customerInfo: customer ? { ...customer } : null,
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
    
    return { data, loading, totalPages, refetch: fetchData}
}