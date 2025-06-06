// src/features/sales/pages/CustomerReportPage.tsx
import { useState } from "react";
import CustomerReportTable from "../../components/Reports/CustomerReport/CustomerReportTable";
import GraphCustomerReport from "../../components/Reports/CustomerReport/GraphCustomerReport";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import { useCustomerReport } from "../../hooks/useCustomerReport";
import { Pagination } from "../../../../components/Pagination";

export default function CustomerReportPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");

  const { data: customers, loading, totalPages } = useCustomerReport(page, pageSize);

  const filteredCustomers = customers.filter((c) => {
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    return (
      fullName.includes(nameFilter.toLowerCase()) &&
      c.email.toLowerCase().includes(emailFilter.toLowerCase())
    );
  });

  if (loading) 
    return (
      <LoadingSpinner message="Cargando..." height="h-screen"/>
    )


  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
        <div className="flex items-center justify-between mb-6">
            <Link to="/sales/reports/dashboard" className="text-red-600 hover:underline pl-10">
            ← Volver atras 
            </Link>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-center text-4xl font-bold text-red-600 mb-2">Clientes y Pedidos</h1>
            <p className="text-center text-lg text-gray-700 mb-12">
            Todo lo que necesitás para gestionar los pedidos y clientes
            </p>
            <div className="flex flex-col md:flex-row mb-4 w-full justify-between">
                <input
                    type="text"
                    placeholder="Filtrar por Nombre"
                    className="border border-gray-300 rounded px-3 py-2 focus:bg-red-100 focus:outline-gray-400 focus:transition-colors focus:duration-500 outline-gray-200 "
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Filtrar por Email"
                    className="border border-gray-300 rounded px-3 py-2 focus:bg-red-100 focus:outline-gray-400 focus:transition-colors focus:duration-500 outline-gray-200"
                    value={emailFilter}
                    onChange={(e) => setEmailFilter(e.target.value)}
                />
            </div>
        
            
            <CustomerReportTable data={filteredCustomers} />
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage}/>

            <GraphCustomerReport data={filteredCustomers} />
        </div>
    </div>
  );
};
