import { useState } from "react";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import { Link } from "react-router-dom";
import { Pagination } from "../../../../components/Pagination";
import ModifiedCanceledOrdersTable from "../../components/Reports/OrderModifiedCanceledReport/ModifiedCanceledOrdersTable";
import GraphModifiedCanceledOrders from "../../components/Reports/OrderModifiedCanceledReport/GraphModifiedCanceledOrders";
import { useModifiedCanceled } from "../../hooks/useModifiedCanceled";
//filter: 
import ModifiedCanceledOrdersFilter from "./SalesFilters/ModifiedCanceledOrdersFilter";

export default function ModifiedCanceledOrdersPage() {
    const [page, setPage] = useState(1);
    const pageSize = 10; 

    const [nameFilter, setNameFilter] = useState("");
    const [emailFilter, setEmailFilter] = useState("");

    //datos y set para utilizar los filtros tanto por la fecha de modificacion y status: 
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [statusFilter, setStatusFilter] = useState<"Todos" | "Canceled" | "Issued" | "Pending">("Todos");


    const { data: orders, loading, totalPages } = useModifiedCanceled(page, pageSize);

    const filteredOrders = orders.filter((o) => {
        const fullName = `${o.customerFirstName} ${o.customerLastName}`.toLowerCase();
        const matchesName = fullName.includes(nameFilter.toLowerCase());
        const matchesEmail = o.customer?.email.toLowerCase().includes(emailFilter.toLowerCase());

        const orderDate = new Date(o.orderDate); // ⚠️ reemplazar por el campo correcto
        const matchesDate =
            (!fromDate || orderDate >= new Date(fromDate)) &&
            (!toDate || orderDate <= new Date(toDate));

        return matchesName && matchesEmail && matchesDate;
    });
    
    if (loading)
        return (
            <LoadingSpinner message="Cargando..." height="h-screen" />
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
                Pedidos cancelados y Modificados
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
                <ModifiedCanceledOrdersFilter fromDate={fromDate} toDate={toDate} statusFilter={statusFilter} onFromDateChange={setFromDate} onToDateChange={setToDate} onStatusFilterChange={setStatusFilter}/>
                <ModifiedCanceledOrdersTable orders={filteredOrders}/>
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage}/>
                <GraphModifiedCanceledOrders orders={filteredOrders}/>
            </div>
        </div>
    )
}