//Pedidos rechazados: 
import React, { useState } from "react";
import { useDeliveryRejections } from "../VerificationHocks/useDeliveryRejectionsReport";
import DeliveryRejectionsFilter from "../VerificationFilters/FilterDeliveryRejections";
import DeliveryRejectionsTable from "../VerificationComponents/DeliveryRejections/DeliveryRejectionsReport";

import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import BackButton from "../../../../../../components/BackButton";
import { RejectionReportFilters } from "../../../../types/FilterReports/FilterReportsEntity";


export const DeliveryRejectionsPage: React.FC = () => {
  const [appliedFilters, setAppliedFilters] = useState<RejectionReportFilters>({});
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);

  const { data, pagination, loading, error, fetchData } = useDeliveryRejections({
    ...appliedFilters,
    pageNumber,
    pageSize,
  });

  const handleFilterChange = (filters: RejectionReportFilters) => {
    console.log("📤 Aplicando filtros desde página:", filters);
    setAppliedFilters(filters);
    setPageNumber(1); // Reiniciar al cambiar filtros
  };

  const handleClear = () => {
    setAppliedFilters({});
    setPageNumber(1);
  };

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
    fetchData({ ...appliedFilters, pageNumber: newPage, pageSize });
  };

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/verification/reports" />
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Asignaciones canceladas
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Visualiza todas las asignaciones canceladas por los repartidores, filtra y analiza los resultados.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <DeliveryRejectionsFilter onFilterChange={handleFilterChange} onClear={handleClear} />

        {error && <p className="text-center text-red-500 mt-6">{error}</p>}

        {loading ? (
          <LoadingSpinner message="Cargando reporte de rechazos..." height="h-screen" />
        ) : (
          <div className="space-y-12 mt-8">
            <DeliveryRejectionsTable data={data} />
            <div className="flex justify-center items-center mt-4 gap-4">
              <button
                disabled={pagination.pageNumber <= 1}
                onClick={() => handlePageChange(pagination.pageNumber - 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                ◀ Anterior
              </button>

              <span>
                Página {pagination.pageNumber} de {pagination.totalPages || 1}
              </span>

              <button
                disabled={pagination.pageNumber >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.pageNumber + 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Siguiente ▶
              </button>
            </div>


           
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryRejectionsPage;
