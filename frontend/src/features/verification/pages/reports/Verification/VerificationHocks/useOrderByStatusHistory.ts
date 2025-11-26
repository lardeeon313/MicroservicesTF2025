import { useState, useEffect } from "react";
import API from "../../../../../../api/axios";
import { OrderStatusHistoryFilter } from "../../../../types/FilterReports/FilterReportsEntity";
import { OrderStatusHistoryReport } from "../../../../types/Report";
import { EnglishToSpanishStatusMap } from "../../../../types/Report";
import { PagedResponse } from "../../../../types/Report";

//OrderStatusLabelsReport
//OrderStatusBackendLogisticMap
import { OrderStatusBackendLogisticMap } from "../../../../types/Report";

export const useOrderStatusHistoryReport = () => {
  const [filters, setFilters] = useState<OrderStatusHistoryFilter>({});
  const [data, setData] = useState<OrderStatusHistoryReport[]>([]);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);

  // ✅ Traductor de número a string de estado
  /*const statusNumberToString = (statusNumber: number | undefined): string | undefined => {
    if (statusNumber === undefined) return undefined;
    return Object.entries(OrderStatusLabelsReport).find(
      ([key]) => Number(key) === statusNumber
    )?.[1];
  };*/

  const fetchData = async (pageNumber?: number) => {
    try {
      setLoading(true);

      // 🔹 Convertimos los status numéricos a string antes de enviar al backend
      const oldStatusString = filters.oldStatus !== undefined ? OrderStatusBackendLogisticMap[filters.oldStatus] : undefined;
      const newStatusString = filters.newStatus !== undefined ? OrderStatusBackendLogisticMap[filters.newStatus] : undefined;

      const params = {
        ...filters,
        oldStatus: oldStatusString,
        newStatus: newStatusString,
        pageNumber: pageNumber ?? pagination.pageNumber,
        pageSize: pagination.pageSize,
      };

      const response = await API.get<PagedResponse<OrderStatusHistoryReport>>(
        "/logistic/LogisticReport/order-status-history",
        { params }
      );


      // 🔹 Mapeamos los estados a español para mostrar en la tabla
      const mappedData = response.data.items.map((item) => ({
        ...item,
        oldStatus: EnglishToSpanishStatusMap[item.oldStatus] || item.oldStatus,
        newStatus: EnglishToSpanishStatusMap[item.newStatus] || item.newStatus,
      }));

      setData(mappedData);
      setPagination({
        totalCount: response.data.totalCount,
        pageNumber: response.data.pageNumber,
        pageSize: response.data.pageSize,
        totalPages: response.data.totalPages,
      });



    } catch (error: any) {
      console.error("❌ Error al obtener el historial de estados:", error);
    } finally {
      setLoading(false);
    }
  };

  // Efecto inicial o cuando los filtros cambian
  useEffect(() => {
    const areFiltersEmpty = Object.keys(filters).length === 0;
    if (areFiltersEmpty) {
      fetchData(1);
    }
  }, [filters]);

  return { data, loading, filters, setFilters, fetchData, pagination, setPagination };
};
