import { useState } from "react";
import API from "../../../../../../api/axios";
import { DeliveryTimesFilters } from "../../../../../verification/types/FilterReports/FilterReportsEntity";
import { GeneralGridRow } from "../../../../../verification/types/Report";
import { DeliveryTimeReportDto } from "../../../../../verification/types/Report";

export const AdminUseDeliveryTimesReport = () => {
  const [filters, setFilters] = useState<DeliveryTimesFilters>({});
  const [loading, setLoading] = useState(false);
  const [generalGrid, setGeneralGrid] = useState<GeneralGridRow[]>([]);
  const [onTimeList, setOnTimeList] = useState<DeliveryTimeReportDto[]>([]);
  const [lateList, setLateList] = useState<DeliveryTimeReportDto[]>([]);

  const transformToGeneralGrid = (data: DeliveryTimeReportDto[]): GeneralGridRow[] => {
    const general = data.reduce((acc, item) => {
      const key = `${item.teamId}-${item.deliveryZoneId}`;
      if (!acc[key]) {
        acc[key] = {
          teamName: item.teamName,
          zoneName: item.deliveryZoneName,
          total: 0,
          onTime: 0,
          late: 0,
        };
      }
      acc[key].total += 1;
      if (item.deliveredOnTime) acc[key].onTime += 1;
      else acc[key].late += 1;
      return acc;
    }, {} as Record<string, GeneralGridRow>);

    return Object.values(general);
  };

  const fetchReport = async () => {
    try {
      setLoading(true);

      const params = {
        startDate: filters.startDate,
        endDate: filters.endDate,
        deliveryZoneId: filters.deliveryZoneId,
        deliveryTeamId: filters.deliveryTeamId,
      };

      console.log("📡 Enviando parámetros al backend:", params);

      const res = await API.get("/logistic/LogisticReport/delivery-times", { params });
      const data: DeliveryTimeReportDto[] = res.data;

      console.log("📊 Datos crudos recibidos del backend:", data);

      const onTimeData = data.filter((o) => o.deliveredOnTime);
      const lateData = data.filter((o) => !o.deliveredOnTime);

      console.group("✅ Pedidos a tiempo");
      console.log(onTimeData);
      console.groupEnd();

      console.group("❌ Pedidos fuera de tiempo");
      console.log(lateData);
      console.groupEnd();

      setGeneralGrid(transformToGeneralGrid(data));
      setOnTimeList(onTimeData);
      setLateList(lateData);
    } catch (error) {
      console.error("⚠️ Error al obtener el reporte:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({});
    setGeneralGrid([]);
    setOnTimeList([]);
    setLateList([]);
    console.log("🔄 Filtros reseteados, listas vaciadas");
  };

  return {
    filters,
    setFilters,
    loading,
    generalGrid,
    onTimeList,
    lateList,
    fetchReport,
    resetFilters,
  };
};
