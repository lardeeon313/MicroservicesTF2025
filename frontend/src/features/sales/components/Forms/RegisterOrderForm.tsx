import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { User, Calendar, MapPin, CreditCard, Package, Plus, Trash2, FileText, AlertCircle } from "lucide-react";
import { registerOrderValidationSchema } from "../../validations/orderSchemas";
import type { Customer, Address } from "../../types/CustomerTypes";
import { RegisterOrderRequest } from "../../types/OrderTypes";
import { getCustomerAddresses, getCustomerPaymentTypes } from "../../services/OrderService";
import toast from "react-hot-toast";

interface Props {
  customers: Customer[];
  onSubmit: (values: RegisterOrderRequest) => void;
  initialValues: RegisterOrderRequest;
  isSubmitting: boolean;
}

const RegisterOrderForm: React.FC<Props> = ({
  customers,
  onSubmit,
  initialValues,
  isSubmitting,
}) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<{ id: number; paymentType: string }[]>([]);

  const getPaymentTypeLabel = (paymentType: string): string => {
    if (!paymentType) return "Tipo de pago desconocido";

    const normalized = paymentType
      .replace(/([A-Z])/g, "_$1")
      .toLowerCase()
      .replace(/__+/g, "_");

    const labels: Record<string, string> = {
      transfer: "Transferencia",
      credit_card: "Tarjeta de crédito",
      debit_card: "Tarjeta de débito",
      cash: "Efectivo",
      current_account: "Cuenta corriente",
      check: "Cheque",
      promissory_note: "Pagaré",
    };

    return labels[normalized] ?? paymentType;
  };

  const handleSubmit = (values: RegisterOrderRequest) => {
    const isManualAddress = !values.deliveryAddressId;

    const payload: RegisterOrderRequest = {
      ...values,
      deliveryAddressId: isManualAddress ? null : values.deliveryAddressId,
      deliveryAddress: isManualAddress
        ? {
            street: values.deliveryAddress?.street ?? "",
            number: values.deliveryAddress?.number ?? "",
            apartment: values.deliveryAddress?.apartment,
            city: values.deliveryAddress?.city ?? "",
            province: values.deliveryAddress?.province ?? "",
            country: values.deliveryAddress?.country ?? "",
            postalCode: values.deliveryAddress?.postalCode,
            formattedAddress: values.deliveryAddress?.formattedAddress,
          }
        : undefined,
    };
    onSubmit(payload);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={registerOrderValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, errors, touched }) => {
        // Fetch addresses
        useEffect(() => {
          const fetchAddresses = async () => {
            if (values.customerId) {
              try {
                const data = await getCustomerAddresses(values.customerId);
                setAddresses(data);
                setFieldValue("deliveryAddressId", null);
              } catch (error) {
                toast.error("Error al traer direcciones.");
                setAddresses([]);
              }
            } else {
              setAddresses([]);
            }
          };
          fetchAddresses();
        }, [values.customerId, setFieldValue]);

        // Fetch payment types
        useEffect(() => {
          const fetchPaymentTypes = async () => {
            if (values.customerId) {
              try {
                const data = await getCustomerPaymentTypes(values.customerId);
                const mapped = data.map((pt: any) => ({
                  id: pt.id,
                  paymentType: pt.paymentType,
                }));
                setPaymentTypes(mapped);
                setFieldValue("paymentType", "");
              } catch (error) {
                toast.error("Error al traer tipos de pago.");
                setPaymentTypes([]);
              }
            } else {
              setPaymentTypes([]);
            }
          };
          fetchPaymentTypes();
        }, [values.customerId, setFieldValue]);

        const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
          const selectedAddressId = e.target.value;

          if (selectedAddressId) {
            setFieldValue("deliveryAddressId", Number(selectedAddressId));
            const selectedAddress = addresses.find(
              (addr) => addr.id === Number(selectedAddressId)
            );

            if (selectedAddress) {
              setFieldValue("deliveryAddress", {
                street: selectedAddress.street,
                number: selectedAddress.number,
                apartment: selectedAddress.apartment || "",
                city: selectedAddress.city,
                province: selectedAddress.province,
                country: selectedAddress.country,
                postalCode: selectedAddress.postalCode,
              });
            }
          } else {
            setFieldValue("deliveryAddressId", null);
            setFieldValue("deliveryAddress", {
              id: null,
              street: "",
              number: "",
              apartment: "",
              city: "",
              province: "",
              country: "",
              postalCode: "",
              latitude: null,
              longitude: null,
              formattedAddress: null,
            });
          }
        };

        return (
          <Form className="p-8 space-y-8">
            {/* Customer Selection Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white font-bold" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Cliente</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccione el cliente <span className="text-red-600">*</span>
                </label>
                <Field
                  as="select"
                  name="customerId"
                  className={`block w-full rounded-lg border ${
                    errors.customerId && touched.customerId
                      ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                      : "border-gray-300 bg-white"
                  } px-4 py-2.5 text-gray-900 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors focus:outline-none`}
                >
                  <option value="">Seleccione un cliente</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.firstName} {c.lastName}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="customerId"
                  component="div"
                  className="text-red-600 text-sm mt-2 flex items-center gap-1.5 font-medium bg-red-50 px-3 py-2 rounded-md"
                >
                  {(msg) => (
                    <>
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{msg}</span>
                    </>
                  )}
                </ErrorMessage>
              </div>
            </div>

            {/* Delivery Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white font-bold" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Información de Entrega</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de entrega <span className="text-red-600">*</span>
                </label>
                <Field
                  type="date"
                  name="deliveryDate"
                  className={`block w-full rounded-lg border ${
                    errors.deliveryDate && touched.deliveryDate
                      ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                      : "border-gray-300 bg-white"
                  } px-4 py-2.5 text-gray-900 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors focus:outline-none`}
                />
                <ErrorMessage
                  name="deliveryDate"
                  component="div"
                  className="text-red-600 text-sm mt-2 flex items-center gap-1.5 font-medium bg-red-50 px-3 py-2 rounded-md"
                >
                  {(msg) => (
                    <>
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{msg}</span>
                    </>
                  )}
                </ErrorMessage>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detalles de entrega
                </label>
                <Field
                  as="textarea"
                  name="deliveryDetail"
                  rows={3}
                  placeholder="Ej. Dejar en portería, tocar timbre 3 veces..."
                  className={`block w-full rounded-lg border ${
                    errors.deliveryDetail && touched.deliveryDetail
                      ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                      : "border-gray-300 bg-white"
                  } px-4 py-2.5 text-gray-900 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors resize-none focus:outline-none`}
                />
                <ErrorMessage
                  name="deliveryDetail"
                  component="div"
                  className="text-red-600 text-sm mt-2 flex items-center gap-1.5 font-medium bg-red-50 px-3 py-2 rounded-md"
                >
                  {(msg) => (
                    <>
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{msg}</span>
                    </>
                  )}
                </ErrorMessage>
              </div>
            </div>

            {/* Address Section */}
            {values.customerId && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-white font-bold" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Dirección de Entrega</h3>
                </div>

                {addresses.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seleccione una dirección guardada
                    </label>
                    <Field
                      as="select"
                      name="deliveryAddressId"
                      onChange={handleAddressChange}
                      className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors focus:outline-none"
                    >
                      <option value="">Seleccione una dirección o complete manualmente</option>
                      {addresses.map((addr: Address) => (
                        <option key={addr.id} value={addr.id}>
                          {addr.street} {addr.number}, {addr.city}, {addr.province}
                        </option>
                      ))}
                    </Field>
                  </div>
                )}

                {!values.deliveryAddressId && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Calle <span className="text-red-600">*</span>
                      </label>
                      <Field
                        name="deliveryAddress.street"
                        placeholder="Ingrese la calle"
                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número <span className="text-red-600">*</span>
                      </label>
                      <Field
                        name="deliveryAddress.number"
                        placeholder="Número"
                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Departamento (opcional)
                      </label>
                      <Field
                        name="deliveryAddress.apartment"
                        placeholder="Piso/Dpto"
                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ciudad <span className="text-red-600">*</span>
                      </label>
                      <Field
                        name="deliveryAddress.city"
                        placeholder="Ciudad"
                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Provincia <span className="text-red-600">*</span>
                      </label>
                      <Field
                        name="deliveryAddress.province"
                        placeholder="Provincia"
                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        País <span className="text-red-600">*</span>
                      </label>
                      <Field
                        name="deliveryAddress.country"
                        placeholder="País"
                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Código Postal <span className="text-red-600">*</span>
                      </label>
                      <Field
                        name="deliveryAddress.postalCode"
                        placeholder="CP"
                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Payment Type Section */}
            {values.customerId && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-white font-bold" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Tipo de Pago</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccione el tipo de pago <span className="text-red-600">*</span>
                  </label>
                  {paymentTypes.length > 0 ? (
                    <>
                      <Field
                        as="select"
                        name="paymentType"
                        className={`block w-full rounded-lg border ${
                          errors.paymentType && touched.paymentType
                            ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                            : "border-gray-300 bg-white"
                        } px-4 py-2.5 text-gray-900 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors focus:outline-none`}
                      >
                        <option value="">Seleccione un tipo de pago</option>
                        {paymentTypes.map((p) => (
                          <option key={p.id} value={p.paymentType}>
                            {getPaymentTypeLabel(p.paymentType)}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="paymentType"
                        component="div"
                        className="text-red-600 text-sm mt-2 flex items-center gap-1.5 font-medium bg-red-50 px-3 py-2 rounded-md"
                      >
                        {(msg) => (
                          <>
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{msg}</span>
                          </>
                        )}
                      </ErrorMessage>
                    </>
                  ) : (
                    <p className="text-gray-500 italic text-sm bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                      No hay tipos de pago disponibles para este cliente.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Products Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-white font-bold" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Productos</h3>
              </div>

              <FieldArray name="items">
                {({ push, remove }) => (
                  <div className="space-y-4">
                    {values.items.map((_, index) => {
                      const itemErrors = errors.items?.[index] as any;
                      const itemTouched = touched.items?.[index] as any;

                      return (
                        <div
                          key={index}
                          className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:border-gray-300 transition-colors"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                Producto <span className="text-red-600">*</span>
                              </label>
                              <Field
                                name={`items.${index}.productName`}
                                placeholder="Nombre del producto"
                                className={`block w-full rounded-lg border ${
                                  itemErrors?.productName && itemTouched?.productName
                                    ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                                    : "border-gray-300 bg-white"
                                } px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors focus:outline-none`}
                              />
                              <ErrorMessage
                                name={`items.${index}.productName`}
                                component="div"
                                className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium"
                              >
                                {(msg) => (
                                  <>
                                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                    <span>{msg}</span>
                                  </>
                                )}
                              </ErrorMessage>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                Marca <span className="text-red-600">*</span>
                              </label>
                              <Field
                                name={`items.${index}.productBrand`}
                                placeholder="Marca del producto"
                                className={`block w-full rounded-lg border ${
                                  itemErrors?.productBrand && itemTouched?.productBrand
                                    ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                                    : "border-gray-300 bg-white"
                                } px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors focus:outline-none`}
                              />
                              <ErrorMessage
                                name={`items.${index}.productBrand`}
                                component="div"
                                className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium"
                              >
                                {(msg) => (
                                  <>
                                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                    <span>{msg}</span>
                                  </>
                                )}
                              </ErrorMessage>
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-medium text-gray-700">
                                  Cantidad <span className="text-red-600">*</span>
                                </label>
                                {values.items.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="inline-flex items-center focus:outline-none gap-1 text-xs font-medium text-red-600 hover:text-red-700 transition-colors"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    Quitar
                                  </button>
                                )}
                              </div>
                              <Field
                                name={`items.${index}.quantity`}
                                type="number"
                                min={1}
                                placeholder="Cantidad"
                                className={`block w-full rounded-lg border ${
                                  itemErrors?.quantity && itemTouched?.quantity
                                    ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                                    : "border-gray-300 bg-white"
                                } px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors focus:outline-none`}
                              />
                              <ErrorMessage
                                name={`items.${index}.quantity`}
                                component="div"
                                className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium"
                              >
                                {(msg) => (
                                  <>
                                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                    <span>{msg}</span>
                                  </>
                                )}
                              </ErrorMessage>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => push({ productName: "", productBrand: "", quantity: 1 })}
                      className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors focus:outline-none"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar Producto
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-red-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-red-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Registrando orden...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    Registrar Pedido
                  </>
                )}
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default RegisterOrderForm;