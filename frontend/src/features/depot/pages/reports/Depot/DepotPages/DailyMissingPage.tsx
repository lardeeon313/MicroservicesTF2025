import React, { useState, useMemo } from "react";
import { useDailyMissing } from "../DepotHocks/useDailiyMissing";
import DailyMissingTable, { DailyMissing } from "../DepotComponents/DailyMissingTable";

import { Pagination } from "../../../../../../components/Pagination";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import DailyMissingFilter from "../DepotFilters/DailyMissingFilter";
import BackButton from "../../../../../../components/BackButton";

const DailyMissingPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [selectedTime, setSelectedTime] = useState<string>(""); // formato "HH:mm"
  const pageSize = 10;

  const { data, loading, error, totalPages } = useDailyMissing(page, pageSize);

  // ✅ Filtrado por hora usando useMemo (evita recomputar en cada render)
  const filteredData: DailyMissing[] = useMemo(() => {
    if (!data) return [];

    if (!selectedTime) return data;

    const [hour, minute] = selectedTime.split(":").map((v) => parseInt(v, 10));

    return data.filter((d) => {
      if (!d.MissingDate) return false;
      const date = new Date(d.MissingDate);
      return (
        date.getHours() === hour &&
        (isNaN(minute) || date.getMinutes() === minute)
      );  
    });
  }, [data, selectedTime]);

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

        <DailyMissingFilter
          selectedTime={selectedTime}
          onHourChange={(val) => setSelectedTime(val)}
          onSearch={() => {
            console.log("Buscando por hora/minuto:", selectedTime);
          }}
          onClear={() => {
            setSelectedTime("");
            console.log("Filtro de hora limpiado");
          }}
        />

        {error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : (
          <>
            <DailyMissingTable data={filteredData} />
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
