    import { useNavigate } from "react-router-dom";
    import { useFormik } from "formik";
    import { updateOrder } from "../../services/OrderService";
    import { handleFormikError } from "../../../../components/Form/ErrorHandler";
    import { toast } from "react-hot-toast";
    import { Order, OrderStatus, UpdateOrderRequest } from "../../types/OrderTypes";
import { EditOrderValidationSchema } from "../../validations/orderSchemas";

    type Props = {
    order: Order | null;
    loading: boolean;
    };

    export default function EditOrderForm({ order, loading }: Props) {
    const navigate = useNavigate();

    const formik = useFormik<UpdateOrderRequest>({
        enableReinitialize: true,
        initialValues: {
        orderId: order?.id || 0,
        deliveryDetail: order?.deliveryDetail || "",
        deliveryDate: order?.deliveryDate?.slice(0, 10) || "",
        status: order?.status as OrderStatus || "Pending",
        items: order?.items.map((item) => ({
            id: item.id,
            productName: item.productName,
            productBrand: item.productBrand,
            quantity: item.quantity,
        })) || [],
        },
        validationSchema: EditOrderValidationSchema,
        onSubmit: async (values) => {
        try {
            await updateOrder(values.orderId, values);
            toast.success("Orden actualizada exitosamente.");
            navigate("/orders");
        } catch (error) {
            handleFormikError({
            error,
            customMessages: {
                400: "Error en los datos enviados.",
                404: "Orden no encontrada.",
            },
            });
        }
        },
    });

    if (loading) return <p className="p-4 text-gray-700">Cargando datos de la orden...</p>;
    if (!order) return null;

    return (
        <div className="p-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Editar Orden</h2>

        <form onSubmit={formik.handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl border shadow">
            <div className="grid md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Detalle de entrega</label>
                <input
                type="text"
                name="deliveryDetail"
                value={formik.values.deliveryDetail}
                onChange={formik.handleChange}
                className="input input-bordered w-full"
                />
                {formik.touched.deliveryDetail && formik.errors.deliveryDetail && (
                <p className="text-sm text-red-500">{formik.errors.deliveryDetail}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Fecha de entrega</label>
                <input
                type="date"
                name="deliveryDate"
                value={formik.values.deliveryDate}
                onChange={formik.handleChange}
                className="input input-bordered w-full"
                />
                {formik.touched.deliveryDate && formik.errors.deliveryDate && (
                <p className="text-sm text-red-500">{formik.errors.deliveryDate}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Estado</label>
                <select
                name="status"
                value={formik.values.status as OrderStatus}
                onChange={formik.handleChange}
                className="input input-bordered w-full"
                >
                {["Pending", "Processing", "Delivered", "Cancelled"].map((status) => (
                    <option key={status} value={status}>{status}</option>
                ))}
                </select>
                {formik.touched.status && formik.errors.status && (
                <p className="text-sm text-red-500">{formik.errors.status}</p>
                )}
            </div>
            </div>

            <h3 className="text-lg font-semibold mt-6">Items</h3>
            <div className="space-y-4">
            {formik.values.items.map((item, index) => (
                <div key={item.id} className="grid md:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium">Producto</label>
                    <input
                    type="text"
                    name={`items[${index}].productName`}
                    value={item.productName}
                    onChange={formik.handleChange}
                    className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Marca</label>
                    <input
                    type="text"
                    name={`items[${index}].productBrand`}
                    value={item.productBrand}
                    onChange={formik.handleChange}
                    className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Cantidad</label>
                    <input
                    type="number"
                    name={`items[${index}].quantity`}
                    value={item.quantity}
                    onChange={formik.handleChange}
                    className="input input-bordered w-full"
                    min={1}
                    />
                </div>
                </div>
            ))}
            </div>

            <button
            type="submit"
            className="btn btn-primary mt-6"
            >
            Guardar Cambios
            </button>
        </form>
        </div>
    );
    }
