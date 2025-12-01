import { useState } from "react";
import API from "../../../../../../api/axios";

/**
 * Convierte una fecha de formato "DD/MM/YYYY" a "YYYY-MM-DD".
 * Si la fecha es inválida o vacía, devuelve un string vacío.
 */
const convertirFechaA_YYYYMMDD = (fechaDDMMYYYY: string): string => {
  if (!fechaDDMMYYYY) return "";
  const partes = fechaDDMMYYYY.split('/');
  if (partes.length !== 3) return ""; // Formato inválido
  const [dia, mes, anio] = partes;
  return `${anio}-${mes}-${dia}`;
};

export interface Order {
  depotOrderId: number;
  salesOrderId: number;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  deliveryDate: string;
}

export const useOrderCompletedDay = () => {
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const fetchData = async (startDate: string, endDate: string, pageNum: number) => {
    try {
      setLoading(true);

      // 1. Convertimos las fechas del formato UI (DD/MM/YYYY) al formato API (YYYY-MM-DD)
      const fechaConvertidaInicio = convertirFechaA_YYYYMMDD(startDate);
      const fechaConvertidaFin = convertirFechaA_YYYYMMDD(endDate);

      // 2. Añadimos la hora para crear un rango de tiempo completo y válido
      const formattedStartDate = fechaConvertidaInicio ? `${fechaConvertidaInicio}T00:00:00` : "";
      const formattedEndDate = fechaConvertidaFin ? `${fechaConvertidaFin}T23:59:59` : "";



      const response = await API.get("depot/depotreports/reports/orders-completed", {
        params: {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          page: pageNum,
        },
      });

      console.log(response)

      

      const items: Order[] = response.data.items || [];
      setData(items);
      setTotalPages(response.data.totalPages || 1);

    } catch (error) {
      setError("Error al cargar los datos");
     
    } finally {
      setLoading(false);
    }
  };

  const onSearch = () => {
    fetchData(startDate, endDate, 1);
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
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
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    onSearch,
    fetchData,
    clearFilters,
  };
};
