import { Form, ErrorMessage, Field, FieldArray, Formik } from "formik";
import { UpdateOrderRequest } from "../../types/OrderTypes";
import { EditOrderValidationSchema } from "../../validations/orderSchemas";

interface EditOrderFormProps {
    initialValues: UpdateOrderRequest;
    onSubmit: (values: UpdateOrderRequest) => void;
    isSubmitting: boolean;
}

export default function EditOrderForm ({
    initialValues,
    onSubmit,
    isSubmitting,
}: EditOrderFormProps) {
    return (
        <Formik
      initialValues={initialValues}
      validationSchema={EditOrderValidationSchema}
      onSubmit={onSubmit}
    >
      {({ values }) => (
        <Form className="space-y-6 mt-10 w-3xl">
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

          {/* Detalles de entrega */}
          <div>
            <label htmlFor="deliveryDetail" className="block text-sm font-medium text-gray-900 mb-1">
              Detalles de entrega
            </label>
            <Field
              as="textarea"
              name="deliveryDetail"
              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
            />
            <ErrorMessage name="deliveryDetail" component="div" className="text-red-700 text-sm pt-1" />
          </div>

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
            {({ remove, push }) => (
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
                    {values.items.map((_, index) => (
                      <tr key={index} className="align-top">
                        <td className="pr-2 px-4 py-2">
                          <Field
                            name={`items[${index}].productName`}
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
                          />
                          <ErrorMessage
                            name={`items[${index}].productName`}
                            component="div"
                            className="text-red-700 text-sm"
                          />
                        </td>
                        <td className="pr-2 px-4 py-2">
                          <Field
                            name={`items[${index}].productBrand`}
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
                          />
                          <ErrorMessage
                            name={`items[${index}].productBrand`}
                            component="div"
                            className="text-red-700 text-sm"
                          />
                        </td>
                        <td className="pr-2 px-4 py-2">
                          <Field
                            name={`items[${index}].quantity`}
                            type="number"
                            min={1}
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900  outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
                          />
                          <ErrorMessage
                            name={`items[${index}].quantity`}
                            component="div"
                            className="text-red-700 text-sm pt-1"
                          />
                        </td>
                        <td className="p-2 px-4 py-2 text-center">
                          <button
                            type="button"
                            disabled={values.items.length === 1}
                            onClick={() => remove(index)}
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
              {isSubmitting ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8h4z" />
                </svg>
              ) : (
                "Guardar Cambios"
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
    )
}
