// src/features/sales/pages/ModifiedCanceledOrdersPage.tsx
import { useState } from "react";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import { Link } from "react-router-dom";
import { Pagination } from "../../../../components/Pagination";
import ModifiedCanceledOrdersTable from "../../components/Reports/OrderModifiedCanceledReport/ModifiedCanceledOrdersTable";
import GraphModifiedCanceledOrders from "../../components/Reports/OrderModifiedCanceledReport/GraphModifiedCanceledOrders";
import { useModifiedCanceled } from "../../hooks/useModifiedCanceled";
import ModifiedCanceledOrdersFilter from "./SalesFilters/ModifiedCanceledOrdersFilter";

// SOLO las opciones que usás en filtros
export type FilterStatus = "Todos" | "Pending" | "Issued" | "Canceled";

// Mapa inglés → español para mostrar en UI
export const statusMap: Record<string, string> = {
  Pending: "Pendiente",
  Issued: "Emitido",
  Confirmed: "Confirmado por depósito",
  InPreparation: "En preparación",
  Prepared: "Preparado",
  SentToBilling: "Enviado a facturar",
  Invoiced: "Facturado",
  Verify: "Verificado",
  OnTheWay: "En camino",
  Delivered: "Entregado",
  Canceled: "Cancelado por ventas",
  PendingResolution: "Pendiente de resolución",
  ReIssued: "Reemitido",
};

export default function ModifiedCanceledOrdersPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Filtros en edición (inputs)
  const [nameDraft, setNameDraft] = useState("");
  const [dateDraft, setDateDraft] = useState(""); 
  const [statusDraft, setStatusDraft] = useState<FilterStatus>("Todos");

  // Filtros aplicados (solo se actualizan al tocar Buscar)
  const [nameFilter, setNameFilter] = useState("");
  const [modifiedDate, setModifiedDate] = useState(""); 
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("Todos");

  const { data: orders, loading, totalPages } = useModifiedCanceled(page, pageSize);

  const toLocalYMD = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const normalize = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const filteredOrders = orders.filter((o: any) => {
    const fullName = o.customerInfo
      ? `${o.customerInfo.firstName ?? ""} ${o.customerInfo.lastName ?? ""}`.trim()
      : "";
    const matchesName =
      !nameFilter || normalize(fullName).includes(normalize(nameFilter));

    const raw = o.modifiedDate ?? o.orderDate;
    const d = raw ? new Date(raw) : null;
    const matchesDate = !modifiedDate || (d && toLocalYMD(d) === modifiedDate);

    const matchesStatus =
      statusFilter === "Todos" || o.status === statusFilter;

    return matchesName && matchesDate && matchesStatus;
  });

  if (loading) {
    return <LoadingSpinner message="Cargando..." height="h-screen" />;
  }

  const handleBuscar = () => {
    setNameFilter(nameDraft);
    setModifiedDate(dateDraft);
    setStatusFilter(statusDraft);
    setPage(1);
  };

  const handleLimpiar = () => {
    setNameDraft("");
    setDateDraft("");
    setStatusDraft("Todos");
    setNameFilter("");
    setModifiedDate("");
    setStatusFilter("Todos");
    setPage(1);
  };

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="flex items-center justify-between mb-6">
        <Link to="/sales/reports/dashboard" className="text-red-600 hover:underline pl-10">
          ← Volver atrás
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Clientes y Pedidos
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Pedidos cancelados y modificados
        </p>

        {/* Filtros con Buscar y Limpiar */}
        <ModifiedCanceledOrdersFilter
          nameDraft={nameDraft}
          dateDraft={dateDraft}
          statusDraft={statusDraft}
          onNameDraftChange={setNameDraft}
          onDateDraftChange={setDateDraft}
          onStatusDraftChange={setStatusDraft}
      onBuscar={handleBuscar}
  onLimpiar={handleLimpiar}
        />

        {/* Tabla */}
        <ModifiedCanceledOrdersTable
          orders={filteredOrders.map((o: any) => ({
            ...o,
            statusLabel: statusMap[o.status] ?? o.status,
          }))}
        />

        {/* Paginación */}
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

        {/* Gráfico */}
        <GraphModifiedCanceledOrders orders={filteredOrders} />
      </div>
    </div>
  );
}
