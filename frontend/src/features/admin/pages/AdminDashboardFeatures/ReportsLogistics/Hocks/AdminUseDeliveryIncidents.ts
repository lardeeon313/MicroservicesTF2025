import { useEffect, useState } from "react";
import API from "../../../../../../api/axios";
import { DeliveryIncidentReport } from "../../../../../verification/types/Report";
import { DeliveryIncidentFilters } from "../../../../../verification/types/FilterReports/FilterReportsEntity";
import { PagedResponse } from "../../../../../verification/types/Report";

export const AdminUseDeliveryIncidentsReport = (
  filters: DeliveryIncidentFilters,
  refreshKey: number
) => {
  const [data, setData] = useState<DeliveryIncidentReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // ❌ NO mandamos resolved al backend
        const { resolved, ...filtersWithoutResolved } = filters;

        const params = {
          ...filtersWithoutResolved,
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
      } catch {
        setError("Error al obtener los reportes");
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [JSON.stringify(filters), pageNumber, refreshKey]);

  return {
    data,
    isLoading,
    error,
    totalCount,
    totalPages,
    pageNumber,
    setPageNumber,
  };
};
