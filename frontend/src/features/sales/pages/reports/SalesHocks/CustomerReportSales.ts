import { useState } from "react";
import API from "../../../../../api/axios";
import { CustomerReportFilters } from "../../../../admin/pages/AdminDashboardFeatures/ReportsSales/Types/CustomerReportType";
import { PagedResult } from "../../../../admin/pages/AdminDashboardFeatures/ReportsSales/Types/CustomerReportType";
import { AdminCustomerReportItem } from "../../../../admin/pages/AdminDashboardFeatures/ReportsSales/Types/CustomerReportType";

export const UseCustomerReportHock = () => {
  const [data, setData] = useState<PagedResult<AdminCustomerReportItem> | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async (filters: CustomerReportFilters) => {
    setLoading(true);
    try {
      const response = await API.post<PagedResult<AdminCustomerReportItem>>(
        "/sales/SalesReport/reports-customers",
        filters
      );
      
      setData(response.data);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    fetchReport
  };
};
