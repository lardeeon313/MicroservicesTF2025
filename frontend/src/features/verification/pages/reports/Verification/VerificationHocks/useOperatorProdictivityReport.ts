import { useState, useEffect } from "react";
import API from "../../../../../../api/axios";
import { OperatorProductivityReport } from "../../../../types/Report";
import { OperatorProductivityFilterEntity } from "../../../../types/FilterReports/FilterReportsEntity";

export const useOperatorProductivityReport = (filters: OperatorProductivityFilterEntity) => {
  const [data, setData] = useState<OperatorProductivityReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await API.get("/logistic/LogisticReport/operator-productivity", {
          params: filters,
        });

        console.log("📦 Datos recibidos del endpoint /operator-productivity:", data);
        setData(data);
      } catch (err: any) {
        console.error("❌ Error al obtener operator productivity:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    // ✅ Siempre hace la primera carga al entrar en la página
    // ✅ Y también cada vez que cambian los filtros
    console.log("🔍 Ejecutando fetch con filtros:", filters);
    fetchData();
  }, [filters]);

  return { data, isLoading, error };
};
