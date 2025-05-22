// src/features/admin/pages/CustomerPage.tsx
import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import type { Customer,CustomerStatus } from "../../../types/CustomerTypes";
import { Order, OrderStatus } from "../../../types/OrderTypes";
import CustomerReportTable, { CustomerWithCount } from "../SalesComponents/IndividualComponentsSales/CustomerReportTable";
import GraphCustomerReport from "../SalesGraph/GraphCustomerReport";
import API from "../../../../../api/axios";


const CustomerReportPage: React.FC = () => {
  const [data,setData] = useState<CustomerWithCount[]>([])

  const [loading,setLoading] = useState(true);
  const [error,setError] = useState<string | null>(null);

   useEffect(() => {
    const fetchData = async () => {
      try {
        const [customerRes, orderRes] = await Promise.all([
          API.get<Customer[]>("/customers"),
          API.get<Order[]>("/orders"),
        ]);

        const customers = customerRes.data;
        const orders = orderRes.data;

        const enrichedData = customers.map((customer) => {
          const orderCount = orders.filter((o) => o.customerId === customer.id).length;

          return {
            ...customer,
            orderCount,
          };
        });

        setData(enrichedData);
      } catch (error) {
        console.error("Fallo al obtener datos reales, se usarán datos mock:", error);
      }
    };

    fetchData();
  }, []);
  
  if(loading) return <p className="text-center">Cargando los datos, por favor espere...</p>
  if(error) return <p className="text-red-600">Error al obtener los datos...</p>


  return (
    <div>
      <Header/>
        <div className="p-8">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-800">
          Clientes y Pedidos
        </h1>
        <CustomerReportTable data={data} />
        <GraphCustomerReport data={data} />
      </div>
      <Footer/>
    </div>
  );
};

export default CustomerReportPage;
