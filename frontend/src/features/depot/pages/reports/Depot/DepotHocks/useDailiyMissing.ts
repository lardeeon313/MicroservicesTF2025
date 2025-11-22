import { useEffect, useState } from "react";
import type { DailyMissing } from "../DepotComponents/DailyMissingTable";
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
        

        const response = await API.get<DailyMissing[]>(
          "/depot/depotmanager/get-all-missing-orders"
        );

        

        const allData: DailyMissing[] = response.data.map((item: any) => ({
            orderID: item.salesOrderId,
            ItemID: item.missingId, // o si tenés missingItemId usá ese
            MissingDate: item.missingDate ?? "" // puede venir null, lo dejamos vacío
        }));
        const start = (page - 1) * pageSize;
        const end = start + pageSize;

        const paginatedData = allData.slice(start, end);



        setData(paginatedData);
        setTotalPages(Math.ceil(allData.length / pageSize));

       
      } catch (error) {

        setError("No se pudieron obtener los datos ");
      } finally {
        setLoading(false);

      }
    };

    fetchData();
  }, [page, pageSize]);

  return { data, loading, error, totalPages };
};
