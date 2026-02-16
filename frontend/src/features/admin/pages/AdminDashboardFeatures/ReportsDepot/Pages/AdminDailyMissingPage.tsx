import React, { useState, useMemo } from "react";
import { RefreshCw, Eye, EyeOff } from "lucide-react";
import { useDailyMissing } from "../Hocks/useAdminDailyMissing";
import type { DailyMissing } from "../../../../../depot/pages/reports/Depot/DepotComponents/DailyMissingTable";
import AdminDailyMissingUnifiedFilter from "../Filters/AdminDailyMissingUnifiedFilter";
import AdminDailyMissingTable from "../Components/AdminDailyMissingTable";
import GraphDailyMissingOrder from "../Graphs/GraphDailyMissingOrder";
import { Pagination } from "../../../../../../components/Pagination";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import BackButton from "../../../../../../components/BackButton";

const AdminReportDailyMissingPage: React.FC = () => {
  const [page, setPage] = useState(1);

  // ============================
  // ESTADOS DEL FORMULARIO (DRAFT)
  // ============================
  const [draftSelectedTime, setDraftSelectedTime] = useState<string>("");
  const [draftFilterType, setDraftFilterType] = useState<
    "" | "day" | "month" | "quincena"
  >("");

  // ============================
  // ESTADOS APLICADOS (FILTRAN)
  // ============================
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [filterType, setFilterType] = useState<
    "" | "day" | "month" | "quincena"
  >("");

  const [showGraph, setShowGraph] = useState(true);

  const pageSize = 10;
  const { data, loading, error, totalPages } = useDailyMissing(page, pageSize);

  // =====================================================
  // HANDLERS DEL FORM (NO FILTRAN TODAVÍA)
  // =====================================================
  const handleDateChange = (val: string) => {
    setDraftSelectedTime(val);
    setDraftFilterType(""); // excluyente
  };

  const handleFilterTypeChange = (
    val: "" | "day" | "month" | "quincena"
  ) => {
    setDraftFilterType(val);
    setDraftSelectedTime(""); // excluyente
  };

  // =====================================================
  // ACCIONES
  // =====================================================
  const handleSearch = () => {
    setSelectedTime(draftSelectedTime);
    setFilterType(draftFilterType);
    setPage(1);
  };

  const handleClearFilters = () => {
    // limpia inputs
    setDraftSelectedTime("");
    setDraftFilterType("");

    // limpia filtros aplicados
    setSelectedTime("");
    setFilterType("");

    setPage(1);
  };

  const handleRefresh = () => {
    window.location.reload();
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

  // ============================ FILTRO RÁPIDO ============================
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

        case "quincena": {
          const diffDays = Math.floor(
            (today.getTime() - itemDate.getTime()) /
              (1000 * 60 * 60 * 24)
          );
          return diffDays <= 15;
        }

        default:
          return true;
      }
    });
  }, [filteredByTime, filterType]);

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
          Faltantes diarios
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Aquí podrás visualizar los productos que no se encontraron en
          stock al momento del armado de pedidos.
        </p>

        {/* ============================ FILTRO UNIFICADO ============================ */}
        <AdminDailyMissingUnifiedFilter
          selectedTime={draftSelectedTime}
          filterType={draftFilterType}
          onDateChange={handleDateChange}
          onFilterTypeChange={handleFilterTypeChange}
          onSearch={handleSearch}
          onClear={handleClearFilters}
        />

        {/* ============================ BOTONES ============================ */}
        <div className="flex justify-end gap-3 mb-6">
          <button
            onClick={() => setShowGraph(!showGraph)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
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
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-sm"
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
