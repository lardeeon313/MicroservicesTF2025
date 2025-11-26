import { useState, useEffect } from "react";
import API from "../../../../../../api/axios";
import { DeliveryRejectionReport, PagedResponse } from "../../../../types/Report";
import { RejectionReportFilters } from "../../../../types/FilterReports/FilterReportsEntity";

export const useDeliveryRejections = (filters: RejectionReportFilters & { pageNumber?: number; pageSize?: number }) => {
  const [data, setData] = useState<DeliveryRejectionReport[]>([]);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (params?: RejectionReportFilters & { pageNumber?: number; pageSize?: number }) => {
  try {
    setLoading(true);

    const cleanParams = Object.fromEntries(
      Object.entries(params || {}).filter(([_, v]) => v !== undefined && v !== "")
    );

    // 🔥 Normalizar nombres de parámetros al formato esperado por el backend (.NET PascalCase)
    const apiParams: Record<string, any> = {
      StartDate: cleanParams.startDate,
      EndDate: cleanParams.endDate,
      DeliveryZoneId: cleanParams.deliveryZoneId,
      DeliveryTeamId: cleanParams.deliveryTeamId,
      OperatorId: cleanParams.operatorId,
      PageNumber: cleanParams.pageNumber,
      PageSize: cleanParams.pageSize,
    };

    // 🔥 Filtrar solo los que tienen valor definido
    const filteredParams = Object.fromEntries(
      Object.entries(apiParams).filter(([_, v]) => v !== undefined && v !== "")
    );

    

    const response = await API.get<PagedResponse<DeliveryRejectionReport>>(
      "/logistic/LogisticReport/delivery-rejections",
      { params: filteredParams }
    );

    setData(response.data.items);
    setPagination({
      totalCount: response.data.totalCount,
      pageNumber: response.data.pageNumber,
      pageSize: response.data.pageSize,
      totalPages: response.data.totalPages,
    });

    setError(null);
  } catch (err: any) {
    console.error("❌ Error en la solicitud:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchData(filters);
  }, [JSON.stringify(filters)]);

  return { data, pagination, loading, error, fetchData };
};
