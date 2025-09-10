import React, { useState } from "react";
import { Pagination } from "../../../../components/Pagination";
import { useCustomerSatisfaction } from "../../hooks/useCustomerSatisfaction";
import { CustomerSatisfactionTable } from "../../components/Reports/CustomerSatisfactionReport/CustomerSatisfactionTable";
import { GraphSatisfactionCustomer } from "../../components/Reports/CustomerSatisfactionReport/GraphCustomerSatisfaction";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import { Link } from "react-router-dom";
import CustomerSatisfactionFilter from "./SalesFilters/CustomerSatisfactionFilter";

const CustomerSatisfactionReportPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Filtros aplicados (solo cambian cuando presiono Buscar)
  const [appliedFilters, setAppliedFilters] = useState({
    name: "",
    email: "",
    satisfaction: "Todas" as "Todas" | "Positiva" | "Negativa" | "Neutra",
  });

  const { data: customers, loading, totalPages } = useCustomerSatisfaction(page, pageSize);

  // Filtrado usando los filtros aplicados
  const filteredCustomers = customers.filter((c) => {
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    return (
      fullName.includes(appliedFilters.name.toLowerCase()) &&
      c.email.toLowerCase().includes(appliedFilters.email.toLowerCase())
    );
  });

  const satisfactionFilteredCustomers = filteredCustomers.filter((c) => {
    if (appliedFilters.satisfaction === "Todas") return true;
    return c.satisfaction === appliedFilters.satisfaction;
  });

  if (loading)
    return <LoadingSpinner message="Cargando..." height="h-screen" />;

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
        <CustomerSatisfactionFilter
          selectedName={appliedFilters.name}
          selectedEmail={appliedFilters.email}
          selectedSatisfaction={appliedFilters.satisfaction}
          onSearch={(filters) => {
            setPage(1); // reseteo paginación
            setAppliedFilters(filters);
          }}
          onClear={() => {
            setPage(1);
            setAppliedFilters({ name: "", email: "", satisfaction: "Todas" });
          }}
        />

        {/* Tabla + Paginación + Gráfico */}
        <CustomerSatisfactionTable data={satisfactionFilteredCustomers} />
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        <GraphSatisfactionCustomer customers={satisfactionFilteredCustomers} />
      </div>
    </div>
  );
};

export default CustomerSatisfactionReportPage;
