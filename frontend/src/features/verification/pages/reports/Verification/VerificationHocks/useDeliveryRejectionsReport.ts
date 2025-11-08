import { useState, useEffect } from "react";
import API from "../../../../../../api/axios";
import { DeliveryRejectionReport } from "../../../../types/Report";
import { RejectionReportFilters } from "../../../../types/FilterReports/FilterReportsEntity";

export const useDeliveryRejections = (filters: RejectionReportFilters) => {
  const [data, setData] = useState<DeliveryRejectionReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const fetchData = async (params?: RejectionReportFilters) => {
  try {
    setLoading(true);
    const cleanParams = Object.fromEntries(
      Object.entries(params || {}).filter(([_, v]) => v !== undefined && v !== "")
    );
    console.log("📡 Consultando rechazos con filtros:", cleanParams);

    const response = await API.get("/logistic/LogisticReport/delivery-rejections", {
      params: cleanParams,
    });

    console.log("📦 Datos recibidos del backend:", response.data);

    // Filtrar localmente si el backend no lo hace
    let filteredData = response.data;
    if (cleanParams.deliveryTeamId) {
      filteredData = response.data.filter(
        (item: DeliveryRejectionReport) => item.deliveryTeamId === cleanParams.deliveryTeamId
      );
      console.log("🔎 Datos filtrados localmente:", filteredData);
    }

    setData(filteredData); // Asignar los datos filtrados al estado
    setError(null);
  } catch (err: any) {
    console.error("❌ Error en la solicitud:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    console.log("🔄 useEffect disparado con filtros:", filters);
    fetchData(filters);
  }, [JSON.stringify(filters)]);

  return { data, loading, error };
};
