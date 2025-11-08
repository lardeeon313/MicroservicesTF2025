import { useState } from "react";
import API from "../../../../../../api/axios";
import { OrdersByStatusDtoReport } from "../../../../types/Report";
import { OrdersByStatusFilters } from "../../../../types/FilterReports/FilterReportsEntity";

export const useOrdersByStatusReport = () => {
  const [data, setData] = useState<OrdersByStatusDtoReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async (filters: OrdersByStatusFilters) => {
  try {
    setLoading(true);
    setError(null);
    console.log("🔍 Filtros antes de enviar al backend:", JSON.stringify(filters, null, 2));

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    console.log("🔗 URL completa con parámetros:", `/logistic/LogisticReport/orders-by-status?${params.toString()}`);

    const response = await API.get<OrdersByStatusDtoReport[]>(
      "/logistic/LogisticReport/orders-by-status",
      { params: filters } // filters ya incluye paymentType (camelCase)
    );

    console.log("📌 Respuesta completa del backend:", response);
    console.log("📊 Datos recibidos del backend:", response.data);
    setData(response.data ?? []);
  } catch (err: any) {
    console.error("❌ Error detallado en OrdersByStatusReport:", err);
    setError(
      typeof err.response?.data === "string"
        ? err.response.data
        : err.response?.data?.title || "Error al obtener el reporte"
    );
  } finally {
    setLoading(false);
  }
};


  return {
    data,
    loading,
    error,
    fetchReport,
  };
};
