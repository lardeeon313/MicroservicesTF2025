import { Link, useNavigate, useParams } from "react-router-dom";
import EditOrderForm from "../../components/Forms/EditOrderForm";
import { UpdateOrderRequest } from "../../types/OrderTypes";
import { handleFormikError } from "../../../../components/ErrorHandler";
import { getOrderById, updateOrder } from "../../services/OrderService";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../../../components/LoadingSpinner";

const EditOrderPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<UpdateOrderRequest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const orderId: number = parseInt(id!)
    const fetchOrder = async () => {
      try {
        const order = await getOrderById(orderId!);
        setInitialValues({
          orderId: order?.id,
          deliveryDetail: order?.deliveryDetail,
          deliveryDate: order?.deliveryDate?.slice(0,10),
          status: order?.status,
          items: order?.items.map((item) => ({
            id: item.id,
            productName: item.productName,
            productBrand: item.productBrand,
            quantity: item.quantity
          }))
        });
      } catch (error) {
          handleFormikError({
            error,
            customMessages: {
              400: "Error en los datos enviados",
              404: "Orden no encontrada",
              500: "Error en el servidor"
          },
        });
        navigate("/sales/orders")
      }
    };

    if (id) fetchOrder();
  },[id, navigate]);

  const handleSubmit = async (values: UpdateOrderRequest) => {
    setIsSubmitting(true);
    try {
      await updateOrder(values.orderId, values);
      toast.success("Cliente actualizado correctamente");
      navigate("/sales/orders");
    } catch (error) {
      handleFormikError({
        error,
        customMessages: {
          404: "La ordén no fue encontrado.",
          400: "Datos inválidos al actualizar la orden."
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
          Editar Orden
        </h2>
        {initialValues ? (
                  <EditOrderForm 
          initialValues={initialValues}
          onSubmit={handleSubmit}
          isSubmitting = {isSubmitting} 
        />
        ) : (
          <LoadingSpinner message="Cargando datos de la órden" height="h-screen" />
        )}
      </div>
    </div>
  )

}

export default EditOrderPage;

