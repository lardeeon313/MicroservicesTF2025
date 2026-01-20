import { useCallback, useEffect, useState } from "react";
import API from "../../../../../api/axios";

import { ModifiedCanceledOrder } from "../../../../admin/pages/AdminDashboardFeatures/ReportsSales/Types/ModifiedCanceledReportType";
import { ModifiedCanceledOrderPagedResult } from "../../../../admin/pages/AdminDashboardFeatures/ReportsSales/Types/ModifiedCanceledReportType";
import { ModifiedCanceledFilters } from "../../../../admin/pages/AdminDashboardFeatures/ReportsSales/Types/ModifiedCanceledReportType";
import { mapStatusModifiedCanceledOrdersBadge } from "../../../../admin/pages/AdminDashboardFeatures/ReportsSales/Types/ModifiedCanceledOrdersBadge";

export function useModifiedCanceledOrdersReport(
  page: number,
  pageSize: number,
  filters: ModifiedCanceledFilters
) {
  const [data, setData] = useState<ModifiedCanceledOrder[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const response =
        await API.get<ModifiedCanceledOrderPagedResult<ModifiedCanceledOrder>>(
          "/sales/SalesReport/reports-orders-modified-canceled",
          {
            params: {
              customerName: filters.customerName || undefined,
              dateFrom: filters.dateFrom || undefined,
              dateTo: filters.dateTo || undefined,
              status: filters.status || undefined,
              page,
              pageSize,
            },
          }
        );


      const normalizedItems = response.data.items.map((order) => ({
        ...order,
        status: mapStatusModifiedCanceledOrdersBadge(order.status as unknown as string),
      }));

      setData(normalizedItems);
      setTotalPages(Math.ceil(response.data.totalCount / pageSize));

      console.log(response)
    } catch (error) {
      console.error("Error fetching modified/canceled orders", error);
    } finally {
      setLoading(false); 
    }
  }, [page, pageSize, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    totalPages,
    refetch: fetchData,
  };
}
