import { useState } from "react";
import { useCustomerReport } from "../../hooks/useCustomerReport";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import { Pagination } from "../../../../components/Pagination";
import CustomerInactiveTable from "../../components/Reports/CustomerInactiveReport/CustomerInactiveTable";
import GraphCustomerInactive from "../../components/Reports/CustomerInactiveReport/GraphCustomerInactive";
import CustomerInactiveReportFilter from "./SalesFilters/CustomerInactiveReportFilter";
import { CustomerStatus } from "../../types/CustomerTypes";
import BackButton from "../../../../components/BackButton";

export default function CustomerInactiveReportPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // 🔑 ahora manejamos todos los filtros en un objeto
  const [filters, setFilters] = useState({
    status: "All" as CustomerStatus | "All",
    name: "",
    email: "",
  });

  const { data: customers, loading, totalPages } = useCustomerReport(page, pageSize);

  const filteredCustomers = customers.filter((c) => {
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    const matchesName = fullName.includes(filters.name.toLowerCase());
    const matchesEmail = c.email.toLowerCase().includes(filters.email.toLowerCase());
    const matchesStatus = filters.status === "All" || c.status === filters.status;

    return matchesName && matchesEmail && matchesStatus;
  });

  if (loading) {
    return <LoadingSpinner message="Cargando..." height="h-screen" />;
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/sales/reports/dashboard"></BackButton>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">Estado de los clientes</h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Aquí podrás visualizar cómo se encuentra el estado del cliente con respecto a sus pedidos.
        </p>

        <div className="flex flex-col md:flex-row mb-4 w-full justify-between gap-2">
          <CustomerInactiveReportFilter
            selectedStatus={filters.status}
            selectedName={filters.name}
            selectedEmail={filters.email}
            onChange={setFilters}
            onSearch={(f) => console.log("Buscar con filtros:", f)}
            onClear={() => console.log("Filtros reseteados")}
          />
        </div>

        <CustomerInactiveTable data={filteredCustomers} />
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        <GraphCustomerInactive customers={filteredCustomers} />
      </div>
    </div>
  );
}
