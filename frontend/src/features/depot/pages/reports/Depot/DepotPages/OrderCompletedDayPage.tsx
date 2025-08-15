import { useEffect } from "react";
//import { useOrderCompletedDay } from "../DepotHooks/useOrderCompletedDay";
import { useOrderCompletedDay } from "../DepotHocks/useOrderCompletedDay";
import OrderCompletedDayTable from "../DepotComponents/OrderCompletedDayTable";
import GraphOrderCompletedDay from "../DepotGraph/GraphOrderCompletedDay";

export default function OrderCompletedDayPage() {
  const {
    data,
    loading,
    error,
    selectedDate,
    setSelectedDate,
    page,
    setPage,
    totalPages,
    fetchData,
    clearFilters,
  } = useOrderCompletedDay();

  useEffect(() => {
    fetchData(selectedDate, selectedDate, page);
  }, [page,selectedDate]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pedidos Completados</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded p-2"
        />
        <button
          onClick={() => fetchData(selectedDate, selectedDate, 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Filtrar
        </button>
        <button
          onClick={clearFilters}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Limpiar
        </button>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && data.length === 0 && <p>No hay pedidos completados</p>}

      <OrderCompletedDayTable data={data} />

      <div className="flex items-center gap-4 mt-4">
        <button
          disabled={page <= 1}
          onClick={() => {
            const newPage = page - 1;
            setPage(newPage);
            fetchData(selectedDate, selectedDate, newPage);
          }}
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span>
          Página {page} de {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => {
            const newPage = page + 1;
            setPage(newPage);
            fetchData(selectedDate, selectedDate, newPage);
          }}
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>

      <GraphOrderCompletedDay data={data} />
    </div>
  );
}

