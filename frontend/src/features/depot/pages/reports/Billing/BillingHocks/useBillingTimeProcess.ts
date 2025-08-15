import { useEffect, useState } from "react";
import API from "../../../../../../api/axios";

interface ProcessingTimeOrder {
  // Ajusta las propiedades según lo que devuelva el endpoint
  orderId: string;
  averageProcessingTime: number;
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
        const response = await API.get(
          '/depot/depotreports/reports/processing-time-per-order',
          {
            params: { from, to, page, pageSize },
          }
        );

        const totalCount = Number(response.headers["x-total-count"]) || 0;
        setTotalPages(Math.ceil(totalCount / pageSize) || 1);
        setData(response.data);
      } catch (err) {
        console.error(err);
        setError("Error al obtener los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [from, to, page, pageSize]);

  return { data, loading, error, totalPages };
};
