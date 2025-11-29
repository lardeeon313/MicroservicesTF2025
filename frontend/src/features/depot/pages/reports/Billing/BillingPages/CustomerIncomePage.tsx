import React, { useState } from "react";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import { Pagination } from "../../../../../../components/Pagination";
import CustomerIncomeTable, {
  CustomerIncomeBillingItem,
} from "../BillingComponents/CustomerIncomeTable";

import type { Billing } from "../../../../billingmanager/types/BillingType";
import { useCustomerIncome } from "../BillingHocks/useCustomerIncome";
import CustomerIncomeFilter from "../BillingFilters/CustomerIncomeFilter";
import BackButton from "../../../../../../components/BackButton";
import EmptyState from "../../../../../../components/EmptyState";
import { AlertCircle, Calendar } from "lucide-react";

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
/*const toDMY = (value: string | Date): string => {
  const ymd = toYMD(value);
  if (!ymd) return "";
  const [y, m, d] = ymd.split("-");
  return `${d}/${m}/${y}`;
};*/

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
          <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
            Ingresos por Cliente
          </h1>
          <p className="text-center text-lg text-gray-700 mb-12">
            Aquí podrás ver los ingresos generados por cada cliente en una fecha especifica.
          </p>

          <div className="flex flex-col md:flex-row mb-4 w-full justify-between gap-2">
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
          </div>

          {/* Estados de tabla */}
          <div className="mt-12">
            {/* 1️⃣ Si no hay fecha seleccionada */}
            {!filters.date ? (
              <EmptyState
                icon={Calendar}
                title="Aplica algun filtro para ver resultados"
                description="Para visualizar los ingresos por cliente, utiliza los filtros superiores y elige una fecha."
                actionLabel="Ir a filtros"
                onAction={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              />
            ) : (
              <>
                {/* 2️⃣ Loading */}
                {loading && <LoadingSpinner />}

                {/* 3️⃣ Error */}
                {error && (
                  <EmptyState
                    icon={AlertCircle}
                    title="Ha habido un problema"
                    description={error}
                  />
                )}

                {/* 4️⃣ Tabla + Gráfico si hay datos */}
                {!loading && !error && filteredOrders.length > 0 && (
                  <>
                    <div className="bg-white p-4 shadow-md mb-6">
                      <CustomerIncomeTable
                        data={paginatedOrders.map(
                          (item: Billing): CustomerIncomeBillingItem => ({
                            customerName: item.customerName,
                            customerEmail: item.customerEmail,
                            billingDate: item.orderDate ,
                            totalAmount: item.totalAmount,
                          })
                        )}
                      />
                    </div>

                    {/* 5️⃣ Paginación */}
                    {totalPages > 1 && (
                      <div className="flex justify-center mt-8">
                        <Pagination
                          currentPage={page}
                          totalPages={totalPages}
                          onPageChange={setPage}
                        />
                      </div>
                    )}
                  </>
                )}

                {/* 6️⃣ EmptyState si no hay resultados */}
                {!loading && !error && filteredOrders.length === 0 && (
                  <EmptyState
                    icon={AlertCircle}
                    title="Sin resultados"
                    description="No se encontraron ingresos para los filtros seleccionados. Intenta con otro cliente o fecha."
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerIncomePage;
