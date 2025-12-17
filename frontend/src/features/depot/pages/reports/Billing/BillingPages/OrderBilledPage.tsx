import { useInvoicedOrdersByCustomer } from "../BillingHocks/useOrderBilled";
import InvoicedOrdersFilter from "../BillingFilters/OrderBilledFilter";
import InvoicedOrdersTable from "../BillingComponents/OrderBilledTable";

import BackButton from "../../../../../../components/BackButton";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import EmptyState from "../../../../../../components/EmptyState";
import { AlertCircle, Search } from "lucide-react";
import { useState } from "react";
import Pagination from "../../../../depotmanager/components/Pagination";

export default function InvoicedOrdersPage() {
  const { data, loading, error, fetchOrders } = useInvoicedOrdersByCustomer();

  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);

  const [filters, setFilters] = useState({
    customerName: "",
    minAmount: undefined as number | undefined,
    maxAmount: undefined as number | undefined,
    period: undefined as "day" | "week" | "month" | "fortnight" | undefined,
  });

  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const handleSearch = (newFilters: {
    customerName?: string;
    fromDate?: string;
    toDate?: string;
    minAmount?: number;
    maxAmount?: number;
    period?: "day" | "week" | "month" | "fortnight";
  }) => {
    setFilters({
      customerName: newFilters.customerName || "",
      minAmount: newFilters.minAmount,
      maxAmount: newFilters.maxAmount,
      period: newFilters.period,
    });

    if (newFilters.fromDate !== undefined) setFromDate(newFilters.fromDate);
    if (newFilters.toDate !== undefined) setToDate(newFilters.toDate);

    fetchOrders({
      customerName: newFilters.customerName || "",
      fromDate: newFilters.fromDate || "",
      toDate: newFilters.toDate || "",
      minAmount: newFilters.minAmount,
      maxAmount: newFilters.maxAmount,
      period: newFilters.period,
    });

    setPage(1);
  };

  const filteredData = data.filter(item => {
    let pass = true;

    if (filters.customerName.trim() !== "") {
      pass = item.customerName
        .toLowerCase()
        .includes(filters.customerName.trim().toLowerCase());
    }

    if (pass && fromDate) {
      pass = new Date(item.orderDate) >= new Date(fromDate);
    }

    if (pass && toDate) {
      const endDate = new Date(toDate);
      endDate.setDate(endDate.getDate() + 1);
      pass = new Date(item.orderDate) < endDate;
    }

    if (pass && filters.minAmount !== undefined) {
      pass = item.totalAmount >= filters.minAmount;
    }

    if (pass && filters.maxAmount !== undefined) {
      pass = item.totalAmount <= filters.maxAmount;
    }

    // 🔥 FILTRO DE PERÍODO EN CLIENTE (opcional)
    if (pass && filters.period) {
      const orderDate = new Date(item.orderDate);
      const now = new Date();
      const diff = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);

      switch (filters.period) {
        case "day":
          pass = diff <= 1;
          break;
        case "week":
          pass = diff <= 7;
          break;
        case "fortnight":
          pass = diff <= 14;
          break;
        case "month":
          pass = diff <= 30;
          break;
      }
    }

    return pass;
  });

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/depot/billingmanager/reports" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
          <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
            Cantidad de pedidos facturados
          </h1>

          <p className="text-center text-lg text-gray-700 mb-12">
            Aquí podrás ver los pedidos facturados agrupados por cliente.
          </p>

          <div className="flex flex-col md:flex-row mb-6 w-full justify-between gap-2">
            <InvoicedOrdersFilter onSearch={handleSearch} />
          </div>

          <div className="mt-12">
            {loading && (
              <LoadingSpinner
                message="Cargando pedidos facturados..."
                height="h-32"
              />
            )}

            {error && (
              <EmptyState
                icon={AlertCircle}
                title="Ha habido un problema"
                description="Se ha detectado un problema al cargar los pedidos facturados."
              />
            )}

            {!loading && !error && filteredData.length > 0 && (
              <>
                <InvoicedOrdersTable data={paginatedData} />

                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                      totalItems={totalItems}
                      itemsPerPage={pageSize}
                    />
                  </div>
                )}
              </>
            )}

            {!loading && !error && filteredData.length === 0 && (
              <EmptyState
                icon={Search}
                title="Sin resultados"
                description="No se encontraron pedidos. Prueba con otro nombre, fecha o monto."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
