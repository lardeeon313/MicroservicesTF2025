import { Formik, Field, Form, ErrorMessage, FormikHelpers } from "formik";
import { RegisterCustomerRequest } from "../../types/CustomerTypes";
import { registerCustomerSchema } from "../../validations/customerSchemas";

interface Props {
  isSubmitting: boolean;
  onSubmit: (values: RegisterCustomerRequest, helpers: FormikHelpers<RegisterCustomerRequest>) => void;
}

const initialValues: RegisterCustomerRequest = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  address: "",
};

const RegisterCustomerForm = ({ isSubmitting, onSubmit }: Props) => {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <h2 className="text-center text-4xl font-bold text-red-600 mb-12">
          Registrar Cliente
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={registerCustomerSchema}
          onSubmit={onSubmit}
        >
          <Form className="space-y-6 mt-10 w-3x1">
            {/* Campos */}
            {["firstName", "lastName", "email", "phoneNumber", "address"].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block text-sm font-medium text-gray-900 mb-1">
                  {field === "firstName" && "Nombre"}
                  {field === "lastName" && "Apellido"}
                  {field === "email" && "Email"}
                  {field === "phoneNumber" && "Teléfono"}
                  {field === "address" && "Dirección"}
                </label>
                <Field
                  name={field}
                  type={field === "email" ? "email" : field === "phoneNumber" ? "tel" : "text"}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
                />
                <ErrorMessage name={field} component="div" className="text-red-700 text-sm pt-1" />
              </div>
            ))}

            {/* Botón */}
            <div className="mt-10">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full justify-center items-center rounded-md bg-red-700 px-3 py-1.5 text-3x1 font-semibold text-white shadow-sm hover:bg-red-600 transition duration-150 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8h4z"></path>
                  </svg>
                ) : (
                  "Registrar Cliente"
                )}
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default RegisterCustomerForm;
