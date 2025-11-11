import { useState, useEffect } from "react";
import API from "../../../../../../api/axios";
import { CustomerIncidentReport } from "../../../../types/Report";
import { PagedResponse } from "../../../../types/Report";

interface Filters {
  startDate?: string;
  endDate?: string;
  customerId?: string;
  incidentType?: string;
  pageNumber?: number;
  pageSize?: number;
}

export const useCustomersWithIncidents = (filters: Filters) => {
  const [data, setData] = useState<CustomerIncidentReport[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await API.get<PagedResponse<CustomerIncidentReport>>(
        "/logistic/LogisticReport/customers-with-incidents",
        { params: { ...filters, pageNumber, pageSize } }
      );

      console.log("CLIENTES CON MAYOR INCIDENCIA", response.data);

      setData(response.data.items);
      setTotalCount(response.data.totalCount);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error(err);
      setError("Error al obtener el reporte de incidencias");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, pageNumber, pageSize]);

  return {
    data,
    totalCount,
    totalPages,
    pageNumber,
    pageSize,
    setPageNumber,
    setPageSize,
    isLoading,
    error,
  };
};
