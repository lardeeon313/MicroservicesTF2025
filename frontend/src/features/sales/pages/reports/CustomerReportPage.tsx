import { useState } from "react";
import CustomerReportTable from "../../components/Reports/CustomerReport/CustomerReportTable";
import GraphCustomerReport from "../../components/Reports/CustomerReport/GraphCustomerReport";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import { useCustomerReport } from "../../hooks/useCustomerReport";
import { Pagination } from "../../../../components/Pagination";
import CustomerReportFilter from "./SalesFilters/CustomerReportFilter";

export default function CustomerReportPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [minOrdersFilter, setMinOrdersFilter] = useState(0);

  const { data: customers, loading, totalPages } = useCustomerReport(page, pageSize);

  const filteredCustomers = customers.filter((c) => {
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    return (
      fullName.includes(nameFilter.toLowerCase()) &&
      c.email.toLowerCase().includes(emailFilter.toLowerCase()) &&
      c.orderCount >= minOrdersFilter
    );
  });

  if (loading) {
    return <LoadingSpinner message="Cargando..." height="h-screen" />;
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="flex items-center justify-between mb-6">
        <Link to="/sales/reports/dashboard" className="text-red-600 hover:underline pl-10">
          ← Volver atrás
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">Clientes y Pedidos</h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Todo lo que necesitás para gestionar los pedidos y clientes
        </p>

        {/* Filtros */}
        <CustomerReportFilter
          onFilterChange={({ name, email, minOrders }) => {
            setNameFilter(name);
            setEmailFilter(email);
            setMinOrdersFilter(minOrders);
            setPage(1); // reiniciar paginación al aplicar filtros
          }}
        />

        <CustomerReportTable data={filteredCustomers} />
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        <GraphCustomerReport data={filteredCustomers} />
      </div>
    </div>
  );
}
