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

  const { data: orders, loading, totalPages } = useModifiedCanceled(page, pageSize);

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

  if (loading) {
    return <LoadingSpinner message="Cargando..." height="h-screen" />;
  }

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

        {/* 🔥 NUEVO: filtros con 2 fechas */}
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

        <ModifiedCanceledOrdersTable
          orders={filteredOrders.map((o: any) => ({
            ...o,
            statusLabel: statusMap[o.status] ?? o.status,
          }))}
        />

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

        <div className="flex justify-center mt-6 mb-4">
          <button
            onClick={() => setShowGraph((prev) => !prev)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            {showGraph ? "Ocultar gráfico" : "Mostrar gráfico"}
          </button>
        </div>

        {showGraph && (
          <GraphModifiedCanceledOrders
            orders={filteredOrders.map((o: any) => ({
              ...o,
              statusLabel: statusMap[o.status] ?? o.status,
            }))}
          />
        )}
      </div>
    </div>
  );
}
