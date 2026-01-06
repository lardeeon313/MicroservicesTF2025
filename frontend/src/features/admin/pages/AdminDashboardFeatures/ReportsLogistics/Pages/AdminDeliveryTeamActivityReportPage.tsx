import { useEffect, useState } from "react";
import {  Eye, EyeOff, RefreshCw } from "lucide-react";

import DeliveryTeamActivityFilter from "../Filters/DeliveryTeamActivityFilter";
import AdminDeliveryTeamActivityTable from "../Components/DeliveryTeamFolder/AdminDeliveryTeamActivityReport";
import AdminGraphDeliveryTeamActivity from "../Graphs/AdminGraphDeliveryTeamActivity";
import { useDeliveryTeamActivity } from "../../../../../verification/pages/reports/Verification/VerificationHocks/useDeliveryTeamActivityReport";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import BackButton from "../../../../../../components/BackButton";

const AdminDeliveryTeamActivityPage = () => {
  const { data, loading, fetchReport } = useDeliveryTeamActivity();
  const [showGraphs, setShowGraphs] = useState(true);
  const [currentFilters, setCurrentFilters] = useState({});

  // ✅ Traer datos sin filtros al iniciar
  useEffect(() => {
    fetchReport({});
  }, []);

  const handleRefresh = () => {
    fetchReport(currentFilters);
  };

  const handleFilter = (filters: any) => {
    setCurrentFilters(filters);
    fetchReport(filters);
  };

  const handleClear = () => {
    setCurrentFilters({});
    fetchReport({});
  };

  if (loading) {
    return <LoadingSpinner message="Cargando reporte de actividad..." height="h-screen" />;
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/admin/reports/logistics" />
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Reporte de Actividad por Equipo
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Visualiza el rendimiento de los equipos encargados del reparto.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <DeliveryTeamActivityFilter
          onFilter={handleFilter}
          onClear={handleClear}
        />

        {/* Botones de control */}
        <div className="flex justify-end gap-3 mb-4">
          <button
            onClick={() => setShowGraphs(!showGraphs)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              showGraphs
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {showGraphs ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
            {showGraphs ? "Ocultar Gráfico" : "Mostrar Gráfico"}
          </button>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            Refrescar Reporte
          </button>
        </div>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <>
            <AdminDeliveryTeamActivityTable data={data} />
            {showGraphs && <AdminGraphDeliveryTeamActivity data={data} />}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDeliveryTeamActivityPage;