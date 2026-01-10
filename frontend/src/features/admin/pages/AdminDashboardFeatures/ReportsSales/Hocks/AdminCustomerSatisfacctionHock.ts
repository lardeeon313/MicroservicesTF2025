import { useEffect, useState } from "react";
import API from "../../../../../../api/axios";
import {
  AdminCustomerSatisfactionReportItem,
  AdminCustomerSatisfactionPagedResult,
  AdminMapCustomerSatisfaction,
} from "../Types/CustomerSatisfactionType";

interface Filters {
  name?: string;
  email?: string;
  level?: "Positiva" | "Negativa" | "Neutra" | "Todas";
}

export const AdminUseCustomerSatisfactionReport = (
  page: number,
  pageSize: number,
  filters: Filters
) => {
  const [data, setData] =
    useState<AdminCustomerSatisfactionPagedResult<AdminCustomerSatisfactionReportItem> | null>(null);

  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await API.post<
        AdminCustomerSatisfactionPagedResult<AdminCustomerSatisfactionReportItem>
      >("/sales/SalesReport/reports-satisfaction-customer", {
        name: filters.name || null,
        email: filters.email || null,
        level:
          filters.level && filters.level !== "Todas"
            ? AdminMapCustomerSatisfaction(filters.level)
            : null,
        page,
        pageSize,
      });

      setData(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [page, pageSize, filters]);

  return {
    data,
    loading,
    refetch: fetchReport,
    totalPages: data
      ? Math.ceil(data.totalCount / data.pageSize)
      : 0,
  };
};
