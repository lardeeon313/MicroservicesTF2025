import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { CustomerResponse } from "../../types/CustomerTypes";
import { getCustomerById } from "../../services/CustomerService";
import toast from "react-hot-toast";
import CustomerDetail from "../../components/Customers/CustomerDetail";



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

  if (loading) return <div className="text-center mt-10">Cargando...</div>;
  if (!customer) return <div className="text-center mt-10 text-red-500">Cliente no encontrado</div>;

  return <CustomerDetail customer={customer} />;
};

export default ViewCustomerPage;