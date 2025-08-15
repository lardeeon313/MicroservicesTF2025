import { useEffect, useState } from "react";
import type { DepotTeam } from "../../../../depotmanager/types/DepotTeamTypes";
import API from "../../../../../../api/axios";

type ProductivityProps = {
  teamId: DepotTeam["id"];
  completedOrders: number;
};

export const useTeamProductivity = (from: string, to: string) => {
  const [data, setData] = useState<ProductivityProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!from || !to) return; // No hacer request si faltan fechas

    const fetchTeamProductivity = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await API.get<ProductivityProps[]>(
          "/depot/depotreports/reports/depot-team-performance",
          {
            params: { from, to },
          }
        );

        setData(response.data);
      } catch (error) {
        console.error("Error al obtener la productividad de los equipos:", error);
        setError("Error al obtener los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamProductivity();
  }, [from, to]);

  return { data, loading, error };
};
