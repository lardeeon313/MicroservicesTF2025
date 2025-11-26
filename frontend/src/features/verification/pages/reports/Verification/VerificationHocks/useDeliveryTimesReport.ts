// useDeliveryTimesReport.ts
import { useState, useCallback } from "react";
import API from "../../../../../../api/axios";
import { DeliveryTimeReportItem } from "../../../../types/Report";
import { DeliveryTimeFilterEntity } from "../../../../types/FilterReports/FilterReportsEntity";

export const useDeliveryTimesReport = () => {
  const [data, setData] = useState<DeliveryTimeReportItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async (filter: DeliveryTimeFilterEntity) => {
    try {
      setLoading(true);
      setError(null);

      // Construimos params respetando el nombre que espera el endpoint
      const params: any = {};
      if (filter.StartDate) params.StartDate = filter.StartDate;
      if (filter.EndDate) params.EndDate = filter.EndDate;
      if (filter.DeliveryZoneId !== undefined && filter.DeliveryZoneId !== null)
        params.DeliveryZoneId = filter.DeliveryZoneId;
      if (filter.DeliveryTeamId !== undefined && filter.DeliveryTeamId !== null)
        params.DeliveryTeamId = filter.DeliveryTeamId;
      if (filter.OperatorId) params.OperatorId = filter.OperatorId;

      const resp = await API.get<DeliveryTimeReportItem[]>(
        "/logistic/LogisticReport/delivery-times",
        { params }
      );

      console.log(resp)
      
      setData(resp.data ?? []);
    } catch (err: any) {
      
      setError(err?.response?.data?.message ?? err.message ?? "Error");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchReport, setData };
};

export default useDeliveryTimesReport;
