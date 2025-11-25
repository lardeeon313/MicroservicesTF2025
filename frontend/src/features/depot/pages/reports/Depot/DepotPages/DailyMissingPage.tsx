import React, { useState, useMemo } from "react";
import { useDailyMissing } from "../DepotHocks/useDailiyMissing";
import DailyMissingTable, { DailyMissing } from "../DepotComponents/DailyMissingTable";

import { Pagination } from "../../../../../../components/Pagination";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import DailyMissingFilter from "../DepotFilters/DailyMissingFilter"; // EXISTENTE
import DailyMissingSelectFilter from "../DepotFilters/NewDailyMissingFilter";
import BackButton from "../../../../../../components/BackButton";

const DailyMissingPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [filterType, setFilterType] = useState<"" | "day" | "month" | "quincena">("");

  const pageSize = 10;
  const { data, loading, error, totalPages } = useDailyMissing(page, pageSize);

  // ============================ FILTRO POR FECHA/HORA (EXISTENTE) ============================
  const filteredByTime: DailyMissing[] = useMemo(() => {
    if (!data) return [];
    if (!selectedTime) return data;

    const selectedDate = new Date(selectedTime);

    return data.filter((d) => {
      if (!d.missingDate) return false;

      const itemDate = new Date(d.missingDate);

      return (
        itemDate.getFullYear() === selectedDate.getFullYear() &&
        itemDate.getMonth() === selectedDate.getMonth() &&
        itemDate.getDate() === selectedDate.getDate()
      );
    });
  }, [data, selectedTime]);


  // ============================ NUEVO FILTRO: DÍA / MES / QUINCENA ============================
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
          const diffDays = Math.floor((today.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24));
          return diffDays <= 15;

        default:
          return true;
      }
    });
  }, [filteredByTime, filterType]);

  if (loading) {
    return <LoadingSpinner message="Cargando los datos..." height="h-screen" />;
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">

      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/depot/reports"></BackButton>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Faltantes diarios:
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Aquí podrás visualizar los productos que no se encontraron en stock
          al momento del armado de pedidos.
        </p>

        {/* Contenedor FLEX que coloca ambos filtros uno al lado del otro */}
        <div className="flex flex-wrap gap-6 mb-8">
          <DailyMissingFilter
            selectedTime={selectedTime}
            onHourChange={(val) => setSelectedTime(val)}
            onSearch={() => console.log("Buscando por fecha/hora:", selectedTime)}
            onClear={() => {
              setSelectedTime("");
              
            }}
          />

          <DailyMissingSelectFilter
            filterType={filterType}
            onFilterTypeChange={(val) => setFilterType(val)}
            onSearch={() => console.log("Buscando filtro rápido:", filterType)}
            onClear={() => {
              setFilterType("");
              
            }}
          />
        </div>


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

export default DailyMissingPage;
