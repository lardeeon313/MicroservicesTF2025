import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import CustomerSatisfactionTable from "../SalesComponents/IndividualComponentsSales/CustomerSatisfactionTable";
import GraphSatisfactionCustomer from "../SalesGraph/GraphSatisfactionCustomer";
import { CustomerStatus,Customer } from "../../../types/CustomerTypes";
import type { Order } from "../../../types/OrderTypes";
import API from "../../../../../api/axios";
import Footer from "../../../components/Footer";


const CustomerSatisfacionPage: React.FC = () => {
  const [customers, setCustomers] = useState<(Customer & { pedidoID?: string | number })[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    //API:
    const fetchData = async () => {
      try {
        const [customerRes, orderRes] = await Promise.all([
          API.get<Customer[]>("/customers"),
          API.get<Order[]>("/orders"),
        ]);

        const mergedCustomers = customerRes.data.map((customer) => {
          const order = orderRes.data.find((o) => o.customerId === customer.id);
          return {
            ...customer,
            pedidoID: order?.id ?? "N/A",
          };
        });

        setCustomers(mergedCustomers);
        setOrders(orderRes.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, []);

  if(loading) return <p className="text-center">Cargando los datos, por favor espere un momento...</p>
  if(error) return <p className="text-red-600">Error al obtener los datos...</p>

  return (
    <div>
      <Header/>
      <div className="p-6 space-y-6">
          <h2 className="text-2xl font-bold text-blue-800 text-center">
            Reporte: Satisfacción del Cliente
          </h2>
          <CustomerSatisfactionTable data={customers} />
          <GraphSatisfactionCustomer customers={customers} />
      </div>
      <Footer/>
    </div>
  );
};

export default CustomerSatisfacionPage;