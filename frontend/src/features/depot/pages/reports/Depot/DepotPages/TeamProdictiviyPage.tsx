import { useState } from "react";
import BackButton from "../../../../../../components/BackButton";
import { DepotTeamPerformanceFilter } from "../DepotFilters/TeamProdictivityFilter";
import { useDepotTeamPerformance } from "../DepotHocks/useTeamProdictivity";
import { TeamPerformanceTable } from "../DepotComponents/TeamProdictivityTable";
import { OperatorPerformanceTable } from "../DepotComponents/OperatorPerfomanceTable";

export const DepotTeamPerformancePage: React.FC = () => {
  const { data, loading, fetchData } = useDepotTeamPerformance();
  const [agrupar, setAgrupar] = useState(true);

  const handleSearch = (filters: any) => {
    setAgrupar(filters.agruparPorEquipo);
    fetchData(filters);
  };

  return (
    <div className="w-full min-h-screen pt-10">
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Botón volver */}
        <div className="mb-6">
          <BackButton to="/depot/reports" />
        </div>

        {/* HEADER */}
        <div className="mx-auto max-w-4xl text-center mb-10">
          <h1 className="text-4xl font-bold text-red-700 mb-3">
            Reporte de Productividad de equipo
          </h1>
          <p className="text-lg text-gray-600">
            Analiza el rendimiento de equipos y operarios dentro de un rango o período seleccionado.
          </p>
        </div>

        {/* FILTRO */}
        <div className="mb-8">
          <div className="bg-white shadow-lg p-6 rounded-xl border border-gray-200">
            <DepotTeamPerformanceFilter onSearch={handleSearch} />
          </div>
        </div>

        {/* TABLAS */}
        <div className="space-y-10">

          {loading && (
            <div className="p-16 text-center text-gray-500 flex flex-col items-center">
              <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-base font-medium">Cargando datos...</p>
            </div>
          )}

          {!loading && data.length > 0 && (
            <>
              {/* TABLA EQUIPOS */}
              {agrupar && (
                <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
                  <TeamPerformanceTable data={data} />
                </div>
              )}

              {/* TABLA OPERARIOS */}
              {!agrupar && (
                <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
                  <OperatorPerformanceTable data={data} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
