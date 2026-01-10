import { useMemo, useState } from "react";
import { SalesRangeReport, SalesPerfomanceReportType } from "../Types/SalesPerfomanceReportType";
import API from "../../../../../../api/axios";

export const AdminUsePerfomanceSalesReport = () => {
  const [data, setData] = useState<SalesPerfomanceReportType[]>([]);
  const [loading, setLoading] = useState(false);

  const [salesRange, setSalesRange] = useState<SalesRangeReport>(SalesRangeReport.All);
  const [dateFrom, setDateFrom] = useState<string | null>(null);
  const [dateTo, setDateTo] = useState<string | null>(null);

  const fetchReport = async () => {
    setLoading(true);

    try {
      const params: any = {};

      if (salesRange && salesRange !== SalesRangeReport.All) {
        params.range = salesRange;
      }

      if (dateFrom && dateTo) {
        params.from = dateFrom;
        params.to = dateTo;
      }

      const response = await API.get<SalesPerfomanceReportType[]>(
        "/sales/SalesReport/report-performance",
        { params }
      );

      setData(response.data);
    } catch (error) {
      console.error("Error al obtener reporte de desempeño", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSalesRange(SalesRangeReport.All);
    setDateFrom(null);
    setDateTo(null);
    setData([]);
  };

  const filteredData = useMemo(() => data, [data]);

  return {
    data,
    filteredData,
    loading,

    salesRange,
    setSalesRange,

    dateFrom,
    setDateFrom,

    dateTo,
    setDateTo,

    fetchReport,
    clearFilters,
  };
};
