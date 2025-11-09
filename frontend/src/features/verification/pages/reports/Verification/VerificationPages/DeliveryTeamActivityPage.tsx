import { useEffect } from "react";
import DeliveryTeamActivityFilter from "../VerificationFilters/FilterDeliveryTeamActivity";
import DeliveryTeamActivityTable from "../VerificationComponents/DeliveryTeamFolder/DeliveryTeamActivityReport";
import GraphDeliveryTeamActivity from "../VerificationGraphs/GraphDeliveryTeamActitivityReport";
import { useDeliveryTeamActivity } from "../VerificationHocks/useDeliveryTeamActivityReport";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import BackButton from "../../../../../../components/BackButton";

const DeliveryTeamActivityPage = () => {
  const { data, loading, fetchReport } = useDeliveryTeamActivity();

  // ✅ Traer datos sin filtros al iniciar
  useEffect(() => {
    fetchReport({});
  }, []);

  if (loading) {
    return <LoadingSpinner message="Cargando reporte de actividad..." height="h-screen" />;
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/verification/reports" />
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Reporte de Actividad por Equipo
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Visualiza el rendimiento de los equipos encargados del reparto.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <DeliveryTeamActivityFilter
          onFilter={(filters) => fetchReport(filters)}
          onClear={() => fetchReport({})}
        />

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <>
            <DeliveryTeamActivityTable data={data} />
            <div className="mt-4">
              <GraphDeliveryTeamActivity data={data} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DeliveryTeamActivityPage;
