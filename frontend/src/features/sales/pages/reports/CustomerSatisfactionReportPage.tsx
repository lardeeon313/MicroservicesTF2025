import React, { useState } from "react";
import { Pagination } from "../../../../components/Pagination";
import { useCustomerSatisfaction } from "../../hooks/useCustomerSatisfaction";
import { CustomerSatisfactionTable } from "../../components/Reports/CustomerSatisfactionReport/CustomerSatisfactionTable";
import { GraphSatisfactionCustomer } from "../../components/Reports/CustomerSatisfactionReport/GraphCustomerSatisfaction";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import { Link } from "react-router-dom";
//filter actualizado:
import CustomerSatisfactionFilter from "./SalesFilters/CustomerSatisfactionFilter";

const CustomerSatisfactionReportPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // 🔑 Ahora un solo objeto con todos los filtros
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    satisfaction: "Todas" as "Todas" | "Positiva" | "Negativa" | "Neutra",
  });

  const { data: customers, loading, totalPages } = useCustomerSatisfaction(page, pageSize);

  const filteredCustomers = customers.filter((c) => {
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    const matchesName = fullName.includes(filters.name.toLowerCase());
    const matchesEmail = c.email.toLowerCase().includes(filters.email.toLowerCase());
    const matchesSatisfaction =
      filters.satisfaction === "Todas" || c.satisfaction === filters.satisfaction;

    return matchesName && matchesEmail && matchesSatisfaction;
  });

  if (loading) return <LoadingSpinner message="Cargando..." height="h-screen" />;

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

        {/* 🔑 Usamos el nuevo filtro */}
        <div className="flex flex-col md:flex-row mb-4 w-full justify-between gap-2">
          <CustomerSatisfactionFilter
            selectedName={filters.name}
            selectedEmail={filters.email}
            selectedSatisfaction={filters.satisfaction}
            onChange={setFilters}
            onSearch={(f) => console.log("Buscar con filtros:", f)}
            onClear={() => console.log("Filtros reseteados")}
          />
        </div>

        <CustomerSatisfactionTable data={filteredCustomers} />
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        <GraphSatisfactionCustomer customers={filteredCustomers} />
      </div>
    </div>
  );
};

export default CustomerSatisfactionReportPage;
