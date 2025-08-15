import React, { useState } from "react";
import { Link } from "react-router-dom";
//import { useOrderBilledByCustomer } from "../BillingHocks/useOrderBilledByCustomer";
import { useOrderBilledByCustomer } from "../BillingHocks/useOrderBilled";

import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import OrderBilledTable from "../BillingComponents/OrderBilledTable";
import OrderBilledGraph from "../BillingGraphs/GraphOrderBilled";
import OrderBilledFilter from "../BillingFilters/OrderBilledFilter";

const OrderBilledByCustomerPage: React.FC = () => {
  const [customerId, setCustomerId] = useState("");
  const [idFilter, setIdFilter] = useState("");

  const { data, loading, error } = useOrderBilledByCustomer(customerId);

  const filteredData = data.filter((item) =>
    idFilter === "" || item.OrderId.toString().includes(idFilter)
  );

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
          Pedidos facturados por cliente
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Ingresa el ID de un cliente para visualizar todos sus pedidos facturados
        </p>

        {/* Componente de filtro con buscar/limpiar */}
        <OrderBilledFilter
          onSearch={(id) => setCustomerId(id)}
          onClear={() => {
            setCustomerId("");
            setIdFilter("");
          }}
        />

        {/* Mostrar filtro por ID de pedido solo si hay un customerId */}
        {customerId && filteredData.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-4 items-center mb-6">
                <input
                    type="text"
                    placeholder="🔍 Filtrar por ID de pedido"
                    className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200 text-center"
                    value={idFilter}
                    onChange={(e) => setIdFilter(e.target.value)}
                />
            </div>
        )}

        {/* Mostrar resultados */}
        {loading && customerId ? (
          <LoadingSpinner message="Cargando los datos..." height="h-screen" />
        ) : error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : customerId ? (
          <>
            <OrderBilledTable data={filteredData} />
            <OrderBilledGraph data={filteredData} />
          </>
        ) : (
          <p className="text-center text-gray-500 mt-6">
            Ingrese un Customer ID para ver resultados
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderBilledByCustomerPage;

