import { useState } from "react";
import { useCompletedOrdersReport, OrdersCompletedFilter } from "../DepotHocks/useOrderCompletedDay";
import { CompletedOrdersFilter } from "../DepotFilters/OrderCompletedDayFilter";
import { CompletedOrdersTable } from "../DepotComponents/OrderCompletedDayTable";
import BackButton from "../../../../../../components/BackButton";

export const CompletedOrdersReportPage = () => {
  
  
  const [filters, setFilters] = useState<OrdersCompletedFilter>({
    from: null,
    to: null,
  });

  
  const [filtersDraft, setFiltersDraft] = useState<OrdersCompletedFilter>({
    from: null,
    to: null,
  });

  // Hook → solo escucha "filters"
  const { data, loading } = useCompletedOrdersReport(filters);

  const handleSearch = () => {
    setFilters(filtersDraft);  // ← ahora sí ejecuta el hook
  };

  const handleClear = () => {
    setFiltersDraft({ from: null, to: null });
    setFilters({ from: null, to: null });
  };

  return (
    <div className="w-full min-h-screen pt-10">
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        <div className="mb-6">
          <BackButton to="/depot/reports" />
        </div>

        {/* Header Section */}
        <div className="mx-auto max-w-4xl text-center mb-10">
          <h1 className="text-4xl font-bold text-red-600 mb-3">
            Reporte de Pedidos Completados
          </h1>
          <p className="text-lg text-gray-600">
            Visualiza la cantidad de pedidos completados por cada operario en un rango de fechas.
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

        {/* Divider */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
             
            </div>
            <div className="relative flex justify-center">

            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
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

      </div>
    </div>
  );
};