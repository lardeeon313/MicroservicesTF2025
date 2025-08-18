import { useEffect, useState } from "react";
import API from "../../../../../../api/axios";
import type { BillingTimeProcess } from "../../../../billingmanager/types/BillingTimeProcessType";

export const useOrderBilledByCustomer = (customerId: string) => {
  const [data, setData] = useState<BillingTimeProcess[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) return;

    const fetchData = async () => {
      try {
        const response = await API.get(
           `/depot/billingmanager/invoiced-orders-by-customer?customerId=${customerId}`,
          {
            params: { customerId }, // mejor como query param que body en GET
          }
        );

        setData(response.data);
      } catch (error) {
        console.error(error);
        setError("Error al obtener los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customerId]);

  return { data, loading, error };
};
