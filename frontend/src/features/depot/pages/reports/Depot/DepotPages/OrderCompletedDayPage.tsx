import { useEffect } from "react";
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
    selectedDate,
    setSelectedDate,
    fetchData,
    clearFilters,
  } = useOrderCompletedDay();

  // 👉 cada vez que cambie la página, se vuelve a pedir la data
  // REMOVEMOS selectedDate de aquí para evitar llamadas automáticas
  useEffect(() => {
    fetchData(selectedDate, selectedDate, page);
  }, [page]); // Solo cuando cambia la página

  // Función para manejar la búsqueda
  const handleSearch = () => {
    if (selectedDate) {
      setPage(1); // Reset a página 1 cuando busques
      fetchData(selectedDate, selectedDate, 1);
    } else {
      // Si no hay fecha, traer todos
      fetchData("", "", 1);
    }
  };

  // Función para limpiar filtros
  const handleClear = () => {
    setPage(1);
    clearFilters();
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header con botón volver */}
      <div className="relative">
        {/* Botón volver posicionado absolutamente */}
        <button
          onClick={() => navigate("/depot/reports")}
          className="absolute left-0 top-0 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow transition"
        >
          ⬅️ Volver atrás
        </button>
        
        {/* Título centrado */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600">
               Pedidos Completados:
          </h1>
          <p className="text-gray-600 mt-2">
            Descripción de los pedidos completados o cualquier texto que necesites
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow p-4">
        <OrderCompletedDayFilter
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onSearch={handleSearch}
          onClear={handleClear}
        />
      </div>

      {/* Estados de carga */}
      {loading && <p className="text-blue-500">Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && data.length === 0 && (
        <p className="text-gray-500">No hay pedidos completados</p>
      )}

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow p-4">
        <OrderCompletedDayTable data={data} />
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-center gap-4">
        <button
          disabled={page <= 1}
          onClick={() => {
            const newPage = page - 1;
            setPage(newPage);
            fetchData(selectedDate, selectedDate, newPage);
          }}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg shadow disabled:opacity-50 transition"
        >
          ⬅️ Anterior
        </button>
        <span className="text-gray-700 font-medium">
          Página {page} de {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => {
            const newPage = page + 1;
            setPage(newPage);
            fetchData(selectedDate, selectedDate, newPage);
          }}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg shadow disabled:opacity-50 transition"
        >
          Siguiente ➡️
        </button>
      </div>

      {/* Gráfico */}
      <div className="bg-white rounded-xl shadow p-4">
  <GraphOrderCompletedDay data={data.map(order => ({ orderId: order.depotOrderId, finishDate: order.orderDate }))} />
      </div>
    </div>
  );
}