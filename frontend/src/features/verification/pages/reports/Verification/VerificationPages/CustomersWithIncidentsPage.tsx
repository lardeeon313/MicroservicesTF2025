import React, { useState, useMemo } from "react";
import { CustomersWithIncidentsFilter } from "../VerificationFilters/FilterCustomerWithIncidents";
import { useCustomersWithIncidents } from "../VerificationHocks/useCustomersWithIncidentsReports";
import { CustomersWithIncidentsComponent } from "../VerificationComponents/CustomersWithIncidents/CustomersWithIndidents";
import { GraphCustomersWithIncidents } from "../VerificationGraphs/GraphCustomersWithIncident";
import { OneCustomerIncidentsDetailTable } from "../VerificationComponents/CustomersWithIncidents/OneCustomerWithIncident";
import { FilterCustomerWithIncident } from "../../../../types/FilterReports/FilterReportsEntity";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import BackButton from "../../../../../../components/BackButton";

export const CustomersWithIncidentsPage: React.FC = () => {
  const [filters, setFilters] = useState<FilterCustomerWithIncident>({});
  const {
    data,
    isLoading,
    error,
    pageNumber,
    totalPages,
    setPageNumber,
  } = useCustomersWithIncidents(filters);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const handleFilterChange = (newFilters: FilterCustomerWithIncident) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
    // Reinicia la paginación al aplicar nuevos filtros
    setPageNumber(1);
  };

  const selectedCustomer = useMemo(
    () => data.find((c) => c.customerId === selectedCustomerId) || null,
    [data, selectedCustomerId]
  );

  if (isLoading) {
    return <LoadingSpinner message="Cargando reporte de actividad..." height="h-screen" />;
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/verification/reports" />
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Reporte de Clientes con mayor incidencia
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Visualiza cuáles fueron los clientes que tuvieron mayores incidentes.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Filtros */}
        <div className="mb-6">
          <CustomersWithIncidentsFilter
            onFilterChange={handleFilterChange}
            isLoading={isLoading}
          />
        </div>

        {/* Tabla principal */}
        <CustomersWithIncidentsComponent
          data={data}
          isLoading={isLoading}
          error={error || undefined}
          onSelectCustomer={setSelectedCustomerId}
        />

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
              onClick={() => setPageNumber((prev) => Math.min(prev + 1, totalPages))}
              disabled={pageNumber === totalPages}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}

        {/* Detalle por cliente */}
        {selectedCustomer && (
          <OneCustomerIncidentsDetailTable
            customer={selectedCustomer}
            onClose={() => setSelectedCustomerId(null)}
          />
        )}

        {/* Gráfico */}
        <GraphCustomersWithIncidents data={data} />
      </div>
    </div>
  );
};
