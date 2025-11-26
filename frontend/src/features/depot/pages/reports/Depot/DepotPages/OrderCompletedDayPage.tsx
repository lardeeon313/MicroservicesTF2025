import { useEffect, useState, useMemo } from "react";
import { useOrderCompletedDay } from "../DepotHocks/useOrderCompletedDay";
import OrderCompletedDayTable from "../DepotComponents/OrderCompletedDayTable";

import OrderCompletedDayFilter from "../DepotFilters/OrderCompletedDayFilter";
import BackButton from "../../../../../../components/BackButton";
import Pagination from "../../../../depotmanager/components/Pagination";

export default function OrderCompletedDayPage() {
  const {
    data,
    loading,
    error,
    page,
    setPage,
    totalPages,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    fetchData,
    clearFilters,
  } = useOrderCompletedDay();

  const [searchTerm, setSearchTerm] = useState("");
  const [, setPeriod] = useState("");

  const onPeriodChange = (value: string) => {
      setPeriod(value);

      const today = new Date();
      let start: string = "";
      let end: string = "";

      if (value === "day") {
        start = today.toISOString().split("T")[0];
        end = start;
      }

      if (value === "half") {
        const day = today.getDate();
        const isFirstHalf = day <= 15;
        const startDate = isFirstHalf ? new Date(today.getFullYear(), today.getMonth(), 1) 
                                  : new Date(today.getFullYear(), today.getMonth(), 16);
        const endDate = isFirstHalf ? new Date(today.getFullYear(), today.getMonth(), 15) 
                                : new Date(today.getFullYear(), today.getMonth() + 1, 0);
        start = startDate.toISOString().split("T")[0];
        end = endDate.toISOString().split("T")[0];
      }

      if (value === "month") {
        const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        start = startDate.toISOString().split("T")[0];
        end = endDate.toISOString().split("T")[0];
      }

  
      setStartDate(start);
      setEndDate(end);
      fetchData(start, end, 1);
  };


  
  const parsedStartDate = startDate ? new Date(startDate) : null;
  const parsedEndDate = endDate ? new Date(endDate) : null;

  
  const filteredData = useMemo(() => {
    let currentData = data;

    if (parsedStartDate && parsedEndDate) {
      currentData = currentData.filter(order => {
        const orderDate = new Date(order.orderDate);
        return (
          orderDate.getTime() >= parsedStartDate.getTime() &&
          orderDate.getTime() <= parsedEndDate.getTime()
        );
      });
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      currentData = currentData.filter(order =>
        order.customerName.toLowerCase().includes(term) ||
        order.customerEmail.toLowerCase().includes(term) ||
        String(order.salesOrderId).toLowerCase().includes(term) ||
        String(order.depotOrderId).toLowerCase().includes(term)
      );
    }

    return currentData;
  }, [data, parsedStartDate, parsedEndDate, searchTerm]);

  
  useEffect(() => {
    fetchData(startDate, endDate, page);
  }, [startDate, endDate, page]);

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/depot/reports"></BackButton>
        <div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
              Pedidos Armados
            </h1>
            <p className="text-center text-lg text-gray-700 mb-12">
              Aquí podrás gestionar todos los pedidos de los clientes que hayan sido armados.
            </p>
          </div>


          {/* Filtros */}
          <OrderCompletedDayFilter
            startDate={parsedStartDate}
            endDate={parsedEndDate}
            onStartDateChange={(date) =>
              setStartDate(date ? date.toISOString().split("T")[0] : "")
            }
            onEndDateChange={(date) =>
              setEndDate(date ? date.toISOString().split("T")[0] : "")
            }
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onPeriodChange={onPeriodChange}  
            onClear={() => {
              setSearchTerm("");
              setPeriod("");
              clearFilters();
            }}
          />

          {/* Estados */}
          {loading && <p className="text-red-500">Cargando...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {/* Tabla */}
          <OrderCompletedDayTable data={filteredData} />

          {/* Paginación */}
          <div className="flex justify-center mt-6 gap-4">
            <Pagination 
              currentPage={page}
              totalPages={totalPages}
              totalItems={data.length}   
              itemsPerPage={10}          
              onPageChange={setPage}
            />
          </div>


        </div>
      </div>
    </div>
  );
}
