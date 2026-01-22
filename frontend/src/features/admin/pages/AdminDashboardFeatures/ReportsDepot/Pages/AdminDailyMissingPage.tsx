import React, { useState, useMemo } from "react";
import { useDailyMissing } from "../Hocks/useAdminDailyMissing";
import { RefreshCw, Eye, EyeOff } from "lucide-react";

import { DailyMissing } from "../../../../../depot/pages/reports/Depot/DepotComponents/DailyMissingTable";
import AdminDailyMissingTable from "../Components/AdminDailyMissingTable";

import { Pagination } from "../../../../../../components/Pagination";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import DailyMissingFilter from "../Filters/DailyMissingFilter";
import DailyMissingSelectFilter from "../Filters/NewDailyMissingFilter";
import BackButton from "../../../../../../components/BackButton";
import GraphDailyMissingOrder from "../Graphs/GraphDailyMissingOrder";

const AdminReportDailyMissingPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [filterType, setFilterType] = useState<
    "" | "day" | "month" | "quincena"
  >("");
  const [showGraph, setShowGraph] = useState(true);
  const [, setRefreshKey] = useState(0);

  const pageSize = 10;
  const { data, loading, error, totalPages } = useDailyMissing(page, pageSize);

  // =====================================================
  // HANDLERS UNIFICADOS (LIMPIAN EL OTRO FILTRO)
  // =====================================================
  const handleDateChange = (val: string) => {
    setSelectedTime(val);
    setFilterType(""); // limpia filtro rápido
  };

  const handleFilterTypeChange = (
    val: "" | "day" | "month" | "quincena"
  ) => {
    setFilterType(val);
    setSelectedTime(""); // limpia fecha
  };

  // ============================ FILTRO POR FECHA ============================
  const filteredByTime: DailyMissing[] = useMemo(() => {
    if (!data) return [];
    if (!selectedTime) return data;

    const selected = new Date(selectedTime + "T00:00:00");

    return data.filter((d) => {
      if (!d.missingDate) return false;

      const itemDate = new Date(d.missingDate);

      return (
        itemDate.getFullYear() === selected.getFullYear() &&
        itemDate.getMonth() === selected.getMonth() &&
        itemDate.getDate() === selected.getDate()
      );
    });
  }, [data, selectedTime]);

  // ============================ FILTRO DÍA / MES / QUINCENA ============================
  const fullyFiltered: DailyMissing[] = useMemo(() => {
    if (!filteredByTime) return [];
    if (!filterType) return filteredByTime;

    const today = new Date();

    return filteredByTime.filter((d) => {
      if (!d.missingDate) return false;
      const itemDate = new Date(d.missingDate);

      switch (filterType) {
        case "day":
          return itemDate.toDateString() === today.toDateString();

        case "month":
          return (
            itemDate.getMonth() === today.getMonth() &&
            itemDate.getFullYear() === today.getFullYear()
          );

        case "quincena":
          const diffDays = Math.floor(
            (today.getTime() - itemDate.getTime()) /
              (1000 * 60 * 60 * 24)
          );
          return diffDays <= 15;

        default:
          return true;
      }
    });
  }, [filteredByTime, filterType]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    window.location.reload();
  };

  if (loading) {
    return (
      <LoadingSpinner
        message="Cargando los datos..."
        height="h-screen"
      />
    );
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/admin/reports/depot" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Faltantes diarios:
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Aquí podrás visualizar los productos que no se encontraron en
          stock al momento del armado de pedidos.
        </p>

        {/* ============================ FILTROS ============================ */}
        <div className="flex flex-wrap gap-6 mb-8 bg-white border border-gray-300 p-4 rounded-xl">
          <DailyMissingFilter
            selectedTime={selectedTime}
            onHourChange={handleDateChange}
            onSearch={() =>
              console.log("Buscando por fecha:", selectedTime)
            }
            onClear={() => setSelectedTime("")}
          />

          <DailyMissingSelectFilter
            filterType={filterType}
            onFilterTypeChange={handleFilterTypeChange}
            onSearch={() =>
              console.log("Buscando filtro rápido:", filterType)
            }
            onClear={() => setFilterType("")}
          />
        </div>

        {/* ============================ BOTONES ============================ */}
        <div className="flex justify-end gap-3 mb-6">
          <button
            onClick={() => setShowGraph(!showGraph)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
          >
            {showGraph ? (
              <>
                <EyeOff className="w-4 h-4" />
                Ocultar Gráfico
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Mostrar Gráfico
              </>
            )}
          </button>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Refrescar Reporte
          </button>
        </div>

        {error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : (
          <>
            <AdminDailyMissingTable data={fullyFiltered} />

            {showGraph && (
              <div className="mt-8">
                <GraphDailyMissingOrder data={fullyFiltered} />
              </div>
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminReportDailyMissingPage;
