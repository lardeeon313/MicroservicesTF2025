import React, { useEffect } from "react";
import { useZonePerformanceReport } from "../VerificationHocks/useZonePerfomance";
import { FilterZonePerformance } from "../VerificationFilters/FilterZonePerfomance";
import { ZonePerformanceTable } from "../VerificationComponents/ZonePerfomanceFolder/ZonePerfomance";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import BackButton from "../../../../../../components/BackButton";
import { BarChart3 } from "lucide-react";

export const ZonePerformanceReportPage: React.FC = () => {
  const { data, loading, error, fetchReport } = useZonePerformanceReport();

  useEffect(() => {
    fetchReport(); 
  }, []);

  const handleFilter = (
    startDate?: string,
    endDate?: string,
    operatorId?: string,
    deliveryTeamId?: number
  ) => {
    fetchReport(startDate, endDate, operatorId, deliveryTeamId);
  };

  const handleClear = () => {
    fetchReport();
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
    <div className="min-h-screen bg-white-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="container mx-auto py-10 px-4 sm:px-16">
          <BackButton to="/verification/reports" />
          <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
            Cantidad de pedidos por zona.
          </h1>
          <p className="text-center text-lg text-gray-700 mb-12">
            Compara la cantidad de pedidos realizados por zona.
          </p>
        </div>

        <FilterZonePerformance onFilter={handleFilter} onClear={handleClear} />

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Contenido con layout consistente */}
        {!loading && data && data.length > 0 && (
          <div className="space-y-6 mt-8">
            <ZonePerformanceTable data={data} />
          
      
          </div>
        )}

        {!loading && (!data || data.length === 0) && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-12 text-center">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              No hay datos disponibles para mostrar
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Intenta ajustar los filtros o refrescar el reporte
            </p>
          </div>
        )}
      </div>
    </div>
  );
};