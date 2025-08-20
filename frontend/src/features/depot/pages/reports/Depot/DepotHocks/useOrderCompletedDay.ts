import { useState } from "react";
import API from "../../../../../../api/axios";

export interface Order {
  depotOrderId: number;
  salesOrderId: number;
  customerName: string;
  customerEmail: string;
  completedAt: string; 
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
      console.log("🔄 FetchData iniciado", { from, to, pageNumber });
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

      console.log("✅ API response:", res.data);

      // Ajustar si la API devuelve otra estructura
      const items = res.data.items ?? res.data ?? [];
      console.log("📦 Items procesados:", items);

      setData(Array.isArray(items) ? items : []);
      console.log("📊 Data seteada:", Array.isArray(items) ? items : []);

      setTotalPages(res.data.totalPages || 1);
      console.log("📄 Total de páginas seteado:", res.data.totalPages || 1);

    } catch (err: any) {
      console.error("❌ Error en fetchData:", err);
      setError(err.message || "Error al obtener los datos");
    } finally {
      console.log("⏹️ FetchData finalizado");
      setLoading(false);
    }
  };

  const clearFilters = () => {
    console.log("🧹 Limpieza de filtros ejecutada");
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
