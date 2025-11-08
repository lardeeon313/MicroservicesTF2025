import { useEffect, useState } from "react";
import API from "../../../../../../api/axios";
import { DeliveryIncidentReport } from "../../../../types/Report";
import { DeliveryIncidentFilters } from "../../../../types/FilterReports/FilterReportsEntity";

export const useDeliveryIncidentsReport = (filters: DeliveryIncidentFilters) => {
  const [data, setData] = useState<DeliveryIncidentReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Armamos los parámetros dinámicos
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, String(value));
          }
        });

        // Llamada usando tu cliente API
        const response = await API.get<DeliveryIncidentReport[]>(
          `/logistic/LogisticReport/delivery-incidents?${params.toString()}`
        );
        console.log("DATOS:" , response)

        // Si no hay data, aseguramos un array vacío (evita que la UI crashee)
        setData(response.data || []);
      } catch (err: any) {
        console.error("❌ Error al obtener delivery incidents:", err);
        setError(err.message || "Error al obtener los reportes");
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [JSON.stringify(filters)]);

  return { data, isLoading, error };
};
