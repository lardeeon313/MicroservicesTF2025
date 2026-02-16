
import { DeliveryTimesFilter } from "../VerificationFilters/FilterDeliveryTimes";
import { DeliveryReportGeneralTable } from "../VerificationComponents/DeliveryTimesFolder/DeliveryTimesReport";
import { DeliveryReportOnTimeTable } from "../VerificationComponents/DeliveryTimesFolder/DeliveryReportLateTable"; // Nota: Revisa si la importación coincide con el nombre real del componente
import { DeliveryReportLateTable } from "../VerificationComponents/DeliveryTimesFolder/DeliveryReportOnTimeTable"; // Nota: Revisa si la importación coincide con el nombre real del componente
import { useDeliveryTimesReport } from "../VerificationHocks/useDeliveryTimesReport";
import LoadingSpinner from "../../../../../../components/LoadingSpinner"; // Asegúrate que la ruta sea correcta
import BackButton from "../../../../components/BackButton"; // Asegúrate que la ruta sea correcta

export const DeliveryTimesReportPage = () => {
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

  // Opcional: Cargar datos al inicio si se desea
  // useEffect(() => { fetchReport(); }, []);

  if (loading) {
    return <LoadingSpinner message="Cargando reporte de entregas..." height="h-screen" />;
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/verification/reports" />
        
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

        {/* Mensaje si no hay datos y no está cargando */}
        {!loading && generalGrid.length === 0 && (
          <div className="text-center py-10">
             <p className="text-gray-500 text-lg">No hay datos para mostrar con los filtros actuales.</p>
          </div>
        )}

        {/* Tablas de resultados */}
        {!loading && generalGrid.length > 0 && (
          <div className="flex flex-col gap-8 mt-8">
            <DeliveryReportGeneralTable data={generalGrid} />

            {!filters.onlyLate && <DeliveryReportOnTimeTable data={onTimeList} />}
            {!filters.onlyOnTime && <DeliveryReportLateTable data={lateList} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryTimesReportPage;