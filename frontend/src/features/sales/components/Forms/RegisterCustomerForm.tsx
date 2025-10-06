import { Formik, Field, Form, ErrorMessage, FormikHelpers, FieldArray } from "formik";
import { RegisterCustomerRequest } from "../../types/CustomerTypes";
import { registerCustomerSchema } from "../../validations/customerSchemas";

interface Props {
  isSubmitting: boolean;
  onSubmit: (
    values: RegisterCustomerRequest,
    helpers: FormikHelpers<RegisterCustomerRequest>
  ) => void;
}

const initialValues: RegisterCustomerRequest = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  addresses: [
    {
      street: "",
      number: "",
      apartment: "",
      city: "",
      province: "",
      country: "",
      postalCode: "",
    },
  ],
};

const RegisterCustomerForm = ({ isSubmitting, onSubmit }: Props) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={registerCustomerSchema}
      onSubmit={onSubmit}
    >
      {({ values }) => (
        <Form className="space-y-6 container mx-auto py-10 px-16 sm:max-w-6xl">
          {/* Datos básicos del cliente */}
          <h3 className="text-lg font-semibold mb-4">Datos de Contacto</h3>
          {["firstName", "lastName", "email", "phoneNumber"].map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-sm font-medium text-gray-900 mb-1"
              >
                {field === "firstName" && "Nombre *"}
                {field === "lastName" && "Apellido *"}
                {field === "email" && "Email *"}
                {field === "phoneNumber" && "Teléfono *"}
              </label>
              <Field
                name={field}
                type={
                  field === "email"
                    ? "email"
                    : field === "phoneNumber"
                    ? "tel"
                    : "text"
                }
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
              />
              <ErrorMessage
                name={field}
                component="div"
                className="text-red-700 text-sm pt-1"
              />
            </div>
          ))}

          {/* Direcciones */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Direcciones</h3>

            <FieldArray name="addresses">
              {({ push, remove }) => (
                <div className="space-y-6">
                  {values.addresses.map((_, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start border-b pb-4"
                    >
                      {/* Street */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          Calle *
                        </label>
                        <Field
                          name={`addresses[${index}].street`}
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300"
                        />
                        <ErrorMessage
                          name={`addresses[${index}].street`}
                          component="div"
                          className="text-red-700 text-sm pt-1"
                        />
                      </div>

                      {/* Number */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          Número *
                        </label>
                        <Field
                          name={`addresses[${index}].number`}
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300"
                        />
                        <ErrorMessage
                          name={`addresses[${index}].number`}
                          component="div"
                          className="text-red-700 text-sm pt-1"
                        />
                      </div>

                      {/* Apartment */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          Departamento
                        </label>
                        <Field
                          name={`addresses[${index}].apartment`}
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300"
                        />
                        <ErrorMessage
                          name={`addresses[${index}].apartment`}
                          component="div"
                          className="text-red-700 text-sm pt-1"
                        />
                      </div>

                      {/* City */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          Ciudad *
                        </label>
                        <Field
                          name={`addresses[${index}].city`}
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300"
                        />
                        <ErrorMessage
                          name={`addresses[${index}].city`}
                          component="div"
                          className="text-red-700 text-sm pt-1"
                        />
                      </div>

                      {/* Province */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          Provincia *
                        </label>
                        <Field
                          name={`addresses[${index}].province`}
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300"
                        />
                        <ErrorMessage
                          name={`addresses[${index}].province`}
                          component="div"
                          className="text-red-700 text-sm pt-1"
                        />
                      </div>

                      {/* Country */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          País *
                        </label>
                        <Field
                          name={`addresses[${index}].country`}
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300"
                        />
                        <ErrorMessage
                          name={`addresses[${index}].country`}
                          component="div"
                          className="text-red-700 text-sm pt-1"
                        />
                      </div>

                      {/* PostalCode */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          Código Postal
                        </label>
                        <Field
                          name={`addresses[${index}].postalCode`}
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300"
                        />
                        <ErrorMessage
                          name={`addresses[${index}].postalCode`}
                          component="div"
                          className="text-red-700 text-sm pt-1"
                        />
                      </div>

                      {/* Botón quitar */}
                      <div className="flex items-center mt-6">
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="block w-full rounded-md text-red-700 font-semibold bg-white px-3 py-1.5 hover:bg-red-600 hover:text-white transition duration-150"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Botón agregar dirección */}
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

          {/* Botón Submit */}
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
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8h4z"
                  ></path>
                </svg>
              ) : (
                "Registrar Cliente"
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterCustomerForm;
