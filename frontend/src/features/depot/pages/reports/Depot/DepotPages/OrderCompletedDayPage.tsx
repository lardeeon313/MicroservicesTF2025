import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useOrderCompletedDay } from "../DepotHocks/useOrderCompletedDay";
import OrderCompletedDayTable from "../DepotComponents/OrderCompletedDayTable";
import GraphOrderCompletedDay from "../DepotGraph/GraphOrderCompletedDay";
import OrderCompletedDayFilter from "../DepotFilters/OrderCompletedDayFilter";

export default function OrderCompletedDayPage() {
  const navigate = useNavigate();

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

  // 🔄 Convertimos los strings del hook a Date | null para el filtro
  const parsedStartDate = startDate ? new Date(startDate) : null;
  const parsedEndDate = endDate ? new Date(endDate) : null;

  // 👉 Filtrado por fecha y búsqueda
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

  // 🔄 Llamamos al API con las fechas en string (del hook)
  useEffect(() => {
    fetchData(startDate, endDate, page);
  }, [startDate, endDate, page]);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="relative">
        <button
          onClick={() => navigate("/depot/reports")}
          className="absolute left-0 top-0 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow transition"
        >
          ⬅️ Volver atrás
        </button>
            <div className="text-center bg-gradient-to-r from-red-50 to-rose-50 py-8 px-6 rounded-xl border border-red-200 shadow-sm">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-3">
                Pedidos Completados
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                Aquí podrás gestionar todos los pedidos que hayan sido completados de los distintos clientes
              </p>
            </div>
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
        onClear={() => {
          setSearchTerm("");
          clearFilters();
        }}
      />

      {/* Estados */}
      {loading && <p className="text-blue-500">Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Tabla */}
      <OrderCompletedDayTable data={filteredData} />

      {/* Paginación */}
      <div className="flex items-center justify-center gap-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg shadow disabled:opacity-50 transition"
        >
          ⬅️ Anterior
        </button>
        <span>Página {page} de {totalPages}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg shadow disabled:opacity-50 transition"
        >
          Siguiente ➡️
        </button>
      </div>

      {/* Gráfico */}
      <GraphOrderCompletedDay data={filteredData} />
    </div>
  );
}
