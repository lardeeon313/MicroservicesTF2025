import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCustomerIncome } from "../BillingHocks/useCustomerIncome";

import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import { Pagination } from "../../../../../../components/Pagination";
import CustomerIncomeTable from "../BillingComponents/CustomerIncomeTable";
import GraphCustomerIncome from "../BillingGraphs/GraphCustomerIncome";
import CustomerIncomeFilter from "../BillingFilters/CustomerIncomeFilter";

const CustomerIncomePage: React.FC = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // filtros
  const [idFilter, setIdFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchParams, setSearchParams] = useState({ startDate: "", endDate: "" });

  const { data, loading, error, totalPages } = useCustomerIncome(
    searchParams.startDate,
    searchParams.endDate,
    page,
    pageSize
  );

  const handleSearch = () => {
    setSearchParams({ startDate, endDate });
    setPage(1); // volver a la primera página al buscar
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setSearchParams({ startDate: "", endDate: "" });
    setPage(1);
  };

  const filteredData = data.filter((item) =>
    item.orderID.toString().includes(idFilter)
  );

  if (loading) {
    return <LoadingSpinner message="Cargando los datos..." height="h-screen" />;
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="flex items-center justify-between mb-6">
        <Link
          to={"/depot/billingmanager/reports"}
          className="text-red-600 hover:underline pl-10"
        >
          ← Volver atrás
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Ingresos generados por los clientes:
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Aquí podrás ver todos los ingresos que fueron generados por los
          distintos clientes luego de hacer la facturación.
        </p>

        {/* FILTROS */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-6 w-full max-w-5xl mx-auto">
          {/* Filtro por ID */}
          <label className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-red-500 transition-all w-full lg:w-1/3">
            <input
              type="text"
              placeholder="Filtrar por ID de pedido"
              className="w-full bg-transparent outline-none text-sm placeholder-gray-500"
              value={idFilter}
              onChange={(e) => setIdFilter(e.target.value)}
            />
          </label>

          {/* Filtro por fechas con botones */}
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-2/3">
            <CustomerIncomeFilter
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onSearch={handleSearch}
              onClear={handleClear}
            />
          </div>
        </div>

        {/* RESULTADOS */}
        {error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : (
          <>
            <CustomerIncomeTable
              data={filteredData.map((item) => ({
                orderid: item.orderID,
                billingDate: item.billingDate,
                totalAmount: item.totalAmount,
              }))}
            />
            <GraphCustomerIncome
              data={filteredData.map((item) => ({
                BillingDate: item.billingDate,
                TotalAmount: item.totalAmount,
              }))}
            />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerIncomePage;

