import { useState } from "react";
import { useCompletedOrdersReport, OrdersCompletedFilter } from "../Hocks/useOrderCompletedDay";
import { CompletedOrdersFilter } from "../../../../../depot/pages/reports/Depot/DepotFilters/OrderCompletedDayFilter";
import { CompletedOrdersTable } from "../Components/OrderCompletedDayTable";
import BackButton from "../../../../../../components/BackButton";
import { AdminGraphOrderCompletedDay } from "../Graphs/GraphOrderCompletedDay";

export const AdminReportCompletedOrdersReportPage = () => {
  
  const [filters, setFilters] = useState<OrdersCompletedFilter>({
    from: null,
    to: null,
  });

  const [filtersDraft, setFiltersDraft] = useState<OrdersCompletedFilter>({
    from: null,
    to: null,
  });

  const [showChart, setShowChart] = useState(true);

  // Hook → solo escucha "filters"
  const { data, loading } = useCompletedOrdersReport(filters);

  const handleSearch = () => {
    setFilters(filtersDraft);
  };

  const handleClear = () => {
    setFiltersDraft({ from: null, to: null });
    setFilters({ from: null, to: null });
  };

  const handleRefresh = () => {
    setFilters({ ...filters });
  };

  const toggleChart = () => {
    setShowChart(!showChart);
  };

  return (
    <div className="w-full min-h-screen pt-10">
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        <div className="mb-6">
          <BackButton to="/admin/reports/depot" />
        </div>

        {/* Header Section */}
        <div className="mx-auto max-w-4xl text-center mb-10">
          <h1 className="text-4xl font-bold text-red-600 mb-3">
            Reporte de pedidos armados por dia
          </h1>
          <p className="text-lg text-gray-600">
            Visualiza la cantidad de pedidos armados por cada operario en un rango de fechas.
          </p>
        </div>

        {/* Filter Section */}
        <div className="mb-8">
          <CompletedOrdersFilter 
            filters={filtersDraft} 
            setFilters={setFiltersDraft}
            onSearch={handleSearch}
            onClear={handleClear}
          />
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex gap-3 justify-end">
                    <button
            onClick={toggleChart}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            {showChart ? (
              <>
                <svg 
                  className="-ml-1 mr-2 h-5 w-5" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" 
                  />
                </svg>
                Ocultar Gráfico
              </>
            ) : (
              <>
                <svg 
                  className="-ml-1 mr-2 h-5 w-5" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                  />
                </svg>
                Mostrar Gráfico
              </>
            )}
          </button>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 rounded-lg shadow text-white font-medium bg-red-600 hover:bg-red-700 transition flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg 
              className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            {loading ? 'Actualizando...' : 'Refrescar Reporte'}
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">
              Detalle por Operario
            </h2>
          </div>
          
          {loading ? (
            <div className="p-16 text-center text-gray-500 flex flex-col items-center">
              <svg 
                className="animate-spin h-10 w-10 text-red-600 mb-4" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                ></circle>
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-base font-medium">Cargando datos...</p>
            </div>
          ) : (
            <CompletedOrdersTable data={data} />
          )}
        </div>

        {/* Chart Section - Conditional */}
        {showChart && (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 p-6 animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Distribución de Pedidos Completados
              </h2>
              <p className="text-sm text-gray-600">
                Comparativa visual del rendimiento por operario
              </p>
            </div>
            
            <div className="h-[400px]">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center">
                    <svg 
                      className="animate-spin h-10 w-10 text-red-600 mb-4" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      ></circle>
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <p className="text-base font-medium text-gray-500">Cargando gráfico...</p>
                  </div>
                </div>
              ) : (
                <AdminGraphOrderCompletedDay data={data} />
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};