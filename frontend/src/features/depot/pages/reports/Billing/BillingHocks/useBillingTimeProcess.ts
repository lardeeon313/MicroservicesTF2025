import { useEffect, useState } from "react";
import API from "../../../../../../api/axios";
import dayjs from "dayjs";
import { ProcessingTimeOrder } from "../../../../billingmanager/types/BillingTimeProcessType";

interface ApiResponse {
  items: Array<{
    orderId: number;
    durationMinutes: number;
  }>;
  totalItems: number;
  totalPages: number;
}

export const useBillingTimeProcess = (
  from: string,
  to: string,
  page: number,
  pageSize: number
) => {
  const [data, setData] = useState<ProcessingTimeOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: any = { page, pageSize };

        // Si no hay fechas seleccionadas, establecer un rango por defecto
        const defaultFrom = from || dayjs().subtract(7, 'days').format("YYYY-MM-DD 00:00:00");
        const defaultTo = to || dayjs().format("YYYY-MM-DD 23:59:59");

        params.from = defaultFrom;
        params.to = defaultTo;

        console.log("Enviando parámetros al backend:", params);
        const response = await API.get<ApiResponse>(
          "/depot/depotreports/reports/processing-time-per-order",
          { params }
        );
        console.log("Respuesta completa del backend:", response);

        const formattedData = response.data.items.map(item => ({
          orderId: item.orderId,
          averageProcessingTime: item.durationMinutes
        }));

        setTotalPages(response.data.totalPages);
        setData(formattedData);
      } catch (err: any) {
        console.error("Error en API:", err);
        if (err?.response) {
          const status = err.response.status;
          const msg = err.response.data?.message || err.response.data?.title || "al obtener los datos.";
          setError(`Error ${status}: ${msg}`);
        } else {
          setError("Error de red o conexión con el servidor.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [from, to, page, pageSize]);

  return { data, loading, error, totalPages };
};
