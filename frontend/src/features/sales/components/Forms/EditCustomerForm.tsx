import { Formik, Form, Field, ErrorMessage } from "formik";
import { updateCustomerSchema } from "../../validations/customerSchemas";
import { UpdateCustomerRequest } from "../../types/CustomerTypes";
interface Props {
  initialValues: UpdateCustomerRequest;
  onSubmit: (values: UpdateCustomerRequest) => void;
  isSubmitting?: boolean;
}

const EditCustomerForm = ({ initialValues, onSubmit, isSubmitting }: Props) => {
  return (
      <Formik
        initialValues={initialValues}
        validationSchema={updateCustomerSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {() => (
          <Form className="space-y-6 mt-10 w-3xl">
            <Field type="hidden" name="id" />
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Nombre</label>
              <Field
                type="text"
                name="firstName"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
                placeholder="Nombre del cliente"
              />
              <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Apellido</label>
              <Field
                type="text"
                name="lastName"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
                placeholder="Apellido del cliente"
              />
              <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Email</label>
              <Field
                type="email"
                name="email"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
                placeholder="ejemplo@email.com"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Teléfono</label>
              <Field
                type="text"
                name="phoneNumber"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
                placeholder="Número de teléfono"
              />
              <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Dirección</label>
              <Field
                type="text"
                name="address"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
                placeholder="Dirección del cliente"
              />
              <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
            </div>

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
  );
};

export default EditCustomerForm;
