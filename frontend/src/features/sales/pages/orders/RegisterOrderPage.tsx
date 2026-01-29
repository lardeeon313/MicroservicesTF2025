import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FilePlus } from "lucide-react";
import toast from "react-hot-toast";
import RegisterOrderForm from "../../components/Forms/RegisterOrderForm";
import { RegisterOrderRequest } from "../../types/OrderTypes";
import { Customer, CustomerResponse } from "../../types/CustomerTypes";
import { registerOrder } from "../../services/OrderService";
import { getAllCustomers } from "../../services/CustomerService";
import { handleFormikError } from "../../../../components/ErrorHandler";
import { useAuth } from "../../../auth/context/useAuth";
import { getUserIdFromToken } from "../../../../utils/jwtUtils";
import BackButton from "../../../../components/BackButton";
import LoadingSpinner from "../../../../components/LoadingSpinner";

const initialValues: RegisterOrderRequest = {
  customerId: "",
  deliveryDate: "",
  deliveryDetail: "",
  paymentType: undefined,
  items: [{ productName: "", productBrand: "", quantity: 1 }],
  deliveryAddressId: null,
  deliveryAddress: {
    id: 0,
    street: "",
    number: "",
    apartment: "",
    city: "",
    province: "",
    country: "",
    postalCode: "",
    latitude: null,
    longitude: null,
    formattedAddress: "",
  },
};

export default function RegisterOrderPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
  const navigate = useNavigate();
  const { token } = useAuth();
  const userId = token ? getUserIdFromToken(token) : null;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data: CustomerResponse[] = await getAllCustomers();
        const mappedCustomers: Customer[] = data.map((c) => ({
          id: c.id,
          firstName: c.firstName,
          lastName: c.lastName,
          email: c.email,
          phoneNumber: c.phoneNumber,
          addresses: c.addresses,
          status: c.status,
          registrationDate: new Date().toISOString(),
          descriptionsatisfaction: "",
          isActive: true,
          paymentTypes: c.paymentTypes || [],
        }));
        setCustomers(mappedCustomers);
      } catch (error) {
        toast.error("Error al cargar clientes");
      } finally {
        setIsLoadingCustomers(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleRegisterOrder = async (values: RegisterOrderRequest) => {
    setIsSubmitting(true);

    try {
      const orderToSend = {
        ...values,
        createdByUserId: userId!,
      };

      const response = await registerOrder(orderToSend);

      if (response.ok === true) {
        toast.success("Orden registrada con éxito!");
        navigate("/sales/orders");
        return;
      }

      throw response;
    } catch (error: any) {
      if (error?.status >= 200 && error?.status < 300) {
        return;
      }

      handleFormikError({
        error,
        customMessages: {
          400: "Datos inválidos, por favor verificá los campos.",
          404: "Cliente no encontrado.",
          500: "Error interno del servidor.",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingCustomers) {
    return <LoadingSpinner message="Cargando clientes..." height="h-screen" />;
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
        <BackButton to="/sales/home" />

        {/* Header Section */}
        <div className="text-center mb-10 mt-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mb-4">
            <FilePlus className="w-7 h-7 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Registrar Nueva Orden
          </h1>
          <p className="text-base text-gray-600">
            Complete los datos para crear una nueva orden
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <RegisterOrderForm
            initialValues={initialValues}
            customers={customers}
            onSubmit={handleRegisterOrder}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}