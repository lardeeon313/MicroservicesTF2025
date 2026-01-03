import React, { useState } from "react";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { useDeliveryIncidentsReport } from "../../../../../verification/pages/reports/Verification/VerificationHocks/useDeliveryIncidentsReport";
import { DeliveryIncidentsFilter } from "../Filters/DeliveryIncidentsFilter";
import { DeliveryIncidentFilters } from "../../../../../verification/types/FilterReports/FilterReportsEntity";
import { DeliveryIncidentsTable } from "../Components/DeliveryIncidents/DeliveryIncidentsReport";
import { AdminGraphDeliveryIncidents } from "../Graphs/AdminGraphDeliveryIncidents";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import BackButton from "../../../../../../components/BackButton";

export const AdminReportDeliveryIncidentsPage: React.FC = () => {
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

  const [showGraphs, setShowGraphs] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

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
    setPageNumber(1);
  };

  const handleClear = () => {
    const empty = { startDate: "", endDate: "", resolved: undefined };
    setTempFilters(empty);
    setAppliedFilters(empty);
    setPageNumber(1);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    handleSearch();
  };

  if (isLoading) {
    return <LoadingSpinner message="Cargando reporte de incidencias..." height="h-screen" />;
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/admin/reports/logistics" />
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

        {/* Botones de control */}
        <div className="flex justify-end items-center gap-3 mt-6">
          <button
            onClick={() => setShowGraphs(!showGraphs)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {showGraphs ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
            {showGraphs ? "Ocultar Gráfico" : "Mostrar Gráfico"}
          </button>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            disabled={isLoading}
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
            Refrescar Reporte
          </button>
        </div>

        {error && <p className="text-center text-red-500 mb-6">{error}</p>}

        {!isLoading && (
          <>
            <div className="space-y-12 mt-8">

              {/* Tabla */}
              <DeliveryIncidentsTable data={data} />
              {/* Gráficos (condicional) */}
              {showGraphs && (
                <div key={refreshKey}>
                  <AdminGraphDeliveryIncidents data={data} />
                </div>
              )}
            </div>

            {/* Paginación */}
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
                  onClick={() =>
                    setPageNumber((prev) => Math.min(prev + 1, totalPages))
                  }
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