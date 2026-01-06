// src/features/sales/pages/ModifiedCanceledOrdersPage.tsx
import { useState } from "react";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import { Pagination } from "../../../../components/Pagination";
import ModifiedCanceledOrdersTable from "../../components/Reports/OrderModifiedCanceledReport/ModifiedCanceledOrdersTable";
import GraphModifiedCanceledOrders from "../../components/Reports/OrderModifiedCanceledReport/GraphModifiedCanceledOrders";
import { useModifiedCanceled } from "../../hooks/useModifiedCanceled";
import ModifiedCanceledOrdersFilter from "./SalesFilters/ModifiedCanceledOrdersFilter";
import BackButton from "../../../../components/BackButton";

export type FilterStatus =
  | "Todos"
  | "Pending"
  | "PendingResolution"
  | "reIssued"
  | "PendingReissued"
  | "Canceled";

export const statusMap: Record<string, string> = {
  Pending: "Pendiente",
  PendingResolution: "Pendiente de resolución",
  ReIssued: "Reemitido",
  PendingReissued: "Pendiente de reemision",
  Canceled: "Cancelado por ventas",
};

export default function ModifiedCanceledOrdersPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // BORRADORES
  const [nameDraft, setNameDraft] = useState("");
  const [dateFromDraft, setDateFromDraft] = useState("");
  const [dateToDraft, setDateToDraft] = useState("");
  const [statusDraft, setStatusDraft] = useState<FilterStatus>("Todos");

  // APLICADOS
  const [nameFilter, setNameFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("Todos");

  const [showGraph, setShowGraph] = useState(false);

  const { data: orders, loading, totalPages, refetch } = useModifiedCanceled(page, pageSize);

  const toLocalYMD = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const normalize = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // 🔥 FILTRO FINAL
  const filteredOrders = orders.filter((o: any) => {
    const fullName = `${o.customerFirstName ?? ""} ${o.customerLastName ?? ""}`.trim();

    const matchesName =
      !nameFilter || normalize(fullName).includes(normalize(nameFilter));

    const dateToCheck = o.modifiedDate
      ? new Date(o.modifiedDate)
      : new Date(o.orderDate);

    const ymd = toLocalYMD(dateToCheck);

    const matchesDate =
      (!dateFrom || ymd >= dateFrom) &&
      (!dateTo || ymd <= dateTo);

    const matchesStatus =
      statusFilter === "Todos" ||
      o.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesName && matchesDate && matchesStatus;
  });

  const handleBuscar = () => {
    setNameFilter(nameDraft);
    setDateFrom(dateFromDraft);
    setDateTo(dateToDraft);
    setStatusFilter(statusDraft);
    setPage(1);
  };

  const handleLimpiar = () => {
    setNameDraft("");
    setDateFromDraft("");
    setDateToDraft("");
    setStatusDraft("Todos");

    setNameFilter("");
    setDateFrom("");
    setDateTo("");
    setStatusFilter("Todos");
    setPage(1);
  };

  const handleRefresh = () => {
    // Refresca el reporte completo
    if (refetch) {
      refetch();
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando..." height="h-screen" />;
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/sales/reports/dashboard" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Pedidos Cancelados y Modificados
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Todo lo que necesitas para evaluar los Pedidos cancelados y modificados
        </p>

        {/* Filtros */}
        <div className="mb-4">
          <ModifiedCanceledOrdersFilter
            nameDraft={nameDraft}
            dateFromDraft={dateFromDraft}
            dateToDraft={dateToDraft}
            statusDraft={statusDraft}
            onNameDraftChange={setNameDraft}
            onDateFromDraftChange={setDateFromDraft}
            onDateToDraftChange={setDateToDraft}
            onStatusDraftChange={setStatusDraft}
            onBuscar={handleBuscar}
            onLimpiar={handleLimpiar}
          />
        </div>

        {/* Botones alineados a la derecha, debajo de los filtros */}
        <div className="flex justify-end gap-2 mb-6">
          <button
            onClick={() => setShowGraph(!showGraph)}
            className="px-4 py-2 rounded-lg shadow text-white font-medium bg-blue-600 hover:bg-blue-700 transition flex items-center gap-2 whitespace-nowrap"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
              />
            </svg>
            {showGraph ? "Ocultar Gráfico" : "Mostrar Gráfico"}
          </button>
          
          <button
            onClick={handleRefresh}
            className="px-4 py-2 rounded-lg shadow text-white font-medium bg-red-600 hover:bg-red-700 transition flex items-center gap-2 whitespace-nowrap"
          >
            <svg 
              className="w-5 h-5" 
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
            Refrescar Reporte
          </button>
        </div>

        <ModifiedCanceledOrdersTable
          orders={filteredOrders.map((o: any) => ({
            ...o,
            statusLabel: statusMap[o.status] ?? o.status,
          }))}
        />

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

        {showGraph && (
          <div className="mt-8">
            <GraphModifiedCanceledOrders
              orders={filteredOrders.map((o: any) => ({
                ...o,
                statusLabel: statusMap[o.status] ?? o.status,
              }))}
            />
          </div>
        )}
      </div>
    </div>
  );
}