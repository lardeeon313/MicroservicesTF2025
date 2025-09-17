// src/features/admin/pages/CustomerPage.tsx
import React, { useEffect, useState } from "react";
import type { Customer } from "../../../types/CustomerTypes";
import { Order } from "../../../types/OrderTypes";
import CustomerReportTable, { CustomerWithCount } from "../SalesComponents/IndividualComponentsSales/CustomerReportTable";
import GraphCustomerReport from "../SalesGraph/GraphCustomerReport";
import API from "../../../../../api/axios";
import BackButton from "../../../../../components/BackButton";


const CustomerReportPage: React.FC = () => {
  const [data,setData] = useState<CustomerWithCount[]>([])

  const [loading] = useState(true);
  const [error] = useState<string | null>(null);

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
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/sales/home"></BackButton>
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4 text-center text-blue-800">
            Clientes y Pedidos
          </h1>
          <CustomerReportTable data={data} />
          <GraphCustomerReport data={data} />
        </div>
      </div>
    </div>
  );
};  

export default CustomerReportPage;
