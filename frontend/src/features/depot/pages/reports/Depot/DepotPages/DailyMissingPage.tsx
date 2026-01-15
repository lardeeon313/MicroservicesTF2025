import React, { useState, useMemo } from "react";
import { useDailyMissing } from "../DepotHocks/useDailiyMissing";
import type { DailyMissing } from "../../../../../depot/pages/reports/Depot/DepotComponents/DailyMissingTable";
import DailyMissingUnifiedFilter from "../DepotFilters/NewDailyMissingFilter";
import DailyMissingTable from "../../../../../depot/pages/reports/Depot/DepotComponents/DailyMissingTable";
import { Pagination } from "../../../../../../components/Pagination";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import BackButton from "../../../../../../components/BackButton";

const ReportDailyMissingPage: React.FC = () => {
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
        <BackButton to="/depot/reports" />
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
        <DailyMissingUnifiedFilter
          selectedTime={draftSelectedTime}
          filterType={draftFilterType}
          onDateChange={handleDateChange}
          onFilterTypeChange={handleFilterTypeChange}
          onSearch={handleSearch}
          onClear={handleClearFilters}
        />

        {error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : (
          <>
            <DailyMissingTable data={fullyFiltered} />

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

export default ReportDailyMissingPage;
