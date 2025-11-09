//Pedidos rechazados: 
import React, { useState } from "react";
import { useDeliveryRejections } from "../VerificationHocks/useDeliveryRejectionsReport";
import DeliveryRejectionsFilter from "../VerificationFilters/FilterDeliveryRejections";
import DeliveryRejectionsTable from "../VerificationComponents/DeliveryRejections/DeliveryRejectionsReport";
import GraphDeliveryRejectionsReport from "../VerificationGraphs/GraphDeliveryRejectionsReport";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import BackButton from "../../../../../../components/BackButton";
import { RejectionReportFilters } from "../../../../types/FilterReports/FilterReportsEntity";
import DeliveryRejectionsTeamReport from "../VerificationComponents/DeliveryRejections/DeliveryRejectionsTeamReport";
import DeliveryRejectionsZoneReport from "../VerificationComponents/DeliveryRejections/DeliveryRejectionsZoneReport";

export const DeliveryRejectionsPage: React.FC = () => {
  const [appliedFilters, setAppliedFilters] = useState<RejectionReportFilters>({});
  const { data, loading, error } = useDeliveryRejections(appliedFilters);

  const handleFilterChange = (filters: RejectionReportFilters) => {
    console.log("📤 Aplicando filtros desde página:", filters);
    setAppliedFilters(filters);
  };

  const handleClear = () => setAppliedFilters({});

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/verification/reports" />
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Reporte de rechazos de entrega
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Visualiza rechazos registrados, filtra y analiza los resultados.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <DeliveryRejectionsFilter
          onFilterChange={handleFilterChange}
          onClear={handleClear}
        />

        {error && <p className="text-center text-red-500 mt-6">{error}</p>}

        {loading ? (
          <LoadingSpinner
            message="Cargando reporte de rechazos..."
            height="h-screen"
          />
        ) : (
          <div className="space-y-12 mt-8">
            <DeliveryRejectionsTable data={data} />
            <DeliveryRejectionsTeamReport data={data} />
            <DeliveryRejectionsZoneReport data={data} />
            <GraphDeliveryRejectionsReport data={data} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryRejectionsPage;
