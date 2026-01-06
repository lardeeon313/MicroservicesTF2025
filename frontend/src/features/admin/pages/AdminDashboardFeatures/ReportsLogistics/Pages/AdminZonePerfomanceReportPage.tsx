import React, { useEffect, useState } from "react";
import { useZonePerformanceReport } from "../../../../../verification/pages/reports/Verification/VerificationHocks/useZonePerfomance";
import { FilterZonePerformance } from "../../../../../verification/pages/reports/Verification/VerificationFilters/FilterZonePerfomance";
import { AdminZonePerformanceTable } from "../Components/ZonePerfomanceFolder/AdminZonePerfomanceTable";
import AdminGraphZonePerformance from "../Graphs/AdminGraphZonePerfomance";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import BackButton from "../../../../../../components/BackButton";
import { BarChart3, Eye, EyeOff, RefreshCw } from "lucide-react";

export const AdminReportZonePerformanceReportPage: React.FC = () => {
  const { data, loading, error, fetchReport } = useZonePerformanceReport();
  const [showChart, setShowChart] = useState(true);

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

  const handleRefresh = () => {
    fetchReport();
  };

  const toggleChart = () => {
    setShowChart(!showChart);
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
          <BackButton to="/admin/reports/logistics" />
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

        {/* Botones de control alineados a la derecha */}
        {!loading && (
          <div className="flex justify-end gap-3 mt-6 mb-4">
            <button
              onClick={toggleChart}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-blue-700 transition-all transform hover:scale-105 font-medium"
            >
              {showChart ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
              {showChart ? "Ocultar Gráfico" : "Mostrar Gráfico"}
            </button>

            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-green-700 transition-all transform hover:scale-105 font-medium"
            >
              <RefreshCw className="w-5 h-5" />
              Refrescar Reporte
            </button>
          </div>
        )}

        {/* Contenido con layout consistente */}
        {!loading && data && data.length > 0 && (
          <div className="space-y-6 mt-8">
            <AdminZonePerformanceTable data={data} />
            
            {/* Contenedor del gráfico con transición suave */}
            <div
              className={`transition-all duration-300 ease-in-out ${
                showChart 
                  ? "opacity-100 max-h-[1000px]" 
                  : "opacity-0 max-h-0 overflow-hidden"
              }`}
            >
              {showChart && <AdminGraphZonePerformance data={data} />}
            </div>
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