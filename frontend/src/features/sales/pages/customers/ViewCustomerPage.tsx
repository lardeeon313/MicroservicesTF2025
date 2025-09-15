import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { CustomerResponse } from "../../types/CustomerTypes";
import { getCustomerById } from "../../services/CustomerService";
import toast from "react-hot-toast";
import CustomerDetail from "../../components/Customers/CustomerDetail";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import BackButton from "../../../../components/BackButton";

const ViewCustomerPage = () => {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<CustomerResponse | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCustomer = async () => {
        try {
            const data = await getCustomerById(id!);
            setCustomer(data);
        } catch {
            toast.error("No se pudo cargar el cliente.");
        } finally {
            setLoading(false);
        }
    };

    if (id) fetchCustomer();
  }, [id]);

  if (loading) 
    return (
      <LoadingSpinner message="Cargando cliente..." height="h-screen" />
    );
  if (!customer) return <div className="text-center mt-10 text-red-500">Cliente no encontrado</div>;

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/sales/Customers"></BackButton>
        <h2 className="text-center text-4xl font-bold text-red-600 mb-12">
          Detalles del Cliente
        </h2>
        <CustomerDetail customer={customer} />
      </div>
    </div>
  )
};

export default ViewCustomerPage;