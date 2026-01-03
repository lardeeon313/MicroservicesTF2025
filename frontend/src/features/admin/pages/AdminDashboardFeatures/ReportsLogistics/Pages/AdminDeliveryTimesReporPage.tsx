import { useState } from "react";
import { DeliveryTimesFilter } from "../Filters/DeliveryTimesFilter";
import { DeliveryReportGeneralTable } from "../Components/DeliveryTimesFolder/DeliveryReportGeneralTable";
import { DeliveryReportOnTimeTable } from "../Components/DeliveryTimesFolder/DeliveryReportOnTimeTable";
import { useDeliveryTimesReport } from "../../../../../verification/pages/reports/Verification/VerificationHocks/useDeliveryTimesReport";
import { DeliveryReportLateTable } from "../Components/DeliveryTimesFolder/DeliveryReportLateTable";
import { AdminGraphDeliveryTimes } from "../Graphs/AdminGraphDeliveryTimes";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import BackButton from "../../../../../../components/BackButton";
import { BarChart3, RefreshCw, ChevronUp, ChevronDown } from "lucide-react";

export const AdminDeliveryTimesReportPage = () => {
  const {
    filters,
    setFilters,
    generalGrid,
    onTimeList,
    lateList,
    fetchReport,
    resetFilters,
    loading,
  } = useDeliveryTimesReport();

  const [showCharts, setShowCharts] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchReport();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (loading || isRefreshing) {
    return <LoadingSpinner message="Cargando reporte de entregas..." height="h-screen" />;
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full bg-white-50">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/admin/reports/logistics" />
        
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Reporte de Tiempos de entrega
        </h1>
        
        <p className="text-center text-lg text-gray-700 mb-12">
          Visualiza el cumplimiento de tiempos y estado de las entregas.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
        <DeliveryTimesFilter
          filters={filters}
          setFilters={setFilters}
          onSearch={fetchReport}
          onClear={resetFilters}
        />

        {/* Botones de control */}
        {!loading && generalGrid.length > 0 && (
          <div className="flex justify-end gap-3 mt-6 mb-4">
            <button
              onClick={() => setShowCharts(!showCharts)}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-indigo-50 text-indigo-600 font-medium rounded-lg shadow-sm border border-indigo-200 transition-all duration-200 hover:shadow-md"
            >
              <BarChart3 className="w-5 h-5" />
              {showCharts ? (
                <>
                  <span>Ocultar Gráficos</span>
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Mostrar Gráficos</span>
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-lg shadow-md transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Actualizando...' : 'Refrescar Reporte'}</span>
            </button>
          </div>
        )}

        {/* Mensaje si no hay datos y no está cargando */}
        {!loading && generalGrid.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200 mt-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium mb-2">
                No hay datos para mostrar
              </p>
              <p className="text-gray-400 text-sm">
                Ajusta los filtros de búsqueda e intenta nuevamente
              </p>
            </div>
          </div>
        )}

        {/* Tablas y Gráficos de resultados */}
        {!loading && generalGrid.length > 0 && (
          <div className="flex flex-col gap-8 mt-8">
            {/* Tablas primero */}
            <DeliveryReportGeneralTable data={generalGrid} />

            {!filters.onlyLate && <DeliveryReportOnTimeTable data={onTimeList} />}
            {!filters.onlyOnTime && <DeliveryReportLateTable data={lateList} />}

            {/* Gráficos después (colapsables) */}
            {showCharts && (
              <div className="transition-all duration-300 ease-in-out">
                <AdminGraphDeliveryTimes
                  generalGrid={generalGrid}
                  onTimeList={onTimeList}
                  lateList={lateList}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDeliveryTimesReportPage;