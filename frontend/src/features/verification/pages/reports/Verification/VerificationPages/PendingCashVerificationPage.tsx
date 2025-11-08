import React, { useEffect, useState } from "react";
import { usePendingCashVerificationReport } from "../VerificationHocks/usePendingCashVerification";
import { FilterPendingCashVerification } from "../VerificationFilters/FilterPendingCashVerification";
import { PendingCashVerificationTable } from "../VerificationComponents/PendingCashVerificationFolder/PendingCashVerificationReport";
import { GraphPendingCashVerification } from "../VerificationGraphs/GraphPendingCashVerification";
import { PendingCashVerificationFilter } from "../../../../types/FilterReports/FilterReportsEntity";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import BackButton from "../../../../components/BackButton";

export const PendingCashVerificationPage: React.FC = () => {
  const [filters, setFilters] = useState<PendingCashVerificationFilter>({
    startDate: "",
    endDate: "",
    operatorId: "",
    deliveryTeamId: undefined,
  });

  const [searchParams, setSearchParams] =
    useState<PendingCashVerificationFilter | null>(null);

  const { data, isLoading, error } = usePendingCashVerificationReport(searchParams);

  // 🔹 Ejecutar búsqueda automática al entrar
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
  };

  const handleSearch = () => {
    console.log("🔍 Buscar clic:", filters);
    setSearchParams(filters);
  };

  const handleSetFilters = (updated: Partial<PendingCashVerificationFilter>) => {
    setFilters((prev) => {
      const newDeliveryTeamId =
        typeof updated.deliveryTeamId === "string"
          ? updated.deliveryTeamId === ""
            ? undefined
            : Number(updated.deliveryTeamId)
          : updated.deliveryTeamId;

      return { ...prev, ...updated, deliveryTeamId: newDeliveryTeamId };
    });
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
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Encabezado */}
        <div className="mb-10">
          <BackButton to="/verification/reports" />
          <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
            Reporte de Efectivo Pendiente de Verificación
          </h1>
          <p className="text-center text-lg text-gray-700">
            Visualizá los pedidos que aún se encuentran pendientes de verificación.
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white shadow-md rounded-2xl p-6 mb-10 border border-gray-200">
          <FilterPendingCashVerification
            filters={filters}
            setFilters={handleSetFilters}
            onSearch={handleSearch}
            onClear={handleClear}
          />
        </div>

        {/* Tabla y gráfico simplificado */}
        {!isLoading && (
          <div className="space-y-12 mt-8">
            <PendingCashVerificationTable data={data} />
            <GraphPendingCashVerification data={data} />
          </div>
        )}

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};
