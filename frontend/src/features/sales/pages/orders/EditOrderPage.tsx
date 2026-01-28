import { useNavigate, useParams } from "react-router-dom";
import { Edit } from "lucide-react";
import EditOrderForm from "../../components/Forms/EditOrderForm";
import { UpdateOrderRequest, Order } from "../../types/OrderTypes";
import { AddressRequest } from "../../types/CustomerTypes";
import { CustomerPaymenType } from "../../types/CustomerTypes";
import { handleFormikError } from "../../../../components/ErrorHandler";
import { getOrderById, updateOrder, getCustomerAddresses, getCustomerPaymentTypes } from "../../services/OrderService";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import BackButton from "../../../../components/BackButton";

const EditOrderPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<UpdateOrderRequest | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<AddressRequest[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<CustomerPaymenType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const orderId = parseInt(id!, 10);
        const order: Order = await getOrderById(orderId);

        const [addresses, payments] = await Promise.all([
          getCustomerAddresses(order.customerId.toString()),
          getCustomerPaymentTypes(order.customerId.toString()),
        ]);

        const mappedAddresses = addresses.map((addr) => ({
          ...addr,
          number: addr.number?.toString() ?? "",
        }));

        setSavedAddresses(mappedAddresses);
        setPaymentTypes(payments);

        // Construir addressRequest con los datos de la orden
        const addressRequest = order.address
          ? {
              id: order.address.id,
              street: order.address.street || "",
              number: order.address.number?.toString() ?? "",
              apartment: order.address.apartment || "",
              city: order.address.city || "",
              province: order.address.province || "",
              country: order.address.country || "",
              postalCode: order.address.postalCode || "",
            }
          : {
              street: "",
              number: "",
              apartment: "",
              city: "",
              province: "",
              country: "",
              postalCode: "",
            };
        setInitialValues({
          orderId: order.id,
          customerId: order.customerId,
          deliveryDetail: order.deliveryDetail || "",
          deliveryDate: order.deliveryDate?.slice(0, 10) || "",
          status: order.status || "",
          paymentType: order.paymentType,
          items: order.items.map((item) => ({
            id: item.id,
            productName: item.productName,
            productBrand: item.productBrand,
            quantity: item.quantity,
          })),
          addressRequest,
        });
      } catch (error) {
        handleFormikError({
          error,
          customMessages: {
            400: "Error en los datos enviados",
            404: "Orden no encontrada",
            500: "Error en el servidor",
          },
        });
        navigate("/sales/orders");
      }
    };

    if (id) fetchOrderData();
  }, [id, navigate]);

  const handleItemsChange = (
    items: Array<{ id: number; productName: string; productBrand: string; quantity: number }>
  ) => {
    if (initialValues) {
      const updatedValues = { ...initialValues, items };
      setInitialValues(updatedValues);
    }
  };

  const handleSubmit = async (values: UpdateOrderRequest) => {
    console.log("🚀 Enviando updateOrder con:", values);
    console.log("🚀 Items enviados:", values.items);
    setIsSubmitting(true);
    try {
      await updateOrder(values.orderId, values);
      toast.success("Orden actualizada correctamente");
      navigate("/sales/orders");
    } catch (error) {
      handleFormikError({
        error,
        customMessages: {
          404: "La orden no fue encontrada.",
          400: "Datos inválidos al actualizar la orden.",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!initialValues) {
    return <LoadingSpinner message="Cargando datos de la orden..." height="h-screen" />;
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
        <BackButton to="/sales/orders" />

        {/* Header Section */}
        <div className="text-center mb-10 mt-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mb-4">
            <Edit className="w-7 h-7 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Editar Orden #{id}
          </h1>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <EditOrderForm
            initialValues={initialValues}
            savedAddresses={savedAddresses}
            paymentTypes={paymentTypes}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onItemsChange={handleItemsChange}
          />
        </div>
      </div>
    </div>
  );
};

export default EditOrderPage;