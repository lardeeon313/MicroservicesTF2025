import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit } from "lucide-react";
import toast from "react-hot-toast";
import { getCustomerById, updateCustomer } from "../../services/CustomerService";
import EditCustomerForm from "../../components/Forms/EditCustomerForm";
import { UpdateCustomerRequest } from "../../types/CustomerTypes";
import { handleFormikError } from "../../../../components/ErrorHandler";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import BackButton from "../../../../components/BackButton";

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
          addresses: customer.addresses?.map(a => ({
            street: a.street || "",
            number: a.number?.toString() || "",
            apartment: a.apartment || "",
            city: a.city || "",
            province: a.province || "",
            country: a.country || "",
            postalCode: a.postalCode || "",
            latitude: a.latitude,
            longitude: a.longitude,
            formattedAddress: a.formattedAddress,
          })) || [],
          paymentTypes: customer.paymentTypes || [],
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

  if (!initialValues) {
    return <LoadingSpinner message="Cargando datos del cliente..." height="h-screen" />;
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
        <BackButton to="/sales/customers" />

        {/* Header Section */}
        <div className="text-center mb-10 mt-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mb-4">
            <Edit className="w-7 h-7 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Editar Cliente
          </h1>
          <p className="text-base text-gray-600">
            Modifica los datos del cliente
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <EditCustomerForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default EditCustomerPage;