import { useMemo, useState } from "react";

import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import { Pagination } from "../../../../../../components/Pagination";
import BackButton from "../../../../../../components/BackButton";

import { AdminModifiedCanceledOrdersTable } from "../Components/AdminModifiedCanceledOrdersTable";
import AdminGraphModifiedCanceledOrders from "../Graphs/AdminGraphModifiedCanceledOrders";
import AdminModifiedCanceledOrdersFilter from "../Filters/AdminModifiedCanceledOrdesFilter";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { ADMINuseModifiedCanceledOrders } from "../Hocks/AdminModifiedCanceledOrdersHock";

import {
  ModifiedCanceledOrder,
  ModifiedCanceledOrderStatus,
  ModifiedCanceledFilters,
} from "../Types/ModifiedCanceledReportType";


export type FilterStatus = ModifiedCanceledOrderStatus | "Todos";

export default function AdminModifiedCanceledOrdersPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  
  const [nameDraft, setNameDraft] = useState("");
  const [dateFromDraft, setDateFromDraft] = useState("");
  const [dateToDraft, setDateToDraft] = useState("");
  const [statusDraft, setStatusDraft] = useState<FilterStatus>("Todos");

 
  const [nameFilter, setNameFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("Todos");

  const [showGraph, setShowGraph] = useState(true);


  const filters: ModifiedCanceledFilters = useMemo(
    () => ({
      customerName: nameFilter || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      status: statusFilter === "Todos" ? undefined : statusFilter,
    }),
    [nameFilter, dateFrom, dateTo, statusFilter]
  );

  /* -------- DATA -------- */
  const {
    data: orders,
    loading,
    totalPages,
    refetch,
  } = ADMINuseModifiedCanceledOrders(page, pageSize, filters);

  /* -------- UTILS -------- */
  const normalize = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  /* -------- FILTRO FRONT (visual) -------- */
  const filteredOrders: ModifiedCanceledOrder[] = orders.filter((o) => {
    const matchesName =
      !nameFilter ||
      normalize(o.customerFullName).includes(normalize(nameFilter));

    const dateToCheck = o.modifiedDate ?? o.orderDate;

    const matchesDate =
      (!dateFrom || dateToCheck >= dateFrom) &&
      (!dateTo || dateToCheck <= dateTo);

    const matchesStatus =
      statusFilter === "Todos" || o.status === statusFilter;

    return matchesName && matchesDate && matchesStatus;
  });

  /* -------- ACTIONS -------- */
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
    refetch();
  };

  /* -------- LOADING -------- */
  if (loading) {
    return <LoadingSpinner message="Cargando..." height="h-screen" />;
  }

  /* -------- RENDER -------- */
  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/admin/reports/sales" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Pedidos Cancelados y Modificados
        </h1>

        <p className="text-center text-lg text-gray-700 mb-12">
          Todo lo que necesitas para evaluar los pedidos cancelados y modificados
        </p>

        {/* FILTROS */}
        <div className="mb-4">
          <AdminModifiedCanceledOrdersFilter
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

        {/* BOTONES */}
        <div className="flex justify-end gap-2 mb-6">
          <button
            onClick={() => setShowGraph(!showGraph)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg shadow text-white font-medium bg-blue-600 hover:bg-blue-700 transition"
          >
            {showGraph ? <EyeOff size={20} /> : <Eye size={20} />}
            {showGraph ? "Ocultar Gráfico" : "Mostrar Gráfico"}
          </button>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 rounded-lg shadow text-white font-medium bg-red-600 hover:bg-red-700 transition"
          >
            <RefreshCw size={20} />
            Refrescar Reporte
          </button>
        </div>

        {/* TABLA */}
        <AdminModifiedCanceledOrdersTable orders={filteredOrders} />

        {/* PAGINACIÓN */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />

        {/* GRÁFICO */}
        {showGraph && (
          <div className="mt-8">
            <AdminGraphModifiedCanceledOrders orders={filteredOrders} />
          </div>
        )}
      </div>
    </div>
  );
}
