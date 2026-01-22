import React, { useState, useEffect } from "react";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import { Pagination } from "../../../../../../components/Pagination";
import CustomerIncomeTable from "../BillingComponents/CustomerIncomeTable";
import CustomerIncomeFilter from "../BillingFilters/CustomerIncomeFilter";
import CustomerIncomeCustomerDetailTable from "../BillingComponents/CustomerIncomeCustomerDetailTable";
import BackButton from "../../../../../../components/BackButton";
import EmptyState from "../../../../../../components/EmptyState";
import { AlertCircle } from "lucide-react";
import { useCustomerIncome } from "../BillingHocks/useCustomerIncome";

// Define el tipo para los filtros
type Filters = {
  customerName: string;
  date: string;
  totalAmount: string;
};

// Define el tipo para los elementos de la tabla detallada
type CustomerIncomeDetailItem = {
  orderNumber: string;
  orderDate: string;
  billingDate: string;
  totalAmount: number;
  customerName: string;
  itemsCount?: number;
};

const CustomerIncomePage: React.FC = () => {
  const {
    orders,
    filteredByCustomer,
    loading,
    error,
    fetchOrdersByCustomer,
  } = useCustomerIncome();

  const [filters, setFilters] = useState<Filters>({
    customerName: "",
    date: "",
    totalAmount: "",
  });

  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-AR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (e) {
      return "N/A";
    }
  };

  // Aplicar filtros a los datos detallados del cliente
  const filteredDetailData = filteredByCustomer.filter((o) => {
    let ok = true;
    if (filters.date) {
      const d = new Date(o.orderDate).toISOString().split("T")[0];
      ok = ok && d === filters.date;
    }
    if (filters.totalAmount) {
      ok = ok && Number(o.totalAmount) === Number(filters.totalAmount);
    }
    return ok;
  });

  // Mapea los datos de `filteredDetailData` al tipo `CustomerIncomeDetailItem`
  const mappedFilteredByCustomer: CustomerIncomeDetailItem[] = filteredDetailData
    .filter(item => item.totalAmount > 0)
    .map((item) => ({
      orderNumber: item.depotOrderId?.toString() || "N/A",
      orderDate: item.orderDate ? formatDate(item.orderDate) : "N/A",
      billingDate: item.billingDate ? formatDate(item.billingDate) : formatDate(item.orderDate),
      totalAmount: item.totalAmount,
      customerName: item.customerName,
      itemsCount: item.items?.length || 0,
      Status: item.Status
    }));

  // Aplica los filtros
  const applyFilters = () => {
    setPage(1);
    if (filters.customerName.trim()) {
      fetchOrdersByCustomer(filters.customerName);
    }
  };

  // Limpia los filtros
  const clearFilters = () => {
    setFilters({ customerName: "", date: "", totalAmount: "" });
    fetchOrdersByCustomer("");
    setPage(1);
  };

  // Filtra las órdenes según los filtros aplicados
  const filteredOrders = orders.filter((o) => {
    let ok = true;
    if (filters.date) {
      const d = new Date(o.orderDate).toISOString().split("T")[0];
      ok = ok && d === filters.date;
    }
    if (filters.totalAmount) {
      ok = ok && Number(o.totalAmount) === Number(filters.totalAmount);
    }
    if (filters.customerName.trim()) {
      ok = ok && o.customerName.toLowerCase().includes(filters.customerName.toLowerCase());
    }
    return ok;
  });

  // Calcula el número total de páginas
  const totalPages = Math.ceil(filteredOrders.length / pageSize);

  // Obtiene las órdenes paginadas
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Efecto para buscar órdenes por cliente cuando se aplica el filtro
  useEffect(() => {
    if (filters.customerName.trim()) {
      fetchOrdersByCustomer(filters.customerName);
    }
  }, [filters.customerName, fetchOrdersByCustomer]);

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/depot/billingmanager/reports" />
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Ingresos por Cliente
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Aquí podrás ver los ingresos generados por los diferentes clientes.
        </p>
        <div className="mb-10">
          <CustomerIncomeFilter
            filters={filters}
            onChange={setFilters}
            onSearch={applyFilters}
            onClear={clearFilters}
          />
        </div>

        <>
          {loading && <LoadingSpinner />}
          {error && (
            <EmptyState icon={AlertCircle} title="Error" description={error} />
          )}
          {!loading && !error && (
            <div>
              {!filters.customerName.trim() ? (
                <>
                  {filteredOrders.length > 0 ? (
                    <>
                      <CustomerIncomeTable data={paginatedOrders} />
                      {totalPages > 1 && (
                        <Pagination
                          currentPage={page}
                          totalPages={totalPages}
                          onPageChange={setPage}
                        />
                      )}
                    </>
                  ) : (
                    <EmptyState
                      icon={AlertCircle}
                      title="Sin resultados"
                      description="No se encontraron ingresos con los filtros aplicados."
                    />
                  )}
                </>
              ) : (
                <>
                  {mappedFilteredByCustomer.length > 0 ? (
                    <>
                      <CustomerIncomeCustomerDetailTable data={mappedFilteredByCustomer} />
                    </>
                  ) : (
                    <EmptyState
                      icon={AlertCircle}
                      title="Sin resultados"
                      description="No se encontraron ingresos para el cliente seleccionado."
                    />
                  )}
                </>
              )}
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default CustomerIncomePage;
