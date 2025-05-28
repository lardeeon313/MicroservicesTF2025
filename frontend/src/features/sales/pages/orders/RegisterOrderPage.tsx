import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import RegisterOrderForm from "../../components/Forms/RegisterOrderForm";
import { RegisterOrderRequest } from "../../types/OrderTypes";
import { CustomerResponse } from "../../types/CustomerTypes";
import { registerOrder } from "../../services/OrderService";
import { getAllCustomers } from "../../services/CustomerService";
import { handleFormikError } from "../../../../components/ErrorHandler";
import { useAuth } from "../../../auth/context/useAuth";
import { getUserIdFromToken } from "../../../../utils/jwtUtils";

const initialValues: RegisterOrderRequest = {
  customerId: "",
  deliveryDate: "",
  deliveryDetail: "",
  items: [{ productName: "", productBrand: "", quantity: 1 }],
};

export default function RegisterOrderPage() {
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();
  const userId = token ? getUserIdFromToken(token) : null;


  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getAllCustomers();
        setCustomers(data);
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
      const orderToSend: RegisterOrderRequest = {
        ...values,
        createdByUserId: userId!, // pasamos el ID del usuario autenticado
      }
      await registerOrder(orderToSend);
      toast.success("Orden registrada con éxito!");
      navigate("/sales/orders");
    } catch (error) {
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

  return (
    <div className="container m-0 pt-10 min-w-full">
      <div className="flex items-center justify-between mb-6">
        <Link to="/sales/orders" className="text-red-600 hover:underline pl-10">
          ← Volver al listado
        </Link>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl justify-center">
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
