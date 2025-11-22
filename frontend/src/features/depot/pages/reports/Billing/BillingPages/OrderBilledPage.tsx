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

  // Filtros
  const [filters, setFilters] = useState({ customerName: "" });

  const handleSearch = (newFilters: { customerName?: string }) => {
    setFilters({ customerName: newFilters.customerName || "" });
    fetchOrders(newFilters);
    setPage(1);
  };

  // Filtrado de datos en el cliente
  const filteredData = data.filter((item) => {
    if (filters.customerName.trim() === "") {
      return true;
    }
    return item.customerName.toLowerCase().includes(filters.customerName.trim().toLowerCase());
  });

  // Paginación de los datos filtrados
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );


  

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/depot/billingmanager/reports"></BackButton>
      
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
          <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
            Pedidos facturados por cliente
          </h1>
          <p className="text-center text-lg text-gray-700 mb-12">
            Aqui podras ver los pedidos facturados agrupados por cliente.
          </p>

          <div className="flex flex-col md:flex-row mb-6 w-full justify-between gap-2">
          {/* Filtro */}
          <InvoicedOrdersFilter onSearch={handleSearch}/>
          </div>
          
          <div className="mt-12">
            {/* 1️⃣ Estado de carga */}
            {loading && <LoadingSpinner message="Cargando pedidos facturados..." height="h-32" />}
            
            {/* 2️⃣ Estado de error */}
            {error && (
              <EmptyState
                icon={AlertCircle}
                title="Ha habido un problema"
                description="Se ha detectado un problema al cargar los pedidos facturados. Por favor, intenta nuevamente más tarde."
              />
            )}

            {/* 3️⃣ Tabla + Gráfico + Paginación si hay datos */}
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

            {/* 4️⃣ Estado de sin resultados */}
            {!loading && !error && filteredData.length === 0 && (
              <EmptyState
                icon={Search}
                title="Sin resultados"
                description="No se encontraron pedidos para el cliente buscado. Intenta con un nombre diferente."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
