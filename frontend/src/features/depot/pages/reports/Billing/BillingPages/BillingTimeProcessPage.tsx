import React, { useState } from "react";
import { useBillingTimeProcess } from "../BillingHocks/useBillingTimeProcess";
import ProcessingTimeOrderTable from "../BillingComponents/BillingTimeProcessTable";
import GraphProcessingTimeProcess from "../BillingGraphs/GraphBillingTimeProcess";
import ProcessingTimeOrderFilter from "../BillingFilters/BillingTimeProcessFilter";

// importa tus tipos desde TU archivo de tipos
import {
  ProcessingTimeOrder,
  RawOrderHistory,
} from "../../../../billingmanager/types/BillingTimeProcessType";
import BackButton from "../../../../../../components/BackButton";
import { AlertTriangle, Calendar, Search } from "lucide-react";
import EmptyState from "../../../../../../components/EmptyState";
import Pagination from "../../../../depotmanager/components/Pagination";

const ProcessingTimeOrderPage: React.FC = () => {
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
    const formatDate = (dateStr: string) => {
      const [day, month, year] = dateStr.split("/");
      return `${year}-${month}-${day}`;
    };

    setFrom(formatDate(fromDate));
    setTo(formatDate(toDate));
    setPage(1);
  };

  const handleClear = () => {
    setFrom("");
    setTo("");
    setPage(1);
  };

  // -------------------------------
  // ADAPTADOR
  // -------------------------------
  // 1) Tratamos lo que viene del hook como "crudo" (RawOrderHistory[])
  const raw: RawOrderHistory[] = (data as unknown as RawOrderHistory[]) ?? [];

  // 2) Lo convertimos a lo que espera la UI (ProcessingTimeOrder[])
  const tableData: ProcessingTimeOrder[] = raw.map((h) => ({
    orderId: Number(h.orderId),
    averageProcessingTime: h.durationMinutes, // 👉 usamos lo que viene del back
  }));

  // 3) Para el gráfico (usa { orderId, processingTime })
  const graphData = tableData.map((t) => ({
    orderId: t.orderId,
    processingTime: t.averageProcessingTime,
  }));

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/depot/billingmanager/reports"></BackButton>
        {/* Título principal */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
            Tiempo promedio <br></br>para el proceso de facturación
          </h1>
          <p className="text-center text-lg text-gray-700 mb-12">
            Aquí podrás ver cuánto le toma al encargado de facturación
            cada uno de los pedidos ya armados.
          </p>

          <div className="flex flex-col md:flex-row mb-4 w-full justify-between gap-2">
          {/* Filtro */}
          <ProcessingTimeOrderFilter onFilter={handleFilter} onClear={handleClear} />
          </div>
          
          {/* Tabla + Gráfico */}
          <div className="mt-12">
            {!from || !to ? (
              <EmptyState
                icon={Calendar}
                title="Selecciona un rango de fechas"
                description="Para visualizar el tiempo promedio de facturación, utiliza el filtro superior y elige un rango de fechas."
                actionLabel="Ir a filtros"
                onAction={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              />
            ) : (
              <>
                {loading && <p className="text-gray-500">Cargando datos...</p>}
                {error && <EmptyState
                  icon={AlertTriangle}
                  title="Rango de fechas inválido"
                  description="Verifica que la fecha de inicio sea anterior a la fecha de fin para poder mostrar los resultados."
                  actionLabel="Corregir rango"
                  onAction={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                />}

                {!loading && !error && tableData.length > 0 && (
                  <>
                    {/* 👉 La tabla recibe ProcessingTimeOrder[] */}
                    <ProcessingTimeOrderTable data={{ items: raw }} />

                    <div className="mt-10">
                      <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Visualización gráfica:
                      </h2>
                      {/* 👉 El gráfico recibe { orderId, processingTime } */}
                      <GraphProcessingTimeProcess data={graphData} />
                    </div>
                  </>
                )}

                {!loading && !error && tableData.length === 0 && (
                  <EmptyState
                    icon={Search}
                    title="Sin resultados"
                    description="No se encontraron pedidos dentro del rango de fechas seleccionado. Prueba con un periodo diferente."
                    actionLabel="Reintentar con otros filtros"
                    onAction={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  />
                )}
              </>
            )}
          </div>

          {/* Paginación */}
          {!loading && totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(newPage) => setPage(newPage)}
                totalItems={0} // 👈 Added totalItems
                itemsPerPage={pageSize} // 👈 Added itemsPerPage
              />
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default ProcessingTimeOrderPage;
