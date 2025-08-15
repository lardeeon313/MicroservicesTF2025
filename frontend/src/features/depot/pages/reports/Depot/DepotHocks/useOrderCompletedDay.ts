import { useState } from "react";
import API from "../../../../../../api/axios";

export interface Order {
  id: number;
  finishDate: string;
  total: number;
  status: string;
}

export const useOrderCompletedDay = () => {
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const fetchData = async (from?: string, to?: string, pageNumber = 1) => {
    try {
      setLoading(true);
      setError(null);

      const res = await API.get("/depot/depotreports/reports/orders-completed", {
        params: {
          from: from || "",
          to: to || "",
          page: pageNumber,
          pageSize: 10,
        },
      });

      console.log("API response:", res.data);

      // Ajustar si la API devuelve otra estructura
      const items = res.data.items ?? res.data ?? [];
        setData(Array.isArray(items) ? items : []
    );
      setTotalPages(res.data.totalPages || 1);
    } catch (err: any) {
      setError(
        err.message || "Error al obtener los datos"
    );
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedDate("");
    fetchData();
  };

  return {
    data,
    loading,
    error,
    page,
    setPage,
    totalPages,
    selectedDate,
    setSelectedDate,
    fetchData,
    clearFilters,
  };
};
