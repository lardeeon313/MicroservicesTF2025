import { useEffect, useState } from "react";
import API from "../../../../../../api/axios";

type ProductivityProps = {
  depotTeamId: number;
  teamName: string;
  ordersHandled: number;
};

export const useTeamProductivity = (from: string, to: string) => {
  const [data, setData] = useState<ProductivityProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!from || !to) {
      console.log("⏩ No se hace request porque faltan fechas:", { from, to });
      return;
    }

    const fetchTeamProductivity = async () => {
      setLoading(true);
      setError(null);
      console.log("📤 Fetching team productivity...", { from, to });

      try {
        const response = await API.get<ProductivityProps[]>(
          "/depot/depotreports/reports/depot-team-performance",
          { params: { from, to } }
        );

        console.log("✅ Respuesta cruda del backend:", response.data);

        setData(response.data);

        console.log("📊 Data seteada en el hook:", response.data);
      } catch (error) {
        console.error("❌ Error al obtener la productividad de los equipos:", error);
        setError("Error al obtener los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamProductivity();
  }, [from, to]);

  return { data, loading, error };
};
