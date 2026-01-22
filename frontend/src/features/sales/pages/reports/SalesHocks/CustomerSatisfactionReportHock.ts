import { useEffect, useState } from "react";
import API from "../../../../../api/axios";
import { AdminCustomerSatisfactionReportItem, AdminCustomerSatisfactionPagedResult, CustomerSatisfactionLevel, mapScoreToBackendLevel} from "../../../../admin/pages/AdminDashboardFeatures/ReportsSales/Types/CustomerSatisfactionType";

interface Filters {
  name?: string;
  email?: string;
  satisfaction?: CustomerSatisfactionLevel | "Todas";
}

export const UseCustomerSatisfactionReport = (
  page: number,
  pageSize: number,
  filters: Filters
) => {
  const [data, setData] =
    useState<
      AdminCustomerSatisfactionPagedResult<AdminCustomerSatisfactionReportItem> | null
    >(null);

  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);

    /** 🔑 NORMALIZACIÓN CLAVE DEL FILTRO */
    const backendLevel =
      typeof filters.satisfaction === "number"
        ? mapScoreToBackendLevel(filters.satisfaction)
        : null;

    const payload = {
      name: filters.name?.trim() || null,
      email: filters.email?.trim() || null,
      level: backendLevel,
      page,
      pageSize,
    };


    try {
      const response = await API.post(
        "/sales/SalesReport/reports-satisfaction-customer",
        payload
      );

      setData(response.data);
    } catch (error) {
      console.error("❌ ERROR BACKEND:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();

  }, [page, pageSize, filters.name, filters.email, filters.satisfaction]);

  return {
    data,
    loading,
    refetch: fetchReport,
    totalPages: data
      ? Math.ceil(data.totalCount / data.pageSize)
      : 0,
  };
};
