import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getCustomerById, updateCustomer } from "../../services/CustomerService";
import EditCustomerForm from "../../components/Forms/EditCustomerForm";
import { UpdateCustomerRequest } from "../../types/CustomerTypes";
import { handleFormikError } from "../../../../components/Form/ErrorHandler";

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
            navigate(`/sales/viewCustomer/${id}`);
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
    <div className="px-6 py-10">
      {initialValues ? (
        <EditCustomerForm initialValues={initialValues} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      ) : (
        <p className="text-center text-gray-500">Cargando datos del cliente...</p>
      )}
    </div>
  );
};

export default EditCustomerPage;
