import React, { useEffect, useState } from "react";
import { usePendingCashVerificationReport } from "../VerificationHocks/usePendingCashVerification";
import { FilterPendingCashVerification } from "../VerificationFilters/FilterPendingCashVerification";
import { PendingCashVerificationTable } from "../VerificationComponents/PendingCashVerificationFolder/PendingCashVerificationReport";
import { GraphPendingCashVerification } from "../VerificationGraphs/GraphPendingCashVerification";
import { PendingCashVerificationFilter } from "../../../../types/FilterReports/FilterReportsEntity";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import { Pagination } from "../../../../../../components/Pagination";
import BackButton from "../../../../../../components/BackButton";

export const PendingCashVerificationPage: React.FC = () => {
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
  const [showGraph, setShowGraph] = useState(false);

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

  if (isLoading) {
    return (
      <LoadingSpinner
        message="Cargando reporte de efectivo pendiente..."
        height="h-screen"
      />
    );
  }

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
        <BackButton to="/verification/reports" />
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Reporte de Efectivo Pendiente de Verificación
        </h1>
        <p className="text-center text-lg text-gray-700">
          Visualizá los pedidos que aún se encuentran pendientes de verificación.
        </p>

        {/* Filtros */}
        <div className="bg-white shadow-md rounded-2xl p-6 mb-10 border border-gray-200">
          <FilterPendingCashVerification
            filters={filters}
            setFilters={handleSetFilters}
            onSearch={handleSearch}
            onClear={handleClear}
          />
        </div>

        {!isLoading && data && (
          <div className="space-y-12 mt-8">
            <PendingCashVerificationTable data={data.items} />

            {/* 🔘 BOTÓN MOSTRAR/OCULTAR GRÁFICO */}
            <div className="flex justify-center mt-6 mb-4">
              <button
                onClick={() => setShowGraph((prev) => !prev)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              >
                {showGraph ? "Ocultar gráfico" : "Mostrar gráfico"}
              </button>
            </div>

            {/* 📊 GRÁFICO CONDICIONAL */}
            {showGraph && (
              <GraphPendingCashVerification data={data.items} />
            )}

            {/* 🔹 PAGINACIÓN */}
            <div className="mt-6">
              <Pagination
                currentPage={pageNumber}
                totalPages={data.totalPages || 1}
                onPageChange={setPageNumber}
              />
            </div>
          </div>
        )}

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};
