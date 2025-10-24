// hocks/usePostResolveDeliveryIncident.ts
import { useState, useCallback } from "react";
import { PostResolveDeliveryIncident } from "../services/postResolvedIncident";
import { ResolveDeliveryIncidentRequest } from "../types/Request";

export const useResolveDeliveryIncident = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resolveIncident = useCallback(async (request: ResolveDeliveryIncidentRequest) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log("📤 [useResolveDeliveryIncident] → Enviando solicitud para resolver incidente:");
      console.log("🧾 Request data:", JSON.stringify(request, null, 2));

      const response = await PostResolveDeliveryIncident(request);

      console.log("✅ [useResolveDeliveryIncident] → Incidente resuelto correctamente.");
      console.log("📩 Respuesta completa del backend:", response);

      setSuccess(true);
    } catch (err: any) {
      console.error("❌ [useResolveDeliveryIncident] → Error detectado.");

      // Logs más detallados:
      console.log("🧠 Tipo de error:", typeof err);
      console.log("🧩 Error completo:", err);
      console.log("📡 err.message:", err?.message);
      console.log("📦 err.response?.status:", err?.response?.status);
      console.log("📜 err.response?.data:", err?.response?.data);
      console.log("🌐 err.config?.url:", err?.config?.url);

      setError(err.response?.data || err.message);
      throw err;
    } finally {
      console.log("🔚 [useResolveDeliveryIncident] → Finalizando ejecución. isLoading = false");
      setIsLoading(false);
    }
  }, []);

  return { resolveIncident, isLoading, error, success };
};
