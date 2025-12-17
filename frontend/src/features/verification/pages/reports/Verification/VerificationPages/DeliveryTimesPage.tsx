import React, { useEffect, useState } from "react";
import useDeliveryTimesReport from "../VerificationHocks/useDeliveryTimesReport";
import FilterDeliveryTimes from "../VerificationFilters/FilterDeliveryTimes";
import DeliveryTimesTable from "../VerificationComponents/DeliveryTimesFolder/DeliveryTimesReport";
import GraphDeliveryTimes from "../VerificationGraphs/GraphDeliveryTimesReport";
import { DeliveryTimeFilterEntity } from "../../../../types/FilterReports/FilterReportsEntity";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import BackButton from "../../../../../../components/BackButton";



export const DeliveryTimesReportPage: React.FC = () => {
  const { data, loading, error, fetchReport } = useDeliveryTimesReport();
  const [filter, setFilter] = useState<DeliveryTimeFilterEntity>({});
  const [showGraph, setShowGraph] = useState(false);

  useEffect(() => {
    fetchReport(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onApplyFilter = (f: DeliveryTimeFilterEntity) => {
    setFilter(f);
    fetchReport(f);
  };

  if (loading) {
    return <LoadingSpinner message="Cargando reporte de actividad..." height="h-screen" />;
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/verification/reports" />
          <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
            Reporte de Tiempos de entrega
          </h1>
          <p className="text-center text-lg text-gray-700 mb-12">
             Visualiza todos los pedidos que han sido entregados por los equipos de reparto.
          </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FilterDeliveryTimes initial={filter} onApply={onApplyFilter} />

        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm text-gray-600 font-medium">
            {loading ? "Cargando..." : `Resultados: ${data.length}`}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => fetchReport(filter)}
              className="px-4 py-2 bg-green-600 text-white font-semibold rounded-xl shadow-sm hover:bg-green-700 hover:shadow-md transition-all duration-200"
            >
              Refrescar
            </button>
            <button
              onClick={() => setShowGraph((s) => !s)}
              className={`px-4 py-2 font-semibold rounded-xl shadow-sm transition-all duration-200 ${
                showGraph
                  ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
                  : "bg-gray-300 text-gray-800 hover:bg-gray-400 hover:shadow-md"
              }`}
            >
              {showGraph ? "Ocultar gráfico " : "Mostrar gráfico "}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Tabla */}
        <div className="mt-8 mb-12 bg-white shadow rounded-2xl p-4">
          <DeliveryTimesTable data={data} />
        </div>

        {/* Gráfico */}
        {showGraph && (
          <div className="mt-12 bg-white shadow rounded-2xl p-6">
            <GraphDeliveryTimes data={data} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryTimesReportPage;
