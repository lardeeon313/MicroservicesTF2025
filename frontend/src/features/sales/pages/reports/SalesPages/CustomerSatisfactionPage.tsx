import React, { useEffect, useState } from "react";
import CustomerSatisfactionTable from "../SalesComponents/IndividualComponentsSales/CustomerSatisfactionTable";
import GraphSatisfactionCustomer from "../SalesGraph/GraphSatisfactionCustomer";
import { Customer } from "../../../types/CustomerTypes";
import type { Order } from "../../../types/OrderTypes";
import API from "../../../../../api/axios";
import BackButton from "../../../../../components/BackButton";


const CustomerSatisfacionPage: React.FC = () => {
  const [customers, setCustomers] = useState<(Customer & { pedidoID?: string | number })[]>([]);
  const [loading] = useState<boolean>(true);
  const [error] = useState<string | null>(null);

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
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, []);

  if(loading) return <p className="text-center">Cargando los datos, por favor espere un momento...</p>
  if(error) return <p className="text-red-600">Error al obtener los datos...</p>

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/sales/home"></BackButton>
          <h2 className="text-2xl font-bold text-blue-800 text-center">
            Reporte: Satisfacción del Cliente
          </h2>
          <CustomerSatisfactionTable data={customers} />
          <GraphSatisfactionCustomer customers={customers} />
      </div>
    </div>
  );
};

export default CustomerSatisfacionPage;