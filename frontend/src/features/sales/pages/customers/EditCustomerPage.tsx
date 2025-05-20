import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getCustomerById, updateCustomer } from "../../services/CustomerService";
import EditCustomerForm from "../../components/Forms/EditCustomerForm";
import { UpdateCustomerRequest } from "../../types/CustomerTypes";
import { handleFormikError } from "../../../../components/ErrorHandler";
import LoadingSpinner from "../../../../components/LoadingSpinner";

const EditCustomerPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<UpdateCustomerRequest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
        try {
            const customer = await getCustomerById(id!);
            setInitialValues({
            id: customer.id,
            firstName: customer.firstName || "",
            lastName: customer.lastName || "",
            email: customer.email || "",
            phoneNumber: customer.phoneNumber || "",
            address: customer.address || "",
        });
        } catch (error) {
            handleFormikError({
                error,
                customMessages: {
            404: "El cliente no fue encontrado.",
        },
  });
  navigate("/sales/customers");
}
    };

    if (id) fetchCustomer();
  }, [id, navigate]);

    const handleSubmit = async (values: UpdateCustomerRequest) => {
        setIsSubmitting(true);
        try {
            await updateCustomer(values);
            toast.success("Cliente actualizado correctamente");
            navigate(`/sales/customers`);
        } catch (error) {
            handleFormikError({
                error,
                customMessages: {
                    404: "El cliente no fue encontrado.",
                    400: "Datos inválidos al actualizar el cliente.",
                },
        });
        } finally {
            setIsSubmitting(false);
        }
    };

  return (
    <div className="container m-0 pt-10 min-w-full h-screen">
      <div className="flex items-center justify-between mb-6">
        <Link to="/sales/customers" className="text-red-600 hover:underline pl-10">
          ← Volver al listado
        </Link>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl justify-center">
        <h2 className="text-center text-4xl font-bold text-red-600 mb-12">
          Editar Cliente
        </h2>
      
      {initialValues ? (
        <EditCustomerForm initialValues={initialValues} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      ) : (
        <LoadingSpinner message="Cargando datos del cliente..." height="h-screen"/> 
      )}
      </div>
    </div>
  );
};

export default EditCustomerPage;
