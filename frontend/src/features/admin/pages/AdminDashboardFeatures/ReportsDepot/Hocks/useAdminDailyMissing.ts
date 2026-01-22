import { useEffect, useState } from "react";
import type { DailyMissing } from "../../../../../depot/pages/reports/Depot/DepotComponents/DailyMissingTable";
import API from "../../../../../../api/axios";

export const useDailyMissing = (page: number, pageSize: number) => {
  const [data, setData] = useState<DailyMissing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await API.get<any[]>(
          "/depot/depotmanager/get-all-missing-orders"
        );

        // EXPANDIR missingItems → una fila por item faltante
        const expanded: DailyMissing[] = response.data.flatMap((missing: any) => {
          return missing.missingItems.map((mi: any) => ({
            orderID: missing.salesOrderId,
            missingID: missing.missingId,
            customerName: missing.depotOrder.customerName ?? "",
            missingDate: missing.missingDate ?? "",

            productId: mi.id,
            productName: mi.productName,
            productBrand: mi.productBrand,
            packaging: mi.packaging,
            missingQuantity: mi.missingQuantity,
          }));
        });

        

        // PAGINACIÓN LOCAL
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginatedData = expanded.slice(start, end);

        setData(paginatedData);
        setTotalPages(Math.ceil(expanded.length / pageSize));

      } catch (error) {
        setError("No se pudieron obtener los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize]);

  return { data, loading, error, totalPages };
};
