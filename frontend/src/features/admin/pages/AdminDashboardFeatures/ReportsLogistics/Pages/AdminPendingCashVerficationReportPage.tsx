import React, { useEffect, useState } from "react";
import { usePendingCashVerificationReport } from "../../../../../verification/pages/reports/Verification/VerificationHocks/usePendingCashVerification";
import { FilterPendingCashVerification } from "../../../../../verification/pages/reports/Verification/VerificationFilters/FilterPendingCashVerification";
import { PendingCashVerificationTable } from "../../../../../verification/pages/reports/Verification/VerificationComponents/PendingCashVerificationFolder/PendingCashVerificationReport";
import { GraphPendingCashVerification } from "../../../../../verification/pages/reports/Verification/VerificationGraphs/GraphPendingCashVerification";
import { PendingCashVerificationFilter } from "../../../../../verification/types/FilterReports/FilterReportsEntity";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import BackButton from "../../../../../../components/BackButton";
import { Eye, EyeOff, RefreshCcw } from "lucide-react";

export const AdminReportPendingCashVerificationPage: React.FC = () => {
  const [filters, setFilters] = useState<PendingCashVerificationFilter>({
    startDate: "",
    endDate: "",
    operatorId: "",
    deliveryTeamId: undefined,
  });

  const [searchParams, setSearchParams] =
    useState<PendingCashVerificationFilter | null>(null);

  // 📄 PAGINADO
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);

  // 🔹 NUEVO: mostrar/ocultar gráfico
  const [showGraph, setShowGraph] = useState(true);

  const { data, isLoading, error } = usePendingCashVerificationReport(
    searchParams,
    pageNumber,
    pageSize
  );

  useEffect(() => {
    setSearchParams(filters);
  }, []);

  const handleClear = () => {
    const emptyFilters: PendingCashVerificationFilter = {
      startDate: "",
      endDate: "",
      operatorId: "",
      deliveryTeamId: undefined,
    };
    setFilters(emptyFilters);
    setSearchParams(emptyFilters);
    setPageNumber(1);
  };

  const handleSearch = () => {
    setSearchParams(filters);
    setPageNumber(1);
  };

  const handleSetFilters = (updated: Partial<PendingCashVerificationFilter>) => {
    setFilters((prev) => ({
      ...prev,
      ...updated,
      deliveryTeamId:
        typeof updated.deliveryTeamId === "string"
          ? updated.deliveryTeamId === ""
            ? undefined
            : Number(updated.deliveryTeamId)
          : updated.deliveryTeamId,
    }));
  };

  const handleNextPage = () => {
    if (data && pageNumber < data.totalPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const handlePrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  // 🔄 FUNCIÓN PARA REFRESCAR TODO EL REPORTE
  const handleRefresh = () => {
    setSearchParams({ ...filters });
  };

  if (isLoading) {
    return (
      <LoadingSpinner
        message="Cargando reporte de efectivo pendiente..."
        height="h-screen"
      />
    );
  }

  return (
    <div className="min-h-screen bg-white-50 py-10">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
        <BackButton to="/admin/reports/logistics" />
        
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Reporte de Efectivo Pendiente de Verificación
        </h1>
        <p className="text-center text-lg text-gray-700">
          Visualizá los pedidos que aún se encuentran pendientes de verificación.
        </p>

        {/* Filtros */}
        <div className="bg-white shadow-md rounded-2xl p-6 mb-10 border border-gray-200 mt-6">
          <FilterPendingCashVerification
            filters={filters}
            setFilters={handleSetFilters}
            onSearch={handleSearch}
            onClear={handleClear}
          />
        </div>

        {!isLoading && data && (
          <div className="space-y-8 mt-8">
            <PendingCashVerificationTable data={data.items} />

            {/* 🔹 BOTONES JUNTOS ABAJO DE LA TABLA */}
            {/* 🔹 BOTONES JUNTOS ABAJO DE LA TABLA */}
            <div className="flex justify-end items-center gap-3">
              <button
                onClick={() => setShowGraph((prev) => !prev)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2 whitespace-nowrap"
              >
                {showGraph ? (
                  <>
                    <EyeOff className="w-5 h-5" />
                    Ocultar Gráfico
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5" />
                    Mostrar Gráfico
                  </>
                )}
              </button>

              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition flex items-center gap-2 whitespace-nowrap"
                title="Refrescar reporte"
              >
                <RefreshCcw className="w-5 h-5" />
                Refrescar Reporte
              </button>
            </div>

            {/* 📊 GRÁFICO CONDICIONAL */}
            {showGraph && (
              <GraphPendingCashVerification data={data.items} />
            )}

            {/* 🔹 PAGINACIÓN */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={handlePrevPage}
                disabled={pageNumber === 1}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-300 transition disabled:opacity-50"
              >
                ◀ Anterior
              </button>

              <span className="text-gray-600 font-medium">
                Página {pageNumber} de {data.totalPages || 1}
              </span>

              <button
                onClick={handleNextPage}
                disabled={pageNumber >= (data.totalPages || 1)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition disabled:opacity-50"
              >
                Siguiente ▶
              </button>
            </div>
          </div>
        )}

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};