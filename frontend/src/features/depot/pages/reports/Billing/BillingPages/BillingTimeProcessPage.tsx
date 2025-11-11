import React, { useState } from "react";
import { useBillingTimeProcess } from "../BillingHocks/useBillingTimeProcess";
import BillingTimeProcessTable from "../BillingComponents/BillingTimeProcessTable";
import GraphProcessingTimeProcess from "../BillingGraphs/GraphBillingTimeProcess";
import ProcessingTimeOrderFilter from "../BillingFilters/BillingTimeProcessFilter";

import BackButton from "../../../../../../components/BackButton";
import { AlertTriangle, Search } from "lucide-react";
import EmptyState from "../../../../../../components/EmptyState";
import Pagination from "../../../../depotmanager/components/Pagination";

const ProcessingTimeOrderPage: React.FC = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const { data, loading, error, totalPages } = useBillingTimeProcess(from, to, page, pageSize);

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

  const graphData = data.map((t) => ({
    orderId: t.orderId,
    processingTime: t.averageProcessingTime,
  }));

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/depot/billingmanager/reports" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
            Tiempo promedio <br /> para el proceso de facturación
          </h1>
          <p className="text-center text-lg text-gray-700 mb-12">
            Aquí podrás ver cuánto le toma al encargado de facturación cada uno de los pedidos ya armados.
          </p>
          <div className="flex flex-col md:flex-row mb-4 w-full justify-between gap-2">
            <ProcessingTimeOrderFilter onFilter={handleFilter} onClear={handleClear} />
          </div>
          <div className="mt-12">
          {loading && <p className="text-gray-500">Cargando datos...</p>}

{error && (
  <EmptyState
    icon={AlertTriangle}
    title="Rango de fechas inválido"
    description="Verifica que la fecha de inicio sea anterior a la fecha de fin para poder mostrar los resultados."
    actionLabel="Corregir rango"
    onAction={() => window.scrollTo({ top: 0, behavior: "smooth" })}
  />
)}

{!loading && !error && data.length > 0 && (
  <>
    <BillingTimeProcessTable data={data} />
    <div className="mt-10">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Visualización gráfica:</h2>
      <GraphProcessingTimeProcess data={graphData} />
    </div>
  </>
)}

{!loading && !error && data.length === 0 && (
  <EmptyState
    icon={Search}
    title="Sin resultados"
    description="No se encontraron pedidos dentro del rango de fechas seleccionado. Prueba con un periodo diferente."
    actionLabel="Reintentar con otros filtros"
    onAction={() => window.scrollTo({ top: 0, behavior: "smooth" })}
  />
)}

          </div>
          {!loading && totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(newPage) => setPage(newPage)}
                totalItems={0}
                itemsPerPage={pageSize}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessingTimeOrderPage;
