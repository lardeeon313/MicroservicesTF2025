import { useState, useEffect } from "react";
import API from "../../../../../../api/axios";
import type { ArmTime } from "../DepotComponents/AverageTimeOrderTable";

export const useAverageTimeOrder = (
  page: number,
  pageSize: number,
  from?: string,
  to?: string
) => {
  const [data, setData] = useState<ArmTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = {};
        if (from && from.trim() !== "") params.from = from;
        if (to && to.trim() !== "") params.to = to;

        const response = await API.get("/depot/depotreports/reports/average-time-per-status", { params });
        console.log("📦 Respuesta cruda del back:", response.data)
        const raw: any[] = response.data ?? [];

        // Normalizamos cada item al tipo ArmTime
        const normalized: ArmTime[] = raw.map((item: any, index: number) => {
          const base: ArmTime = {
            id: item.id ?? index,
            orderId: Number(item.orderId),
            averageDuration: Number(item.averageDuration ?? 0),
          };

          if (item.status) base.status = String(item.status);
          if (item.oldStatus !== undefined) base.oldStatus = Number(item.oldStatus);
          if (item.newStatus !== undefined) base.newStatus = Number(item.newStatus);
          if (item.changedAt) {
            try {
              base.changedAt = new Date(item.changedAt).toISOString();
            } catch {
              base.changedAt = undefined;
            }
          }

          return base;
        });

        // paginación local
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginated = normalized.slice(start, end);

        setData(paginated);
        setTotalPages(Math.max(1, Math.ceil(normalized.length / pageSize)));
      } catch (err) {
        console.error("❌ Error en fetchData:", err);
        setError("Hubo un error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize, from, to]);

  return { data, loading, error, totalPages };
};
