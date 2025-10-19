import { Form, ErrorMessage, Field, FieldArray, Formik } from "formik";
import {  useState } from "react";
import { UpdateOrderRequest } from "../../types/OrderTypes";
import { CustomerPaymenType } from "../../types/CustomerTypes";
import { AddressRequest } from "../../types/CustomerTypes";
import { EditOrderValidationSchema } from "../../validations/orderSchemas";

interface EditOrderFormProps {
  initialValues: UpdateOrderRequest;
  onSubmit: (values: UpdateOrderRequest) => void;
  isSubmitting: boolean;
  savedAddresses?: AddressRequest[];
  paymentTypes: CustomerPaymenType[]; // ✅ agregado para recibir desde la page
  onItemsChange?: (
    items: Array<{ id: number; productName: string; productBrand: string; quantity: number }>
  ) => void;
}

export default function EditOrderForm({
  initialValues,
  onSubmit,
  isSubmitting,
  savedAddresses = [],
  paymentTypes,
  onItemsChange,
}: EditOrderFormProps) {
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState<number | null>(
    initialValues.deliveryAddress?.id ?? null
  );

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

  const handleSavedAddressChange = (id: number) => {
    setSelectedSavedAddressId(id);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={EditOrderValidationSchema}
      enableReinitialize
      onSubmit={(values) => {
        console.log("Valores enviados al backend:", values);
        if (selectedSavedAddressId != null) {
          const savedAddress = savedAddresses.find((addr) => addr.id === selectedSavedAddressId);
          if (savedAddress) {
            values.addressRequest = { ...savedAddress };
          }
        }
        onSubmit(values);
      }}
    >
      {({ values, setFieldValue }) => (
        <Form className="space-y-6 container mx-auto py-10 px-16 sm:max-w-6xl">
          {/* Fecha de entrega */}
          <div>
            <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-900 mb-1">
              Fecha de entrega
            </label>
            <Field
              name="deliveryDate"
              type="date"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
            />
            <ErrorMessage name="deliveryDate" component="div" className="text-red-700 text-sm pt-1" />
          </div>

          {/* Dirección guardada */}
          {savedAddresses.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Usar dirección guardada
              </label>
              <select
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
                value={selectedSavedAddressId ?? ""}
                onChange={(e) => handleSavedAddressChange(Number(e.target.value))}
              >
                <option value="">Ingresar dirección manual</option>
                {savedAddresses.map((addr) => (
                  <option key={addr.id} value={addr.id}>
                    {addr.street} {addr.number}, {addr.city}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Dirección manual */}
          {selectedSavedAddressId == null && (
            <div className="grid grid-cols-2 gap-3 mt-3">
              {[
                { name: "street", placeholder: "Calle" },
                { name: "number", placeholder: "Número" },
                { name: "apartment", placeholder: "Depto (opcional)", col: 2 },
                { name: "city", placeholder: "Ciudad" },
                { name: "province", placeholder: "Provincia" },
                { name: "country", placeholder: "País" },
                { name: "postalCode", placeholder: "Código Postal" },
              ].map((field) => (
                <Field
                  key={field.name}
                  name={`addressRequest.${field.name}`}
                  placeholder={field.placeholder}
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200 ${
                    field.col ? `col-span-${field.col}` : ""
                  }`}
                />
              ))}
            </div>
          )}

          {/* Tipo de pago */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Tipo de pago
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
            <ErrorMessage name="paymentType" component="div" className="text-red-700 text-sm pt-1" />
          </div>

          {/* Detalles de entrega */}
          <div>
            <label htmlFor="deliveryDetail" className="block text-sm font-medium text-gray-900 mb-1">
              Detalles de entrega
            </label>
            <Field
              as="textarea"
              name="deliveryDetail"
              rows={3}
              placeholder="Ej. Dejar en portería..."
              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
            />
            <ErrorMessage name="deliveryDetail" component="div" className="text-red-700 text-sm pt-1" />
          </div>

          {/* Estado */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-900 mb-1">
              Estado
            </label>
            <Field
              as="select"
              name="status"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
            >
              <option value="">Seleccionar estado</option>
              <option value="Pending">Pendiente</option>
              <option value="Issued">Emitido</option>
              <option value="Canceled">Cancelado</option>
            </Field>
            <ErrorMessage name="status" component="div" className="text-red-700 text-sm pt-1" />
          </div>

          {/* Items */}
          <FieldArray name="items">
            {({ push }) => (
              <div className="space-y-4 pt-2">
                <table className="table-fixed w-full border-separate">
                  <thead>
                    <tr>
                      <th className="w-1/3 text-left px-4 py-2">Productos</th>
                      <th className="w-1/3 text-left px-4 py-2">Marca</th>
                      <th className="w-1/3 text-left px-4 py-2">Cantidad</th>
                      <th className="w-1/8 text-left px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {values.items.map((item, index) => {
                      const handleRemove = () => {
                        const newItems = [...values.items];
                        newItems.splice(index, 1);
                        setFieldValue("items", newItems);
                        if (onItemsChange) onItemsChange(newItems);
                      };

                      return (
                        <tr key={item.id || index} className="align-top">
                          <td className="pr-2 px-4 py-2">
                            <Field
                              name={`items[${index}].productName`}
                              className="block w-full rounded-md bg-white px-3 py-1.5 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
                            />
                          </td>
                          <td className="pr-2 px-4 py-2">
                            <Field
                              name={`items[${index}].productBrand`}
                              className="block w-full rounded-md bg-white px-3 py-1.5 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
                            />
                          </td>
                          <td className="pr-2 px-4 py-2">
                            <Field
                              name={`items[${index}].quantity`}
                              type="number"
                              min={1}
                              className="block w-full rounded-md bg-white px-3 py-1.5 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
                            />
                          </td>
                          <td className="p-2 px-4 py-2 text-center">
                            <button
                              type="button"
                              disabled={values.items.length === 1}
                              onClick={handleRemove}
                              className="block w-full rounded-md text-red-700 font-semibold bg-white px-3 py-1.5 hover:bg-red-600 hover:text-white transition duration-150"
                            >
                              Quitar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td colSpan={4} className="p-2 text-left">
                        <button
                          type="button"
                          onClick={() => push({ productName: "", productBrand: "", quantity: 1 })}
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

          {/* Submit */}
          <div className="mt-10">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full justify-center items-center rounded-md bg-red-700 px-3 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-red-600 transition duration-150 disabled:opacity-50"
            >
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
