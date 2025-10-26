import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { registerOrderValidationSchema } from "../../validations/orderSchemas";
import type { Customer, Address } from "../../types/CustomerTypes";
import { RegisterOrderRequest } from "../../types/OrderTypes";
import { getCustomerAddresses, getCustomerPaymentTypes } from "../../services/OrderService";

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


  // Traductor de tipos de pago
  const getPaymentTypeLabel = (paymentType: string): string => {
    if (!paymentType) return "Tipo de pago desconocido";

    // Normalizamos (por si vienen con mayúsculas mezcladas)
    const normalized = paymentType
      .replace(/([A-Z])/g, "_$1") // pone guión antes de cada mayúscula
      .toLowerCase() // todo minúscula
      .replace(/__+/g, "_"); // limpia posibles dobles guiones bajos

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
    console.log("Valores del formulario al enviar:", values);
    onSubmit(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={registerOrderValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => {
        console.log("Valores actuales del formulario:", values);

        // Trae direcciones del cliente
        useEffect(() => {
          const fetchAddresses = async () => {
            if (values.customerId) {
              try {
                const data = await getCustomerAddresses(values.customerId);
                setAddresses(data);
                setFieldValue("deliveryAddressId", "");
              } catch (error) {
                console.error("Error al traer direcciones:", error);
                setAddresses([]);
              }
            } else {
              setAddresses([]);
            }
          };
          fetchAddresses();
        }, [values.customerId, setFieldValue]);

        // Trae tipos de pago del cliente
        // ✅ Trae y mapea tipos de pago del cliente
        useEffect(() => {
          const fetchPaymentTypes = async () => {
            if (values.customerId) {
              try {
                const data = await getCustomerPaymentTypes(values.customerId);
  

                // Mapeo correcto
                const mapped = data.map((pt: any) => ({
                  id: pt.id,
                  paymentType: pt.paymentType, // el enum string (ej: "Cash")
                }));

                setPaymentTypes(mapped);
                setFieldValue("paymentType", ""); // antes era paymentTypeId
              } catch (error) {
                console.error("Error al traer tipos de pago:", error);
                setPaymentTypes([]);
              }
            } else {
              setPaymentTypes([]);
            }
          };
          fetchPaymentTypes();
        }, [values.customerId, setFieldValue]);


        const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedAddressId = e.target.value ? Number(e.target.value) : null;

        // ✅ Guardamos deliveryAddressId como número
        setFieldValue("deliveryAddressId", selectedAddressId);

        if (selectedAddressId) {
          // ✅ Si seleccionó una dirección existente, limpiamos los campos manuales
          setFieldValue("deliveryAddress", {
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
          });
        } else {
          // ✅ Si el usuario elige "ninguna", puede ingresar manualmente
          setFieldValue("deliveryAddress", {
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
          });
        }
      };

        return (
          <Form className="space-y-6 container mx-auto py-10 px-16 sm:max-w-6xl">
            {/* Cliente */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Cliente
              </label>
              <Field
                as="select"
                name="customerId"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
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
                className="text-red-700 text-sm pt-1"
              />
            </div>

            {/* Fecha de entrega */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Fecha de entrega
              </label>
              <Field
                type="date"
                name="deliveryDate"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
              />
              <ErrorMessage
                name="deliveryDate"
                component="div"
                className="text-red-700 text-sm pt-1"
              />
            </div>

            {/* Dirección */}
            {values.customerId && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Dirección de entrega
                </label>
                {addresses.length > 0 && (
                  <Field
                    as="select"
                    name="deliveryAddressId"
                    onChange={handleAddressChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
                  >
                    <option value="">
                      Seleccione una dirección o complete manualmente
                    </option>
                    {addresses.map((addr: Address) => (
                      <option key={addr.id} value={addr.id}>
                        {addr.street} {addr.number}, {addr.city}, {addr.province}
                      </option>
                    ))}
                  </Field>
                )}
                {/* Campos de dirección manual */}
                {!values.deliveryAddressId && (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <Field
                      name="deliveryAddress.street"
                      placeholder="Calle"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
                    />
                    <Field
                      name="deliveryAddress.number"
                      placeholder="Número"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
                    />
                    <Field
                      name="deliveryAddress.apartment"
                      placeholder="Depto (opcional)"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200 col-span-2"
                    />
                    <Field
                      name="deliveryAddress.city"
                      placeholder="Ciudad"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
                    />
                    <Field
                      name="deliveryAddress.province"
                      placeholder="Provincia"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
                    />
                    <Field
                      name="deliveryAddress.country"
                      placeholder="País"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
                    />
                    <Field
                      name="deliveryAddress.postalCode"
                      placeholder="Código Postal"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Tipo de Pago */}
            {values.customerId && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Tipo de Pago
                </label>
                {paymentTypes.length > 0 ? (
                  <Field
                    as="select"
                    name="paymentType"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
                  >
                    <option value="">Seleccione un tipo de pago</option>
                    {paymentTypes.map((p) => (
                      <option key={p.id} value={p.paymentType}>
                        {getPaymentTypeLabel(p.paymentType)}
                      </option>
                    ))}
                  </Field>
                ) : (
                  <p className="text-gray-600 italic">
                    No hay tipos de pago disponibles para este cliente.
                  </p>
                )}
                <ErrorMessage
                  name="paymentType"  // <-- Cambiar de "paymentTypeId" a "paymentType"
                  component="div"
                  className="text-red-700 text-sm pt-1"
                />
              </div>
            )}


            {/* Items */}
            <FieldArray name="items">
              {({ push, remove }) => (
                <div className="space-y-4 pt-2">
                  <table className="table-fixed w-full border-separate">
                    <thead>
                      <tr>
                        <th className="w-1/3 text-left px-4 py-2">Producto</th>
                        <th className="w-1/3 text-left px-4 py-2">Marca</th>
                        <th className="w-1/3 text-left px-4 py-2">Cantidad</th>
                        <th className="w-1/8 text-left px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {values.items.map((_, index) => (
                        <tr key={index} className="align-top">
                          <td className="pr-2 px-4 py-2">
                            <Field
                              name={`items.${index}.productName`}
                              placeholder="Producto"
                              className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
                            />
                          </td>
                          <td className="pr-2 px-4 py-2">
                            <Field
                              name={`items.${index}.productBrand`}
                              placeholder="Marca"
                              className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
                            />
                          </td>
                          <td className="pr-2 px-4 py-2">
                            <Field
                              name={`items.${index}.quantity`}
                              type="number"
                              min={1}
                              className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
                            />
                          </td>
                          <td className="p-2 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              disabled={values.items.length === 1}
                              className="block w-full rounded-md text-red-700 font-semibold bg-white px-3 py-1.5 hover:bg-red-600 hover:text-white transition duration-150"
                            >
                              Quitar
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={4} className="p-2 text-left">
                          <button
                            type="button"
                            onClick={() =>
                              push({
                                productName: "",
                                productBrand: "",
                                quantity: 1,
                              })
                            }
                            className="text-sm font-semibold text-red-700 hover:text-red-600"
                          >
                            + Agregar Producto
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </FieldArray>

            {/* Detalle adicional */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Detalles de entrega
              </label>
              <Field
                as="textarea"
                name="deliveryDetail"
                rows={3}
                placeholder="Ej. Dejar en portería..."
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
              />
              <ErrorMessage
                name="deliveryDetail"
                component="div"
                className="text-red-700 text-sm pt-1"
              />
            </div>

            {/* Botón submit */}
            <div className="mt-10">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full justify-center items-center rounded-md bg-red-700 px-3 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-red-600 transition duration-150 disabled:opacity-50"
              >
                {isSubmitting ? "Registrando..." : "Registrar Pedido"}
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default RegisterOrderForm;
