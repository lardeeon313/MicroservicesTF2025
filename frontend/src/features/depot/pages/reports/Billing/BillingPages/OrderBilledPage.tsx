import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useOrderBilled } from "../BillingHocks/useOrderBilled";

import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import { Pagination } from "../../../../../../components/Pagination";
import OrderBilledTable from "../BillingComponents/OrderBilledTable";
import OrderBilledGraph from "../BillingGraphs/GraphOrderBilled";
import OrderBilledFilter from "../BillingFilters/OrderBilledFilter"; // IMPORTANTE

const OrderBilledPage: React.FC = () => {
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const { data, loading, error, totalpages } = useOrderBilled(page, pageSize);

    const [idFilter, setIdFilter] = useState("");
    const [orderDateFilter, setOrderDateFilter] = useState("");
    const [billingDateFilter, setBillingDateFilter] = useState("");

    if (loading) {
        return <LoadingSpinner message="cargando los datos..." height="h-screen" />;
    }

    const filteredData = data.filter((item) => {
        const matchesId = idFilter === "" || item.OrderId.toString().includes(idFilter);
        const matchesOrderDate = orderDateFilter === "" || item.dateOrder.includes(orderDateFilter);
        const matchesBillingDate = billingDateFilter === "" || item.dateBilling.includes(billingDateFilter);
        return matchesId && matchesOrderDate && matchesBillingDate;
    });

    return (
        <div className="container m-0 pt-10 min-w-full min-h-full">
            <div className="flex items-center justify-between mb-6">
                <Link to={"/depot/depotmanager/reports/Dashboard"} className="text-red-600 hover:underline pl-10">
                    ← Volver atrás
                </Link>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
                    Totalidad de pedidos facturados:
                </h1>
                <p className="text-center text-lg text-gray-700 mb-12">
                    Aquí vas a poder visualizar todos los pedidos que ya han sido facturados por el encargado de facturación
                </p>

                <div className="w-full mb-6">
                    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-6 items-center">
                    {/* Input centrado */}
                        <input
                            type="text"
                            placeholder="🔍 Filtrar por ID de pedido"
                            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200 text-center"
                            value={idFilter}
                            onChange={(e) => setIdFilter(e.target.value)}
                        />

                    {/* Componente de filtros por fechas */}
                    <OrderBilledFilter
                        orderDate={orderDateFilter}
                        billingDate={billingDateFilter}
                        onOrderDateChange={setOrderDateFilter}
                        onBillingDateChange={setBillingDateFilter}
                    />
                    </div>
                </div>


                {error ? (
                    <p className="text-red-600 text-center">{error}</p>
                ) : (
                    <>
                        <OrderBilledTable data={filteredData} />
                        <OrderBilledGraph data={filteredData} />
                        <Pagination currentPage={page} totalPages={totalpages} onPageChange={setPage} />
                    </>
                )}
            </div>
        </div>
    );
};

export default OrderBilledPage;
