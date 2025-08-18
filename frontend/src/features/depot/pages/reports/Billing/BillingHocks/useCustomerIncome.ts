import { useEffect, useState, useCallback } from "react";
import type { Billing } from "../../../../billingmanager/types/BillingType";
import API from "../../../../../../api/axios";

export const useCustomerIncome = () => {
  const [billings, setBillings] = useState<Billing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await API.get<Billing[]>("/api/billingmanager/all-invoiced-orders");

      setBillings(response.data);
    } catch (err: any) {
      setError(err.message ?? "Error al obtener facturación");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    billings,
    loading,
    error,
    refetch: fetchData,
  };
};
