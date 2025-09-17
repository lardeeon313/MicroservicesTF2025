import { useEffect, useState } from "react";
import API from "../../../../../../api/axios";
import dayjs from "dayjs";

interface ProcessingTimeOrder {
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
    // si no hay fechas, no llamar
    if (!from || !to) {
      setData([]);
      setTotalPages(1);
      setLoading(false);
      setError(null);
      return;
    }

    // valida rango (opcional: intercambia si vienen invertidas)
    const fromD = dayjs(from, "DD/MM/YYYY");
    const toD = dayjs(to, "DD/MM/YYYY");
    if (!fromD.isValid() || !toD.isValid()) {
      setData([]);
      setLoading(false);
      setError("Fechas inválidas.");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // 🔸 ARMO RANGO EN HORA LOCAL (SIN UTC, SIN Z)
        const fromFormatted = fromD
          .set("hour", 0)
          .set("minute", 0)
          .set("second", 0)
          .set("millisecond", 0)
          .format("YYYY-MM-DD HH:mm:ss");

        const toFormatted = toD
          .set("hour", 23)
          .set("minute", 59)
          .set("second", 59)
          .set("millisecond", 0)
          .format("YYYY-MM-DD HH:mm:ss");

        console.log("📤 Parámetros enviados (local):", {
          from: fromFormatted,
          to: toFormatted,
          page,
          pageSize,
        });

        const response = await API.get(
          "/depot/depotreports/reports/processing-time-per-order",
          {
            params: {
              from: fromFormatted,
              to: toFormatted,
              page,
              pageSize,
            },
          }
        );

        console.log("📥 Respuesta completa:", response);

        setTotalPages(response?.data?.totalPages ?? 1);
        setData(response?.data?.items ?? []);
      } catch (err: any) {
        console.error("❌ Error en API:", err);
        if (err?.response) {
          const status = err.response.status;
          const msg =
            err.response.data?.message ||
            err.response.data?.title ||
            "al obtener los datos.";
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
