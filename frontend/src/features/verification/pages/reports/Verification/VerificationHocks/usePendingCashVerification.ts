import { useEffect, useState } from "react";
import API from "../../../../../../api/axios";
import { PendingCashVerificationReport } from "../../../../types/Report";
import { PendingCashVerificationFilter } from "../../../../types/FilterReports/FilterReportsEntity";
import { PagedResponse } from "../../../../types/Report";

export const usePendingCashVerificationReport = (
  searchParams: PendingCashVerificationFilter | null,
  pageNumber: number,
  pageSize: number
) => {
  const [data, setData] = useState<PagedResponse<PendingCashVerificationReport> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchParams) return;

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
            PageNumber: pageNumber,
            PageSize: pageSize,
          },
        });

        
        setData(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [searchParams, pageNumber, pageSize]);

  return { data, isLoading, error };
};
