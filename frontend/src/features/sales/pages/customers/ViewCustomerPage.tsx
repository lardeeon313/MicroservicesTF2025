import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CustomerResponse, CustomerPaymenType } from "../../types/CustomerTypes";
import { getCustomerById } from "../../services/CustomerService";
import { getCustomerPaymentTypes } from "../../services/OrderService";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import BackButton from "../../../../components/BackButton";
import EmptyState from "../../../../components/EmptyState";
import { AlertCircle } from "lucide-react";
import { getPaymentTypeLabel } from "../../constants/CustomerPaymentTypesLabel";

const ViewCustomerPage = () => {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<CustomerResponse | null>(null);
  const [paymentTypes, setPaymentTypes] = useState<CustomerPaymenType[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data = await getCustomerById(id!);
        setCustomer(data);
      } catch {
        toast.error("No se pudo cargar el cliente.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCustomer();
  }, [id]);

  useEffect(() => {
    const fetchPaymentTypes = async () => {
      try {
        const data = await getCustomerPaymentTypes(id!);
        setPaymentTypes(data);
      } catch {
        toast.error("No se pudieron cargar los tipos de pago.");
      } finally {
        setLoadingPayments(false);
      }
    };
    if (id) fetchPaymentTypes();
  }, [id]);

  if (loading)
    return <LoadingSpinner message="Cargando cliente..." height="h-screen" />;

  if (!customer)
    return (
      <EmptyState
        icon={AlertCircle}
        title="Cliente no encontrado"
        description="Ha ocurrido un error, no se encontró el cliente"
      />
    );

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/sales/Customers" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-4xl font-bold text-red-600 mb-2">
            Detalles del Cliente
          </h2>
          <p className="text-center text-lg text-gray-700 mb-12">
            Aquí puedes ver los detalles completos del cliente
          </p>
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 space-y-10">
            {/* Datos del cliente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Nombre:</label>
                <p className="rounded-md bg-gray-50 px-3 py-2 text-gray-900 shadow-sm">
                  {customer.firstName} {customer.lastName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email:</label>
                <p className="rounded-md bg-gray-50 px-3 py-2 text-gray-900 shadow-sm">
                  {customer.email}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Teléfono:</label>
                <p className="rounded-md bg-gray-50 px-3 py-2 text-gray-900 shadow-sm">
                  {customer.phoneNumber}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Dirección:</label>
                <p className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-gray-900 shadow-sm">
                  {customer.addresses && customer.addresses.length > 0
                    ? `${customer.addresses[0].street} ${customer.addresses[0].number}${
                        customer.addresses[0].apartment
                          ? ", " + customer.addresses[0].apartment
                          : ""
                      }, ${customer.addresses[0].city}, ${customer.addresses[0].province}, ${customer.addresses[0].country}`
                    : "Sin dirección"}
                </p>
              </div>
            </div>
            {/* Tipos de pago asociados */}
            <div className="border-t pt-8">
              <h3 className="text-2xl font-semibold text-red-600 mb-4">
                Tipos de Pago Asociados
              </h3>
              {loadingPayments ? (
                <p className="text-gray-500">Cargando tipos de pago...</p>
              ) : paymentTypes.length === 0 ? (
                <p className="text-gray-600 italic">No hay tipos de pago registrados.</p>
              ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paymentTypes.map((p) => (
                  <li
                    key={p.id}
                    className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 shadow-sm text-gray-800"
                  >
                    {getPaymentTypeLabel(p.paymentType)}
                  </li>
                ))}
                </ul>
              )}
            </div>
            {/* Botón de editar */}
            <div className="flex justify-end mt-6">
              <Link
                to={`/sales/customer/update/${customer.id}`}
                className="px-6 py-2 bg-red-600 text-white rounded-lg shadow font-bold transition hover:bg-red-700"
              >
                Editar Cliente
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ViewCustomerPage;
