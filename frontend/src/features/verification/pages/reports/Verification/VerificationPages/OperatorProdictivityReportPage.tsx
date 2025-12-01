import React, { useState } from "react";
import { useOperatorProductivityReport } from "../VerificationHocks/useOperatorProdictivityReport";
import { FilterOperatorProductivity } from "../VerificationFilters/FilterOperatorProdictivity";
import { OperatorProductivityTable } from "../VerificationComponents/OperatorProdictivityFolder/OperatorProdictivityReport";

import { OperatorProductivityFilterEntity } from "../../../../types/FilterReports/FilterReportsEntity";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import BackButton from "../../../../components/BackButton";

export const OperatorProductivityPage: React.FC = () => {
  // ✅ Estado inicial del filtro
  const [filters, setFilters] = useState<OperatorProductivityFilterEntity>({
    startDate: "",
    endDate: "",
    paymentType: "",
    deliveryZoneId: undefined,
    deliveryTeamId: undefined,
  });

  const { data, isLoading } = useOperatorProductivityReport(filters);

  if (isLoading) {
    return (
      <LoadingSpinner
        message="Cargando reporte de actividad..."
        height="h-screen"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      {/* Contenedor central con ancho máximo */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Encabezado */}
        <div className="mb-10">
          <BackButton to="/verification/reports" />
          <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
            Reporte de Productividad del Repartidor
          </h1>
          <p className="text-center text-lg text-gray-700">
            Visualiza el rendimiento de cada uno de los repartidores encargados del reparto.
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white shadow-md rounded-2xl p-6 mb-10 border border-gray-200">
          <FilterOperatorProductivity filters={filters} onChange={setFilters} />
        </div>

        {/* Tabla y gráfico simplificado */}
        {!isLoading && (
          <div className="space-y-12 mt-8">
            <OperatorProductivityTable 
              data={data.filter(op => {

                const matchOperator = filters.operatorName
                  ? op.fullNameDeliveringOperator
                      .toLowerCase()
                      .includes(filters.operatorName.toLowerCase())
                  : true;

                const matchTeam = filters.teamName
                  ? (op.teamName || "").toLowerCase().includes(filters.teamName.toLowerCase())
                  : true;

                return matchOperator && matchTeam;
              })}
            />

            
          </div>
        )}
      </div>
    </div>
  );
};
