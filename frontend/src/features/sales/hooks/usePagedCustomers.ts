import { useCallback, useEffect, useState } from "react";
import { CustomerResponse } from "../types/CustomerTypes";
import { getPagedCustomers } from "../services/CustomerService";
import { handleFormikError } from "../../../components/ErrorHandler";



export function usePagedCustomers(page: number, pageSize: number) {
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);    

  const fetchData = useCallback(async () => {
    try {
        setLoading(true);
        const result = await getPagedCustomers(page, pageSize);
        setCustomers(result.customers);
        setTotalPages(result.totalPages);
    } catch (error) {
        handleFormikError({
            error,
            customMessages: {
                400: "Datos inválidos, por favor verificá los campos",
                404: "Clientes no encontrados",
                500: "Error interno del servidor",
            },
        });
    } finally {
        setLoading(false);
    }
  }, [page, pageSize]);


  useEffect(() => {
    fetchData(); 
  }, [fetchData])

  return { customers, loading, error, totalPages, refetch: fetchData}
}