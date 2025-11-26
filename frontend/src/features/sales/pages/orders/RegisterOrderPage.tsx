import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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


const initialValues: RegisterOrderRequest = {
  customerId: "",
  deliveryDate: "",
  deliveryDetail: "",
  paymentType: undefined, // 👈 inicializado como string del enum
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
        console.error(error);
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

    console.log("Respuesta del backend:", response);

    // Si el backend respondió 200-299 ⇒ ÉXITO REAL
    if (response.ok === true) {
      toast.success("Orden registrada con éxito!");
      navigate("/sales/orders");
      return;
    }

    // Si vino ok === false ⇒ cayó en reject
    throw response;

  } catch (error: any) {

    console.log("ERROR CAPTURADO:", error);

    // Si el backend devolvió error pero igual registró la orden
    if (error?.status >= 200 && error?.status < 300) {
      // No mostrar error
      return;
    }

    // Caso error real
    handleFormikError({
      error,
      customMessages: {
        400: "Datos inválidos, por favor verificá los campos.",
        404: "Cliente no encontrado.",
        500: "Error interno del servidor.",
      },
    });
  }

  finally {
    setIsSubmitting(false);
  }
};




  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/sales/home" />
        <h2 className="text-center text-4xl font-bold text-red-600 mb-12">
          Registrar Orden
        </h2>
        <RegisterOrderForm
          initialValues={initialValues}
          customers={customers}
          onSubmit={handleRegisterOrder}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
