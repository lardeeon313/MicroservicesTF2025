import React, { useState } from "react";
//import { useBillingTimeProcess } from "./hooks/useBillingTimeProcess";
import { useBillingTimeProcess } from "../BillingHocks/useBillingTimeProcess";
//import ProcessingTimeOrderTable from "./ProcessingTimeOrderTable";
import ProcessingTimeOrderTable from "../BillingComponents/BillingTimeProcessTable";
//import ProcessingTimeOrderFilter from "./ProcessingTimeOrderFilter";
import ProcessingTimeOrderFilter from "../BillingFilters/BillingTimeProcessFilter";
import { useNavigate } from "react-router-dom";

const ProcessingTimeOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const { data, loading, error, totalPages } = useBillingTimeProcess(
    from,
    to,
    page,
    pageSize
  );

  const handleFilter = (fromDate: string, toDate: string) => {
    setFrom(fromDate);
    setTo(toDate);
    setPage(1);
  };

  const handleClear = () => {
    setFrom("");
    setTo("");
    setPage(1);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow">
        
        {/* Botón Volver */}
        <div className="mb-4">
          <button
            onClick={() => navigate("/depot/billingmanager/reports")}
            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
          >
            ← Volver atrás
          </button>
        </div>

        {/* Título principal */}
        <h1 className="text-2xl font-bold text-red-600 mb-2">
          Tiempo promedio para el proceso de facturación:
        </h1>
        <p className="text-gray-600 mb-6">
          Aquí podrás ver cuánto le toma al encargado de facturación facturar cada uno de los pedidos ya armados.
        </p>

        {/* Filtro */}
        <ProcessingTimeOrderFilter
          onFilter={handleFilter}
          onClear={handleClear}
        />

        {/* Tabla o Mensajes */}
        <div className="mt-6">
          {loading && <p className="text-gray-500">Cargando datos...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && data.length > 0 && (
            <ProcessingTimeOrderTable data={data} />
          )}
          {!loading && !error && data.length === 0 && (
            <p className="text-gray-500 mt-4">
              No se encontraron resultados para las fechas seleccionadas.
            </p>
          )}
        </div>

        {/* Paginación */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center mt-6 gap-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
            >
              Anterior
            </button>

            <span className="text-sm text-gray-600">
              Página {page} de {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessingTimeOrderPage;


