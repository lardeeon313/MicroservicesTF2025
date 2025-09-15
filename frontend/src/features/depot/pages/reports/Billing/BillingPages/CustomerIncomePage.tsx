import React, { useState } from "react";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import { Pagination } from "../../../../../../components/Pagination";
import CustomerIncomeTable, {
  CustomerIncomeBillingItem,
} from "../BillingComponents/CustomerIncomeTable";
import GraphCustomerIncome from "../BillingGraphs/GraphCustomerIncome";
import type { Billing } from "../../../../billingmanager/types/BillingType";
import { useCustomerIncome } from "../BillingHocks/useCustomerIncome";
import CustomerIncomeFilter from "../BillingFilters/CustomerIncomeFilter";
import BackButton from "../../../../../../components/BackButton";

/** Normaliza a YYYY-MM-DD para comparar sin problemas de locale/timezone */
const toYMD = (value: string | Date): string => {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

/** Para mostrar en la tabla como dd/mm/aaaa */
const toDMY = (value: string | Date): string => {
  const ymd = toYMD(value);
  if (!ymd) return "";
  const [y, m, d] = ymd.split("-");
  return `${d}/${m}/${y}`;
};

const CustomerIncomePage: React.FC = () => {

  const { orders, loading, error } = useCustomerIncome();

  // filtros (fecha única)
  const [filters, setFilters] = useState<{
    customerName: string;
    date: string;          // YYYY-MM-DD (tal como lo emite el input date)
    totalAmount?: string;  // string para permitir limpiar
  }>({
    customerName: "",
    date: "",
    totalAmount: "",
  });

  // paginación
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);

  // aplicar filtros (comparando YYYY-MM-DD)
  const filteredOrders = orders.filter((o) => {
    let ok = true;

    if (filters.customerName.trim()) {
      ok =
        ok &&
        o.customerName
          .toLowerCase()
          .includes(filters.customerName.trim().toLowerCase());
    }

    if (filters.date) {
      ok = ok && toYMD(o.orderDate) === filters.date;
    }

    if (filters.totalAmount && filters.totalAmount !== "") {
      ok = ok && Number(o.totalAmount) === Number(filters.totalAmount);
    }

    return ok;
  });

  // paginados
  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/depot/billingmanager/reports"></BackButton>
      
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
          <h1 className="text-center text-4xl font-bold text-red-600 mb-8">
            Ingresos por Cliente
          </h1>

          {/* Filtros */}
          <CustomerIncomeFilter
            filters={filters}
            onChange={setFilters}
            onSearch={() => setPage(1)}
            onClear={() => {
              setFilters({ customerName: "", date: "", totalAmount: "" });
              setPage(1);
            }}
          />

          {/* estados */}
          {loading && <LoadingSpinner />}
          {error && <p className="text-red-500">{error}</p>}

          {/* tabla */}
          <div className="bg-white p-4 shadow-md">
            <CustomerIncomeTable
              data={paginatedOrders.map(
                (item: Billing): CustomerIncomeBillingItem => ({
                  customerName: item.customerName,
                  customerEmail: item.customerEmail,
                  billingDate: toDMY(item.orderDate), // dd/mm/aaaa
                  totalAmount: item.totalAmount,
                })
              )}
            />
          </div>

          {/* gráfico */}
          <div className="bg-white p-4 shadow-md">
            <GraphCustomerIncome
              data={filteredOrders.map((item: Billing) => ({
                BillingDate: toDMY(item.orderDate), // dd/mm/aaaa
                TotalAmount: item.totalAmount,
              }))}
            />
          </div>

          {/* paginación */}
          <div className="flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerIncomePage;
