import { useState, useEffect } from "react";
import API from "../../../../../../api/axios";
import { OrderStatusHistoryFilter } from "../../../../types/FilterReports/FilterReportsEntity";
import { OrderStatusHistoryReport } from "../../../../types/Report";
import { OrderStatusLabelsReport } from "../../../../types/Report";
import { EnglishToSpanishStatusMap } from "../../../../types/Report";



export const useOrderStatusHistoryReport = () => {
  const [filters, setFilters] = useState<OrderStatusHistoryFilter>({});
  const [data, setData] = useState<OrderStatusHistoryReport[]>([]);
  const [loading, setLoading] = useState(false);

  const statusNumberToString = (statusNumber: number | undefined): string | undefined => {
    if (statusNumber === undefined) return undefined;
    return Object.entries(OrderStatusLabelsReport).find(
      ([key, _]) => Number(key) === statusNumber
    )?.[1];
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("📤 Filtros antes de enviar:", filters);
      const response = await API.get("/logistic/LogisticReport/order-status-history", {
        params: filters,
      });
      console.log("🔍 Respuesta completa del backend:", response.data);

      // Mapear los datos a español
      const mappedData = response.data.map((item: OrderStatusHistoryReport) => ({
        ...item,
        oldStatus: EnglishToSpanishStatusMap[item.oldStatus] || item.oldStatus,
        newStatus: EnglishToSpanishStatusMap[item.newStatus] || item.newStatus,
      }));

      const oldStatusString = statusNumberToString(filters.oldStatus);
      const newStatusString = statusNumberToString(filters.newStatus);

      const filteredData = mappedData.filter((item: OrderStatusHistoryReport) => {
        const oldStatusMatch = oldStatusString === undefined || item.oldStatus === oldStatusString;
        const newStatusMatch = newStatusString === undefined || item.newStatus === newStatusString;
        return oldStatusMatch && newStatusMatch;
      });

      console.log("✅ Datos filtrados en el frontend (primeros 3):", filteredData.slice(0, 3));
      console.log("✅ Total de registros filtrados en el frontend:", filteredData.length);
      setData(filteredData);
    } catch (error: any) {
      console.error("❌ Error al obtener el historial de estados:", error);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para llamar a fetchData cuando los filtros se limpian
  useEffect(() => {
    const areFiltersEmpty = Object.keys(filters).length === 0;
    if (areFiltersEmpty) {
      fetchData();
    }
  }, [filters]);

  return { data, loading, filters, setFilters, fetchData };
};
