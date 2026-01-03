import { useState } from "react";
import API from "../../../../../../../api/axios";

export interface DepotTeamPerformanceDto {
  depotTeamId: number | null;
  name: string;
  ordersHandled: number;
  missingItemsReported: number;
  isTeam: boolean;
  operatorId: string | null;
}

interface Filters {
  from?: string | null;
  to?: string | null;
  agruparPorEquipo: boolean;
}

export const useDepotTeamPerformance = () => {
  const [data, setData] = useState<DepotTeamPerformanceDto[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (filters: Filters) => {
    try {
      setLoading(true);

      const response = await API.get(
        "/depot/depotreports/reports/depot-team-performance",
        {
          params: {
            from: filters.from || null,
            to: filters.to || null,
            agruparPorEquipo: filters.agruparPorEquipo,
          },
        }
      );

      setData(response.data);
    } catch (err) {
      console.error("Error loading performance report:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    fetchData,
  };
};