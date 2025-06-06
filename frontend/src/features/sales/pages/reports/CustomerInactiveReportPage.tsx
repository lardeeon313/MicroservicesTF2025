import { useState } from "react";
import { useCustomerReport } from "../../hooks/useCustomerReport";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import { Link } from "react-router-dom";
import { Pagination } from "../../../../components/Pagination";
import CustomerInactiveTable from "../../components/Reports/CustomerInactiveReport/CustomerInactiveTable";
import GraphCustomerInactive from "../../components/Reports/CustomerInactiveReport/GraphCustomerInactive";


export default function CustomerInactiveReportPage() {
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
            <h1 className="text-center text-4xl font-bold text-red-600 mb-2">Estado de los clientes</h1>
            <p className="text-center text-lg text-gray-700 mb-12">
            Aqui podras visualizar como se encuentra el estado del cliente con respecto a sus pedidos.
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
            <CustomerInactiveTable data={filteredCustomers}/>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage}/>
            <GraphCustomerInactive customers={filteredCustomers}/>
        </div>
    </div>
    )
}