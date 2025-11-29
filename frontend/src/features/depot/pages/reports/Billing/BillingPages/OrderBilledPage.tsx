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

  // Paginación
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);

  // Estados de filtros locales
  const [filters, setFilters] = useState({
    customerName: "",
    minAmount: undefined as number | undefined,
    maxAmount: undefined as number | undefined,
  });

  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  // Recibe filtros desde el componente visual
  const handleSearch = (newFilters: {
    customerName?: string;
    fromDate?: string;
    toDate?: string;
    minAmount?: number;
    maxAmount?: number;
  }) => {
    setFilters({
      customerName: newFilters.customerName || "",
      minAmount: newFilters.minAmount,
      maxAmount: newFilters.maxAmount,
    });

    if (newFilters.fromDate !== undefined) setFromDate(newFilters.fromDate);
    if (newFilters.toDate !== undefined) setToDate(newFilters.toDate);

    fetchOrders({
  customerName: newFilters.customerName || "",
  fromDate: newFilters.fromDate || "",
  toDate: newFilters.toDate || "",
  minAmount: newFilters.minAmount,
  maxAmount: newFilters.maxAmount,
});


    setPage(1);
  };

  // 🔍 Filtrado en cliente
  const filteredData = data.filter(item => {
    let pass = true;

    if (filters.customerName.trim() !== "") {
      pass = item.customerName.toLowerCase().includes(filters.customerName.trim().toLowerCase());
    }

    if (pass && fromDate) {
      pass = new Date(item.orderDate) >= new Date(fromDate);
    }

    if (pass && toDate) {
      const endDate = new Date(toDate);
      endDate.setDate(endDate.getDate() + 1);
      pass = new Date(item.orderDate) < endDate;
    }

    // 💰 Filtro mínimo
    if (pass && filters.minAmount !== undefined) {
      pass = item.totalAmount >= filters.minAmount;
    }

    // 💰 Filtro máximo
    if (pass && filters.maxAmount !== undefined) {
      pass = item.totalAmount <= filters.maxAmount;
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
            Pedidos facturados por cliente
          </h1>

          <p className="text-center text-lg text-gray-700 mb-12">
            Aquí podrás ver los pedidos facturados agrupados por cliente.
          </p>

          <div className="flex flex-col md:flex-row mb-6 w-full justify-between gap-2">
            <InvoicedOrdersFilter onSearch={handleSearch} />
          </div>

          <div className="mt-12">
            {loading && <LoadingSpinner message="Cargando pedidos facturados..." height="h-32" />}

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
