import React, { useState } from "react";
import { useDeliveryIncidentsReport } from "../VerificationHocks/useDeliveryIncidentsReport";
import { DeliveryIncidentsFilter } from "../VerificationFilters/FilterDeliveryIncidents";
import { DeliveryIncidentsTable } from "../VerificationComponents/DeliveryIncidents/DeliveryIncidentsReport";
import { GraphDeliveryIncidents } from "../VerificationGraphs/GraphDeliveryIncidentsReport";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import BackButton from "../../../../../../components/BackButton";
import { DeliveryIncidentsTeamTable } from "../VerificationComponents/DeliveryIncidents/DeliveryIncidentesTeamReport";

export const DeliveryIncidentsPage: React.FC = () => {
  // Estados para filtros
  const [tempFilters, setTempFilters] = useState({});
  const [appliedFilters, setAppliedFilters] = useState({});

  // Hook personalizado (solo recibe filtros, sin paginación)
  const { data = [], isLoading, error } = useDeliveryIncidentsReport(appliedFilters);

  // Aplicar filtros
  const handleSearch = () => {
    setAppliedFilters(tempFilters);
  };

  // Limpiar filtros
  const handleClear = () => {
    setTempFilters({});
    setAppliedFilters({});
  };

  if (isLoading) {
    return <LoadingSpinner message="Cargando reporte de incidencias..." height="h-screen" />;
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      {/* Encabezado */}
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

      {/* Contenido principal */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <DeliveryIncidentsFilter
          filters={tempFilters}
          onChange={setTempFilters}
          onSearch={handleSearch}
          onClear={handleClear}
        />

        {error && <p className="text-center text-red-500 mb-6">{error}</p>}

        {!isLoading && (
          <div className="space-y-12 mt-8">
            <DeliveryIncidentsTable data={data} />
            <DeliveryIncidentsTeamTable data={data} />
            <GraphDeliveryIncidents data={data} />
          </div>
        )}

      </div>
    </div>
  );
};
