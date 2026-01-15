import { useState } from "react";
import API from "../../../../../../api/axios";
import { ZonePerformanceReport } from "../../../../../verification/types/Report";

export const AdminUseZonePerformanceReport = () => {
  const [data, setData] = useState<ZonePerformanceReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async (
    startDate?: string,
    endDate?: string,
    operatorId?: string,
    deliveryTeamId?: number
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get("/logistic/LogisticReport/zone-performance", {
        params: {
          StartDate: startDate,
          EndDate: endDate,
          OperatorId: operatorId,
          DeliveryTeamId: deliveryTeamId,
        },
      });
      
      setData(response.data);
    } catch (err: any) {
      setError("Error al obtener el reporte de eficiencia por zona.");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchReport };
};
