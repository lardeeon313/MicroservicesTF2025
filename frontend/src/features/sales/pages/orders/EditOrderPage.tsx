import { useNavigate, useParams } from "react-router-dom";
import EditOrderForm from "../../components/Forms/EditOrderForm";
import { UpdateOrderRequest, Order } from "../../types/OrderTypes";
import { AddressRequest, Address } from "../../types/CustomerTypes";
import { handleFormikError } from "../../../../components/ErrorHandler";
import { getOrderById, updateOrder } from "../../services/OrderService";
import { getCustomerAddresses } from "../../services/OrderService";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import BackButton from "../../../../components/BackButton";

const EditOrderPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<UpdateOrderRequest | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<AddressRequest[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderId = parseInt(id!, 10);
        const order: Order = await getOrderById(orderId);
        const addresses: Address[] = await getCustomerAddresses(order.customerId.toString());
        const mappedAddresses: AddressRequest[] = addresses.map(addr => ({
          ...addr,
          number: addr.number?.toString() ?? "",
        }));
        setSavedAddresses(mappedAddresses);
        setInitialValues({
          orderId: order.id,
          customerId: order.customerId,
          deliveryDetail: order.deliveryDetail || "",
          deliveryDate: order.deliveryDate?.slice(0, 10) || "",
          status: order.status,
          items: order.items.map(item => ({
            id: item.id,
            productName: item.productName,
            productBrand: item.productBrand,
            quantity: item.quantity,
          })),
          addressRequest: order.deliveryAddress
            ? { ...order.deliveryAddress, number: order.deliveryAddress.number?.toString() ?? "" }
            : { street: "", number: "", apartment: "", city: "", province: "", country: "", postalCode: "" },
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
    if (id) fetchOrder();
  }, [id, navigate]);


  const handleItemsChange = (items: Array<{ id: number; productName: string; productBrand: string; quantity: number }>) => {
    
    if (initialValues) {
    const updatedValues = {
      ...initialValues,
      items: items,
    };
    console.log("Nuevos initialValues:", updatedValues);
    setInitialValues(updatedValues);
  }
  };

  const handleSubmit = async (values: UpdateOrderRequest) => {
    setIsSubmitting(true);
    try {
      
      const response = await updateOrder(values.orderId, values);
      console.log("Respuesta del backend:", response);
      toast.success("Órden actualizada correctamente");
      navigate("/sales/orders");
    } catch (error) {
      console.error("Error al actualizar la orden:", error);
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
