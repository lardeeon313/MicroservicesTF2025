import React, { useEffect } from "react";
import { useZonePerformanceReport } from "../VerificationHocks/useZonePerfomance";
import { FilterZonePerformance } from "../VerificationFilters/FilterZonePerfomance";
import { ZonePerformanceTable } from "../VerificationComponents/ZonePerfomanceFolder/ZonePerfomance";

import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import BackButton from "../../../../../../components/BackButton";

export const ZonePerformanceReportPage: React.FC = () => {
  const { data, loading, error, fetchReport } = useZonePerformanceReport();

  useEffect(() => {
    fetchReport(); // carga inicial
  }, []);

  // 👉 función que aplica los filtros cuando se presiona "Buscar"
  const handleFilter = (
    startDate?: string,
    endDate?: string,
    operatorId?: string,
    deliveryTeamId?: number
  ) => {
    fetchReport(startDate, endDate, operatorId, deliveryTeamId);
  };

  // 👉 función que limpia los filtros cuando se presiona "Limpiar"
  const handleClear = () => {
    fetchReport(); // vuelve a cargar todo sin filtros
  };

  if (loading) {
    return (
      <LoadingSpinner
        message="Cargando reporte de actividad..."
        height="h-screen"
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/verification/reports" />
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
         Cantidad de pedidos por zona.
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
         Compara la cantidad de pedidos realizados por zona.
        </p>
      </div>

      {/* 🔹 Pasamos ambas funciones al filtro */}
      <FilterZonePerformance onFilter={handleFilter} onClear={handleClear} />

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {/* 🔹 Estructura simplificada */}
      {!loading && (
        <div className="space-y-12 mt-8">
          <ZonePerformanceTable data={data} />

        </div>
      )}
    </div>
  );
};
