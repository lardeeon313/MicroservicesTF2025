import { useState, useEffect } from "react";
//import { getCompletedOrdersReports } from "./GetOrdersCompletedReport";
import { getCompletedOrdersReports } from "../../../../../depot/pages/reports/Depot/DepotHocks/GetOrdersCompletedReport";

export interface OrdersCompletedFilter {
  from?: string | null;
  to?: string | null;
}

export interface CompletedOrderItem {
  operatorFullName: string | null;
}

export interface OperatorCompletedCount {
  operatorName: string;
  count: number;
}

export const useCompletedOrdersReport = (filters: OrdersCompletedFilter) => {
  const [data, setData] = useState<OperatorCompletedCount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);


        const response = await getCompletedOrdersReports(filters.from, filters.to);


        const items: CompletedOrderItem[] = response.items ?? [];



        // --- Agrupado ---
        const grouped = items.reduce<Record<string, number>>((acc, item) => {
          const name = item.operatorFullName ?? "Sin Operador";

          acc[name] = (acc[name] || 0) + 1;
          return acc;
        }, {});



        const result: OperatorCompletedCount[] = Object.entries(grouped).map(
          ([operatorName, count]) => ({
            operatorName,
            count,
          })
        );

        

        setData(result);
      } catch (err) {
        console.log("❌ ERROR FETCH:", err);
        setError("Error obteniendo reporte");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  return { data, loading, error };
};
