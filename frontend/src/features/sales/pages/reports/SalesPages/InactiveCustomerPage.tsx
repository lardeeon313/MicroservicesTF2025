import React , { useEffect, useState } from "react";
import Header from "../../../components/Header";
import InactiveCustomerTable from "../SalesComponents/IndividualComponentsSales/InactiveCustomerTable";
import type { Customer } from "../../../types/CustomerTypes";
import { CustomerStatus } from "../../../types/CustomerTypes";
import GraphInactiveCustomer from "../SalesGraph/GraphInactiveCustomer";
import API from "../../../../../api/axios";
import Footer from "../../../components/Footer";


const InactiveCustomerPage: React.FC = () => {
  //datos y UseEffect para llamar el axios 
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
            const response = await API.get<Customer[]>("/customers");
            const allCustomers = response.data;

            // Lógica: Filtrar inactivos o perdidos
            const inactiveOrLost = allCustomers.filter(
            (c) => c.status === CustomerStatus.Inactive || c.status === CustomerStatus.Lost
            );

            setCustomers(inactiveOrLost);
        } catch (err: any) {
            setError("Error al obtener los clientes.");
            console.error(err);
        } finally {
            setLoading(false);
        }
        };

        fetchCustomers();
    }, []);

    if (loading) return <p className="p-4 text-center">Cargando los datos,por favor espere un momento...</p>;
    if (error) return <p className="p-4 text-red-500">Error al obtener los datos.</p>;

    return (
    <div>
      <Header/>
      <div className="p-8">
        <h2 className="text-2xl font-bold text-blue-800 text-center">
          Reporte: Cliente inactivos y/o Perdidos
        </h2>
        <InactiveCustomerTable customers={customers} />
        <GraphInactiveCustomer customers={customers} />
      </div>
      <Footer/>
    </div>
  );
}

export default InactiveCustomerPage;
