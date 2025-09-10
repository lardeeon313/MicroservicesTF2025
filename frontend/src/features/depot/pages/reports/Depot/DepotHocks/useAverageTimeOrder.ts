import { useState, useEffect } from "react";
import API from "../../../../../../api/axios";
import type { ArmTime } from "../DepotComponents/AverageTimeOrderTable";

export const useAverageTimeOrder = (page: number, pageSize: number) => {
  const [data, setData] = useState<ArmTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("📡 Fetching average-time-per-status...");
        console.log("🔗 URL:", "/api/depotreports/reports/average-time-per-status");
        console.log("📌 Params:", { from: "2025-01-01", to: "2025-08-19" });

        const response = await API.get<ArmTime[]>(
          "/depot/depotreports/reports/average-time-per-status",
          { params: { from: "2025-01-01", to: "2025-08-19" } }
        );

        console.log("✅ Response completa:", response);
        console.log("📊 Datos crudos:", response.data);

        // 👉 paginación local
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginatedData = response.data.slice(start, end);

        console.log("📑 Datos paginados:", paginatedData);

        setData(paginatedData);
        setTotalPages(Math.ceil(response.data.length / pageSize));
      } catch (error) {
        console.error("❌ Error en fetchData:", error);
        setError("Hubo un error al cargar los datos");
      } finally {
        setLoading(false);
        console.log("⏳ fetchData finalizado");
      }
    };

    fetchData();
  }, [page, pageSize]);

  return { data, loading, error, totalPages };
};
