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
import { OrderStatus } from "../../../../depotmanager/types/OrderTypes";

/* =========================
   TIPOS
========================= */

type Filters = {
  customerName: string;
  date: string;
  totalAmount: string;
};

type CustomerIncomeDetailItem = {
  orderNumber: string;
  orderDate: string;
  billingDate: string;
  totalAmount: number;
  customerName: string;
  itemsCount?: number;
  Status: OrderStatus;
};

type GroupedCustomer = {
  customerName: string;
  customerEmail: string;
  totalOrders: number;
  totalIncome: number;
};

/* =========================
   UTILS
========================= */

const normalize = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, " ");

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return "N/A";
  }
};

const groupByCustomer = (orders: any[]): GroupedCustomer[] => {
  const grouped = orders.reduce((acc, order) => {
    const key = `${normalize(order.customerName)}|${normalize(
      order.customerEmail
    )}`;

    if (!acc[key]) {
      acc[key] = {
        customerName: order.customerName.trim(),
        customerEmail: order.customerEmail.trim(),
        totalOrders: 0,
        totalIncome: 0,
      };
    }

    acc[key].totalOrders += 1;
    acc[key].totalIncome += order.totalAmount;

    return acc;
  }, {} as Record<string, GroupedCustomer>);

  return Object.values(grouped);
};

/* =========================
   PAGE
========================= */

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

  /* =========================
     FILTRO GENERAL (VISTA CLIENTES)
  ========================= */

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
      ok =
        ok &&
        o.customerName
          .toLowerCase()
          .includes(filters.customerName.toLowerCase());
    }

    return ok;
  });

  const groupedCustomers = groupByCustomer(filteredOrders);

  const totalPages = Math.ceil(groupedCustomers.length / pageSize);

  const paginatedCustomers = groupedCustomers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  /* =========================
     DETALLE POR CLIENTE
  ========================= */

  const filteredDetailData = filteredByCustomer.filter((o) => {
    let ok = true;

    if (filters.date) {
      const d = new Date(o.orderDate).toISOString().split("T")[0];
      ok = ok && d === filters.date;
    }

    if (filters.totalAmount) {
      const filterAmount = Number(filters.totalAmount);
      const orderAmount = Number(o.totalAmount);

      const epsilon = 0.01; // tolerancia de 1 centavo

      ok =
        ok &&
        orderAmount >= filterAmount - epsilon &&
        orderAmount <= filterAmount + epsilon;
    }

    return ok;
  });

  const mappedFilteredByCustomer: CustomerIncomeDetailItem[] =
    filteredDetailData
      .filter((item) => item.totalAmount > 0)
      .map((item) => ({
        orderNumber: item.depotOrderId?.toString() || "N/A",
        orderDate: item.orderDate ? formatDate(item.orderDate) : "N/A",
        billingDate: item.billingDate
          ? formatDate(item.billingDate)
          : formatDate(item.orderDate),
        totalAmount: item.totalAmount,
        customerName: item.customerName,
        itemsCount: item.items?.length || 0,
        Status: item.Status,
      }));

  /* =========================
     ACCIONES
  ========================= */

  const applyFilters = () => {
    setPage(1);
    if (filters.customerName.trim()) {
      fetchOrdersByCustomer(filters.customerName);
    }
  };

  const clearFilters = () => {
    setFilters({ customerName: "", date: "", totalAmount: "" });
    fetchOrdersByCustomer("");
    setPage(1);
  };

  useEffect(() => {
    if (filters.customerName.trim()) {
      fetchOrdersByCustomer(filters.customerName);
    }
  }, [filters.customerName, fetchOrdersByCustomer]);

  /* =========================
     RENDER
  ========================= */

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

        {loading && <LoadingSpinner />}

        {error && (
          <EmptyState icon={AlertCircle} title="Error" description={error} />
        )}

        {!loading && !error && (
          <>
            {!filters.customerName.trim() ? (
              <>
                {groupedCustomers.length > 0 ? (
                  <>
                    <CustomerIncomeTable data={paginatedCustomers} />

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
                  <CustomerIncomeCustomerDetailTable
                    data={mappedFilteredByCustomer}
                  />
                ) : (
                  <EmptyState
                    icon={AlertCircle}
                    title="Sin resultados"
                    description="No se encontraron ingresos para el cliente seleccionado."
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerIncomePage;
