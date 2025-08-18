import React, { useState, useEffect } from "react";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import { Pagination } from "../../../../../../components/Pagination";
import CustomerIncomeTable from "../BillingComponents/CustomerIncomeTable";
import GraphCustomerIncome from "../BillingGraphs/GraphCustomerIncome";
import type { Billing } from "../../../../billingmanager/types/BillingType";
import API from "../../../../../../api/axios";

const CustomerIncomePage: React.FC = () => {
  // datos originales
  const [orders, setOrders] = useState<Billing[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Billing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // filtros
  const [searchParams, setSearchParams] = useState<{
    startDate: string;
    endDate: string;
    orderId?: string;
  }>({
    startDate: "",
    endDate: "",
    orderId: "",
  });

  // paginación
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);

  // total de páginas
  const totalPages = Math.ceil(filteredOrders.length / pageSize);

  // traer datos una sola vez;
  useEffect(() => {
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get<Billing[]>("/depot/billingmanager/all-invoiced-orders");
      if (!res.data || res.data.length === 0) {
        setOrders([]);
        setFilteredOrders([]);
        setError("No hay órdenes facturadas.");
      } else {
        setOrders(res.data);
        setFilteredOrders(res.data);
        setError("");
      }
    } catch (err: any) {
      // 🚫 si es 500 o 404, mostramos mensaje pero NO hacemos console.error
      if (err.response && (err.response.status === 404 || err.response.status === 500)) {
        setError("No hay órdenes facturadas.");
      } else {
        console.error("Error fetching invoiced orders:", err);
        setError("Error al conectar con el servidor.");
      }
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };
  fetchOrders();
}, []);


  // aplicar filtros
  const handleSearch = () => {
    let data = [...orders];

    if (searchParams.startDate) {
      data = data.filter(
        (o) => new Date(o.billingDate) >= new Date(searchParams.startDate)
      );
    }

    if (searchParams.endDate) {
      data = data.filter(
        (o) => new Date(o.billingDate) <= new Date(searchParams.endDate)
      );
    }

    if (searchParams.orderId) {
      data = data.filter((o) => String(o.orderID) === searchParams.orderId);
    }

    setFilteredOrders(data);
    setPage(1); // resetear a la primera página
  };

  // slice para paginar
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Ingresos por Cliente</h1>

      {/* filtros simples */}
      <div className="flex gap-2 mb-4">
        <input
          type="date"
          value={searchParams.startDate}
          onChange={(e) =>
            setSearchParams({ ...searchParams, startDate: e.target.value })
          }
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={searchParams.endDate}
          onChange={(e) =>
            setSearchParams({ ...searchParams, endDate: e.target.value })
          }
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Order ID"
          value={searchParams.orderId}
          onChange={(e) =>
            setSearchParams({ ...searchParams, orderId: e.target.value })
          }
          className="border p-2 rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Buscar
        </button>
      </div>

      {/* estados */}
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-500">{error}</p>}

      {/* tabla */}
      <CustomerIncomeTable
        data={paginatedOrders.map((item: Billing) => ({
          orderid: item.orderID,
          billingDate: item.billingDate,
          totalAmount: item.totalAmount,
        }))}
      />

      {/* gráfico */}
      <GraphCustomerIncome
        data={filteredOrders.map((item: Billing) => ({
          BillingDate: item.billingDate,
          TotalAmount: item.totalAmount,
        }))}
      />

      {/* paginación */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default CustomerIncomePage;
