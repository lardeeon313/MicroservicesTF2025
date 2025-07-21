import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCustomerIncome } from "../BillingHocks/useCustomerIncome";

import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import { Pagination } from "../../../../../../components/Pagination";
import CustomerIncomeTable from "../BillingComponents/CustomerIncomeTable";
import GraphCustomerIncome from "../BillingGraphs/GraphCustomerIncome";

// filtros:
import CustomerIncomeFilter from "../BillingFilters/CustomerIncomeFilter";

const CustomerIncomePage: React.FC = () => {
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const { data, loading, error, totalPages } = useCustomerIncome(page, pageSize);

    const [idfilter, setIdfilter] = useState("");
    const [ageFilter, setAgeFilter] = useState("");

    // 🔍 Aplica ambos filtros: ID de pedido y antigüedad desde la fecha de facturación
    const filteredData = data.filter((item) => {
        const matchesId = item.orderID.toString().includes(idfilter);

        const billingYear = new Date(item.billingDate).getFullYear();
        const currentYear = new Date().getFullYear();
        const yearsSinceBilling = currentYear - billingYear;

        const matchesAge = ageFilter ? yearsSinceBilling >= Number(ageFilter) : true;

        return matchesId && matchesAge;
    });

    if (loading) {
        return <LoadingSpinner message="cargando los datos..." height="h-screen" />
    }

    return (
        <div className="container m-0 pt-10 min-w-full min-h-full">
            <div className="flex items-center justify-between mb-6">
                <Link to={"/depot/depotmanager/reports/Dashboard"} className="text-red-600 hover:underline pl-10">
                    ← Volver atrás
                </Link>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
                    Ingresos generados por los clientes:
                </h1>
                <p className="text-center text-lg text-gray-700 mb-12">
                    Aqui podras ver todos los ingresos que fueron generados por los distintos clientes
                    luego de hacer la facturacion.
                </p>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 w-full max-w-4xl mx-auto">
                    <div className="w-full md:w-1/2">
                        <label className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-red-500 transition-all">
                            <input
                                type="text"
                                placeholder="Filtrar por ID de pedido"
                                className="w-full bg-transparent outline-none text-sm placeholder-gray-500"
                                value={idfilter}
                                onChange={(e) => setIdfilter(e.target.value)}
                            />
                        </label>
                    </div>

                    <div className="w-full md:w-1/2">
                        <CustomerIncomeFilter
                        ageFilter={ageFilter}
                        onAgeFilterChange={setAgeFilter}
                        />
                    </div>
                </div>

                {error ? (
                    <p className="text-red-600 text-center">{error}</p>
                ) : (
                    <>
                        <CustomerIncomeTable data={
                            filteredData.map(item => ({
                                orderid: item.orderID,
                                billingDate: item.billingDate,
                                totalAmount: item.totalAmount
                            }))
                        } />
                        <GraphCustomerIncome data={
                            filteredData.map(item => ({
                                BillingDate: item.billingDate,
                                TotalAmount: item.totalAmount
                            }))
                        } />
                        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                    </>
                )}
            </div>
        </div>
    );
};

export default CustomerIncomePage;
