import { useEffect, useState } from "react";
import API from "../../../../../../api/axios";
import { PendingCashVerificationReport } from "../../../../types/Report";
import { PendingCashVerificationFilter } from "../../../../types/FilterReports/FilterReportsEntity";

export const usePendingCashVerificationReport = (searchParams: PendingCashVerificationFilter | null) => {
  const [data, setData] = useState<PendingCashVerificationReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchParams) return; // no ejecutar hasta que haya búsqueda

    const fetchReport = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await API.get("/logistic/LogisticReport/pending-cash-verification", {
          params: {
            StartDate: searchParams.startDate,
            EndDate: searchParams.endDate,
            OperatorId: searchParams.operatorId,
            DeliveryTeamId: searchParams.deliveryTeamId,
          },
        });

        console.log("📊 Datos cargados:", response.data);
        setData(response.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [searchParams]);

  return { data, isLoading, error };
};
