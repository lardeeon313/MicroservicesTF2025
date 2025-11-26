import { useEffect, useState } from "react";
import API from "../../../../../../api/axios";
import { DeliveryIncidentReport } from "../../../../types/Report";
import { DeliveryIncidentFilters } from "../../../../types/FilterReports/FilterReportsEntity";
import { PagedResponse } from "../../../../types/Report";

export const useDeliveryIncidentsReport = (filters: DeliveryIncidentFilters) => {
  const [data, setData] = useState<DeliveryIncidentReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = {
          ...filters,
          pageNumber,
          pageSize,
        };

        const response = await API.get<PagedResponse<DeliveryIncidentReport>>(
          `/logistic/LogisticReport/delivery-incidents`,
          { params }
        );

        

        setData(response.data.items || []);
        setTotalCount(response.data.totalCount);
        setTotalPages(response.data.totalPages);
      } catch (err: any) {
        console.error("❌ Error al obtener delivery incidents:", err);
        setError("Error al obtener los reportes");
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [JSON.stringify(filters), pageNumber, pageSize]);

  return {
    data,
    isLoading,
    error,
    totalCount,
    totalPages,
    pageNumber,
    pageSize,
    setPageNumber,
    setPageSize,
  };
};
