import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import { updateCustomerSchema } from "../../validations/customerSchemas";
import { UpdateCustomerRequest, AddressRequest } from "../../types/CustomerTypes";
import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { PaymentType } from "../../types/OrderTypes";
import { getPaymentTypeLabel } from "../../constants/CustomerPaymentTypesLabel";

interface Props {
  initialValues: UpdateCustomerRequest;
  onSubmit: (values: UpdateCustomerRequest) => void;
  isSubmitting?: boolean;
}

type FormAddress = AddressRequest & { tempId: string };

const EditCustomerForm = ({ initialValues, onSubmit, isSubmitting }: Props) => {
  const originalPaymentTypes = useMemo(
    () => initialValues.paymentTypes || [],
    [initialValues.paymentTypes]
  );

  const normalizedInitialValues = useMemo(() => {
    const addresses: FormAddress[] = initialValues.addresses?.length
      ? initialValues.addresses.map((addr) => ({
          ...addr,
          number: addr.number?.toString() || "",
          tempId: uuidv4(),
        }))
      : [
          {
            street: "",
            number: "",
            apartment: "",
            city: "",
            province: "",
            country: "",
            postalCode: "",
            latitude: null,
            longitude: null,
            formattedAddress: undefined,
            tempId: uuidv4(),
          },
        ];
    return {
      ...initialValues,
      addresses,
      paymentTypes: initialValues.paymentTypes || [],
    };
  }, [initialValues]);

  return (
    <Formik
      initialValues={normalizedInitialValues}
      validationSchema={updateCustomerSchema}
      enableReinitialize
      onSubmit={(values) => {
        const valuesToSubmit: UpdateCustomerRequest = {
          ...values,
          addresses: values.addresses.map(({ tempId, ...rest }) => ({
            ...rest,
            number: rest.number.toString(),
          })),
        };
        onSubmit(valuesToSubmit);
      }}
    >
      {({ values, setFieldValue }) => (
        <Form className="space-y-6 container mx-auto py-10 px-16 sm:max-w-6xl">
          <Field type="hidden" name="id" />

          {/* Datos básicos */}
          <h3 className="text-lg font-semibold mb-4">Datos de Contacto</h3>
          {["firstName", "lastName", "email", "phoneNumber"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                {field === "firstName" && "Nombre"}
                {field === "lastName" && "Apellido"}
                {field === "email" && "Email"}
                {field === "phoneNumber" && "Teléfono"}
              </label>
              <Field
                type={field === "email" ? "email" : "text"}
                name={field}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
                placeholder={`Ingrese ${field}`}
              />
              <ErrorMessage name={field} component="div" className="text-red-500 text-sm" />
            </div>
          ))}

          {/* Direcciones */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Direcciones</h3>
            <FieldArray name="addresses">
              {({ push, remove }) => (
                <div className="space-y-4">
                  {values.addresses.map((address: FormAddress, index: number) => (
                    <div
                      key={address.tempId}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start border-b pb-4"
                    >
                      {[
                        { name: "street", label: "Calle" },
                        { name: "number", label: "Número" },
                        { name: "apartment", label: "Departamento" },
                        { name: "city", label: "Ciudad" },
                        { name: "province", label: "Provincia" },
                        { name: "country", label: "País" },
                        { name: "postalCode", label: "Código Postal" },
                      ].map((field) => (
                        <div key={field.name}>
                          <label className="block text-sm font-medium text-gray-900 mb-1">
                            {field.label}
                          </label>
                          <Field
                            name={`addresses[${index}].${field.name}`}
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300"
                          />
                          <ErrorMessage
                            name={`addresses[${index}].${field.name}`}
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                      ))}
                      <div className="flex items-center mt-6">
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="block rounded-md text-red-700 font-semibold bg-white px-3 py-1.5 hover:bg-red-600 hover:text-white transition duration-150"
                          disabled={values.addresses.length === 1}
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      push({
                        street: "",
                        number: "",
                        apartment: "",
                        city: "",
                        province: "",
                        country: "",
                        postalCode: "",
                        latitude: null,
                        longitude: null,
                        formattedAddress: undefined,
                        tempId: uuidv4(),
                      })
                    }
                    className="text-sm font-semibold text-red-700 hover:text-red-600"
                  >
                    + Agregar Dirección
                  </button>
                </div>
              )}
            </FieldArray>
          </div>

          {/* Formas de Pago (Desplegable) */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Formas de Pago</h3>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Agrega otra forma de pago para el cliente: </h2>
            <div className="relative">
              <select
                multiple
                className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 shadow-sm transition-all duration-200 focus:border-red-400 focus:ring-4 focus:ring-red-100 focus:outline-none hover:border-gray-400"
                size={Object.values(PaymentType).length > 4 ? 4 : Object.values(PaymentType).length}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const selectedOptions = Array.from(e.target.selectedOptions, option => option.value as PaymentType);
                  setFieldValue(
                    "paymentTypes",
                    [...new Set([...originalPaymentTypes, ...selectedOptions])]
                  );
                }}
                value={values.paymentTypes}
              >
                {Object.values(PaymentType).map((type) => (
                  <option
                    key={type}
                    value={type}
                    disabled={originalPaymentTypes.includes(type)}
                    className="py-2 disabled:text-gray-400 disabled:bg-gray-50"
                  >
                    {getPaymentTypeLabel(type)}{" "}
                    {originalPaymentTypes.includes(type) && "✓ (Original)"}
                  </option>
                ))}
              </select>
            </div>
            <ErrorMessage
              name="paymentTypes"
              component="div"
              className="text-red-600 text-sm mt-2 flex items-center gap-1"
            />
          </div>


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
};

export default EditCustomerForm;
