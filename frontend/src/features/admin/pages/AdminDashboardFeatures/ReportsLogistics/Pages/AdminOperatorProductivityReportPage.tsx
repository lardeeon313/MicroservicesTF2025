import React, { useState } from "react";
import { RefreshCw, EyeOff, Eye } from "lucide-react";
//import { useOperatorProductivityReport } from "../../../../../verification/pages/reports/Verification/VerificationHocks/useOperatorProdictivityReport";
import { AdminUseOperatorProductivityReport } from "../Hocks/AdminUseOperatorProductivity";
import { AdminFilterOperatorProductivity } from "../Filters/AdminOperatorProductivityFilter";
import { AdminOperatorProductivityTable } from "../Components/OperatorProductivityFolder/AdminOperatorProductivityReport";
import { AdminGraphOperatorProductivity } from "../Graphs/AdminGraphOperatorProductivity";
import { OperatorProductivityFilterEntity } from "../../../../../verification/types/FilterReports/FilterReportsEntity";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import BackButton from "../../../../../../components/BackButton";

export const AdminReportOperatorProductivityPage: React.FC = () => {
  const [filters, setFilters] = useState<OperatorProductivityFilterEntity>({
    startDate: "",
    endDate: "",
    paymentType: "",
    deliveryZoneId: undefined,
    deliveryTeamId: undefined,
  });

  const [showChart, setShowChart] = useState(true);
  const [, setRefreshKey] = useState(0);

  // Usamos refreshKey como dependencia directa del hook
  const { data, isLoading } = AdminUseOperatorProductivityReport(filters);

  const handleRefresh = () => {
    // Forzamos un refetch cambiando ligeramente los filtros
    setFilters(prev => ({ ...prev }));
    setRefreshKey(prev => prev + 1);
  };

  const filteredData = data.filter(op => {
    const matchOperator = filters.operatorName
      ? op.fullNameDeliveringOperator
          .toLowerCase()
          .includes(filters.operatorName.toLowerCase())
      : true;

    const matchTeam = filters.teamName
      ? (op.teamName || "").toLowerCase().includes(filters.teamName.toLowerCase())
      : true;

    return matchOperator && matchTeam;
  });

  if (isLoading) {
    return (
      <LoadingSpinner
        message="Cargando reporte de actividad..."
        height="h-screen"
      />
    );
  }

  return (
    <div className="min-h-screen bg-white-50 py-10">
      {/* Contenedor central con ancho máximo */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Encabezado */}
        <div className="mb-10">
          <BackButton to="/admin/reports/logistics" />
          <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
            Reporte de Productividad del Repartidor
          </h1>
          <p className="text-center text-lg text-gray-700">
            Visualiza el rendimiento de cada uno de los repartidores encargados del reparto.
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white shadow-md rounded-2xl p-6 mb-10 border border-gray-200">
          <AdminFilterOperatorProductivity filters={filters} onChange={setFilters} />
        </div>

        {/* Botones de control */}
        <div className="flex items-center justify-end gap-3 mb-6">
          <button
            onClick={() => setShowChart(!showChart)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm ${
              showChart
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {showChart ? (
              <>
                <EyeOff className="w-4 h-4" />
                Ocultar Gráfico
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Mostrar Gráfico
              </>
            )}
          </button>

          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Refrescar Reporte
          </button>
        </div>

        {/* Contenido: Gráfico y Tabla */}
        {!isLoading && (
          <div className="space-y-8">

            {/* Tabla */}
            <div className="animate-fadeIn">
              <AdminOperatorProductivityTable data={filteredData} />
            </div>
            {/* Gráfico (condicional) */}
            {showChart && (
              <div className="animate-fadeIn">
                <AdminGraphOperatorProductivity data={filteredData} />
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};