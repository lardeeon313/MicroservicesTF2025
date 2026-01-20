import React, { useMemo, useState } from "react";
import { useDeliveryIncidentsReport } from "../../../../../verification/pages/reports/Verification/VerificationHocks/useDeliveryIncidentsReport";
import { DeliveryIncidentsFilter } from "../VerificationFilters/FilterDeliveryIncidents";
import { DeliveryIncidentFilters } from "../../../../../verification/types/FilterReports/FilterReportsEntity";
import { DeliveryIncidentsTable } from "../VerificationComponents/DeliveryIncidents/DeliveryIncidentsReport";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import BackButton from "../../../../../../components/BackButton";

export const ReportDeliveryIncidentsPage: React.FC = () => {
  const [tempFilters, setTempFilters] = useState<DeliveryIncidentFilters>({
    startDate: "",
    endDate: "",
    resolved: undefined,
  });

  const [appliedFilters, setAppliedFilters] = useState<DeliveryIncidentFilters>({
    startDate: "",
    endDate: "",
    resolved: undefined,
  });

  
  const [refreshKey, setRefreshKey] = useState(0);

  const {
    data,
    isLoading,
    error,
    pageNumber,
    totalPages,
    setPageNumber,
  } = useDeliveryIncidentsReport(appliedFilters, refreshKey);

  
  const filteredData = useMemo(() => {
    if (appliedFilters.resolved === undefined) return data;

    return data.filter((item) => {
      const isResolved =
        !!item.resolvedAt && item.resolutionNote?.trim() !== "";

      return appliedFilters.resolved ? isResolved : !isResolved;
    });
  }, [data, appliedFilters.resolved]);

  const handleSearch = () => {
    setAppliedFilters(tempFilters);
    setPageNumber(1);
  };

  const handleClear = () => {
    const empty = { startDate: "", endDate: "", resolved: undefined };
    setTempFilters(empty);
    setAppliedFilters(empty);
    setPageNumber(1);
  };

  if (isLoading) {
    return (
      <LoadingSpinner
        message="Cargando reporte de incidencias..."
        height="h-screen"
      />
    );
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/verification/reports" />
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Reporte de incidencias en entregas
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Aquí podrás visualizar las incidencias registradas durante las entregas.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <DeliveryIncidentsFilter
          filters={tempFilters}
          onChange={setTempFilters}
          onSearch={handleSearch}
          onClear={handleClear}
        />

        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="space-y-12 mt-8">
          <DeliveryIncidentsTable data={filteredData} />
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
              disabled={pageNumber === 1}
            >
              Anterior
            </button>

            <span>
              Página {pageNumber} de {totalPages}
            </span>

            <button
              onClick={() =>
                setPageNumber((p) => Math.min(p + 1, totalPages))
              }
              disabled={pageNumber === totalPages}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
