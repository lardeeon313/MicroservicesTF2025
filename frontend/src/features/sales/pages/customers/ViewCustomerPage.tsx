import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { User, Mail, Phone, MapPin, CreditCard, Edit, AlertCircle, Info } from "lucide-react";
import { CustomerResponse, CustomerPaymenType } from "../../types/CustomerTypes";
import { getCustomerById } from "../../services/CustomerService";
import { getCustomerPaymentTypes } from "../../services/OrderService";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import BackButton from "../../../../components/BackButton";
import EmptyState from "../../../../components/EmptyState";
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
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
        <BackButton to="/sales/Customers" />

        {/* Header Section */}
        <div className="text-center mb-10 mt-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mb-4">
            <User className="w-7 h-7 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Detalles del Cliente
          </h1>
        </div>

        <div className="space-y-6">
          {/* Customer Information Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-red-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Info className="w-4 h-4 text-red-600 font-bold" />
                </div>
                Información Personal
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white font-bold" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Nombre Completo
                    </label>
                    <p className="text-base font-medium text-gray-900">
                      {customer.firstName} {customer.lastName}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white font-bold" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Email
                    </label>
                    <p className="text-base text-gray-900">
                      {customer.email}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white font-bold" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Teléfono
                    </label>
                    <p className="text-base text-gray-900">
                      {customer.phoneNumber}
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3 md:col-span-2">
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white font-bold" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Dirección Principal
                    </label>
                    <p className="text-base text-gray-900">
                      {customer.addresses && customer.addresses.length > 0
                        ? `${customer.addresses[0].street} ${customer.addresses[0].number}${
                            customer.addresses[0].apartment
                              ? `, ${customer.addresses[0].apartment}`
                              : ""
                          }, ${customer.addresses[0].city}, ${customer.addresses[0].province}, ${customer.addresses[0].country}`
                        : "Sin dirección registrada"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* All Addresses Card */}
          {customer.addresses && customer.addresses.length > 1 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-red-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-red-600 font-bold" />
                  </div>
                  Todas las Direcciones
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {customer.addresses.map((address, index) => (
                    <div
                      key={address.id || index}
                      className="bg-gray-50 rounded-lg p-4 border border-red-200 shadow-red-100 shadow-sm"
                    >
                      <p className="text-sm font-medium text-gray-900">
                        {address.street} {address.number}
                        {address.apartment && `, ${address.apartment}`}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {address.city}, {address.province}
                      </p>
                      <p className="text-sm text-gray-600">
                        {address.country} - CP: {address.postalCode}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Payment Types Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-red-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-red-600 font-bold" />
                </div>
                Tipos de Pago Asociados
              </h2>
            </div>
            <div className="p-6">
              {loadingPayments ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin" />
                  <p className="ml-3 text-gray-600">Cargando tipos de pago...</p>
                </div>
              ) : paymentTypes.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 italic">No hay tipos de pago registrados.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paymentTypes.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg p-4 border border-red-200 shadow-red-100 shadow-sm hover:border-gray-300 transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-900">
                        {getPaymentTypeLabel(p.paymentType)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <Link
              to={`/sales/customer/update/${customer.id}`}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg font-semibold shadow-sm transition-all hover:bg-red-700"
            >
              <Edit className="w-4 h-4" />
              Editar Cliente
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCustomerPage;