import { useNavigate, useParams } from "react-router-dom";
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

        setInitialValues({
          orderId: order.id,
          customerId: order.customerId,
          deliveryDetail: order.deliveryDetail || "",
          deliveryDate: order.deliveryDate?.slice(0, 10) || "",
          status: order.status,
          paymentType: order.paymentType || payments[0]?.paymentType || "Cash" ,
          items: order.items.map((item) => ({
            id: item.id,
            productName: item.productName,
            productBrand: item.productBrand,
            quantity: item.quantity,
          })),
          addressRequest: order.deliveryAddress
            ? {
                ...order.deliveryAddress,
                number: order.deliveryAddress.number?.toString() ?? "",
              }
            : {
                street: "",
                number: "",
                apartment: "",
                city: "",
                province: "",
                country: "",
                postalCode: "",
              },
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

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/sales/orders" />
        <h2 className="text-center text-4xl font-bold text-red-600 mb-12">Editar Orden</h2>
        {initialValues ? (
          <EditOrderForm
            initialValues={initialValues}
            savedAddresses={savedAddresses}
            paymentTypes={paymentTypes} // ✅ ahora coincide con el form
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onItemsChange={handleItemsChange}
          />
        ) : (
          <LoadingSpinner message="Cargando datos de la orden" height="h-screen" />
        )}
      </div>
    </div>
  );
};

export default EditOrderPage;
