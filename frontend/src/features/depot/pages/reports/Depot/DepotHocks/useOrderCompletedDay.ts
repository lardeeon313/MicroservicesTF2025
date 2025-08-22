import { useState } from "react";
import API from "../../../../../../api/axios";

export interface Order {
  depotOrderId: number;
  salesOrderId: number;
  customerName: string;
  customerEmail: string;
  orderDate: string;
}

export const useOrderCompletedDay = () => {
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>("");

  
  const fetchData = async (startDate: string, endDate: string, pageNum: number) => {
    try {
      setLoading(true);
    
      // Si hay fecha, asegúrate de que esté en formato YYYY-MM-DD
      const formattedStartDate = startDate || "";
      const formattedEndDate = endDate || "";
    
      // Tu llamada a la API aquí
      const response = await API.get('depot/depotreports/reports/orders-completed', {
        params: {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          page: pageNum,
          // otros parámetros...
        }
      });
    
      // Procesar respuesta...
      setData(response.data.items || []);
      setTotalPages(response.data.totalPages || 1);
    
    } catch (error) {
      setError("Error al cargar los datos");
      console.error(error);
    } finally {
      setLoading(false);
    }
};

const clearFilters = () => {
  setSelectedDate("");
  setPage(1);
  fetchData("", "", 1); // Cargar todos los datos sin filtro
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


///depot/depotreports/reports/orders-completed