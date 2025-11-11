import React, { useState } from "react";
import { useDeliveryIncidentsReport } from "../VerificationHocks/useDeliveryIncidentsReport";
import { DeliveryIncidentsFilter } from "../VerificationFilters/FilterDeliveryIncidents";
import { DeliveryIncidentsTable } from "../VerificationComponents/DeliveryIncidents/DeliveryIncidentsReport";
import { GraphDeliveryIncidents } from "../VerificationGraphs/GraphDeliveryIncidentsReport";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import BackButton from "../../../../../../components/BackButton";
import { DeliveryIncidentsTeamTable } from "../VerificationComponents/DeliveryIncidents/DeliveryIncidentesTeamReport";

export const DeliveryIncidentsPage: React.FC = () => {
  const [tempFilters, setTempFilters] = useState({});
  const [appliedFilters, setAppliedFilters] = useState({});

  const {
    data,
    isLoading,
    error,
    pageNumber,
    totalPages,
    setPageNumber,
  } = useDeliveryIncidentsReport(appliedFilters);

  const handleSearch = () => {
    setAppliedFilters(tempFilters);
    setPageNumber(1); // Reinicia la paginación al aplicar filtros
  };

  const handleClear = () => {
    setTempFilters({});
    setAppliedFilters({});
    setPageNumber(1);
  };

  if (isLoading) {
    return <LoadingSpinner message="Cargando reporte de incidencias..." height="h-screen" />;
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/verification/reports" />
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Reporte de incidencias en entregas
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Aquí podrás visualizar las incidencias registradas durante las entregas, aplicar filtros
          personalizados y generar gráficos para su análisis.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <DeliveryIncidentsFilter
          filters={tempFilters}
          onChange={setTempFilters}
          onSearch={handleSearch}
          onClear={handleClear}
        />

        {error && <p className="text-center text-red-500 mb-6">{error}</p>}

        {!isLoading && (
          <>
            <div className="space-y-12 mt-8">
              <DeliveryIncidentsTable data={data} />
              <DeliveryIncidentsTeamTable data={data} />
              <GraphDeliveryIncidents data={data} />
            </div>

            {/* 📄 Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                  disabled={pageNumber === 1}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                  Anterior
                </button>

                <span className="text-gray-700">
                  Página {pageNumber} de {totalPages}
                </span>

                <button
                  onClick={() => setPageNumber((prev) => Math.min(prev + 1, totalPages))}
                  disabled={pageNumber === totalPages}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
