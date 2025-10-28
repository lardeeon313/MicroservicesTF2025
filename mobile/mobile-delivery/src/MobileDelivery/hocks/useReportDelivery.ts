import { useState } from "react";
import { PostReportDeliveryIncident } from "../services/postReportDelivery";
import { ReportDeliveryIncidentRequest } from "../types/Request";

export const useReportDeliveryIncident = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reportIncident = async (request: ReportDeliveryIncidentRequest) => {
    setIsLoading(true);
    setIsSuccess(false);
    setError(null);

    try {
      await PostReportDeliveryIncident(request);
      setIsSuccess(true);
      console.log("✅ Incidente reportado correctamente.");
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Error desconocido";
      setError(message);
      console.error("❌ Error al reportar el incidente:", message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    reportIncident,
    isLoading,
    isSuccess,
    error,
  };
};
