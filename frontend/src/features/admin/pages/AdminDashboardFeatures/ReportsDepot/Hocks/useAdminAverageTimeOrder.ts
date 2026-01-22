import { useState, useEffect } from "react";
import API from "../../../../../../api/axios";

export interface OrderProcessingTime {
  orderId: number;
  customerName: string;
  operatorFullName: string | null;
  startPreparation: string;
  prepared: string;
  durationMinutes: number;
}

export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

interface Filters {
  from?: string | null;
  to?: string | null;
  oper?: string | null;
  customer?: string | null;
  page: number;
  pageSize: number;
}

export const useProcessingTimePerOrder = (filters: Filters) => {
  const [data, setData] = useState<PaginatedResult<OrderProcessingTime>>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await API.get(
        "/depot/depotreports/reports/processing-time-per-order",
        { params: filters }
      );

      setData(response.data);
    } catch (err: any) {
      setError("Error obteniendo el reporte.");
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchData();
  }, [filters]);

  return { data, loading, error };
};
