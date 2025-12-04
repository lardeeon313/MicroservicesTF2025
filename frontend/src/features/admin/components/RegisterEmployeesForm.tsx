import { Formik, Field, Form, ErrorMessage, FormikHelpers } from "formik";
import { RegisterEmployeeRequest, EmployeeRole, EmployeeSector, EmployeeStatus } from "../types/Employee";
import { registerEmployeeSchema } from "../validations/employeeSchemas";
import { getEmployeeRoleLabel, getEmployeeSectorLabel, getEmployeeStatusLabel } from "../constants/EmployeeLabels";

interface Props {
  isSubmitting: boolean;
  onSubmit: (
    values: RegisterEmployeeRequest,
    helpers: FormikHelpers<RegisterEmployeeRequest>
  ) => void;
}

const initialValues = {
  userName: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  role: "",
  status: "",
  sector: "",
} as any;

const RegisterEmployeesForm = ({ isSubmitting, onSubmit }: Props) => {
  return (
    <Formik<RegisterEmployeeRequest>
      initialValues={initialValues}
      validationSchema={registerEmployeeSchema}
      onSubmit={onSubmit}
    >
      {() => (
        <Form className="space-y-6 container mx-auto py-10 px-16 sm:max-w-6xl">
          {/* Datos básicos del empleado */}
          <h3 className="text-lg font-semibold mb-4">Datos Personales</h3>
          
          <div>
            <label
              htmlFor="userName"
              className="block text-sm font-medium text-gray-900 mb-1"
            >
              Nombre de Usuario *
            </label>
            <Field
              name="userName"
              type="text"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
            />
            <ErrorMessage
              name="userName"
              component="div"
              className="text-red-700 text-sm pt-1"
            />
          </div>

          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 mb-1">
              Nombre *
            </label>
            <Field
              name="firstName"
              type="text"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
            />
            <ErrorMessage name="firstName" component="div" className="text-red-700 text-sm pt-1" />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 mb-1">
              Apellido *
            </label>
            <Field
              name="lastName"
              type="text"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
            />
            <ErrorMessage name="lastName" component="div" className="text-red-700 text-sm pt-1" />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
              Email *
            </label>
            <Field
              name="email"
              type="email"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
            />
            <ErrorMessage name="email" component="div" className="text-red-700 text-sm pt-1" />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-900 mb-1">
              Teléfono *
            </label>
            <Field
              name="phoneNumber"
              type="tel"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
            />
            <ErrorMessage name="phoneNumber" component="div" className="text-red-700 text-sm pt-1" />
          </div>

          {/* Rol */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Información Laboral</h3>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Rol *
              </label>
              <Field
                as="select"
                name="role"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
              >
                <option value="">Seleccionar rol</option>
                {Object.values(EmployeeRole).map((role) => (
                  <option key={role} value={role}>
                    {getEmployeeRoleLabel(role)}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="role"
                component="div"
                className="text-red-700 text-sm pt-1"
              />
            </div>

            {/* Sector */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Sector *
              </label>
              <Field
                as="select"
                name="sector"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
              >
                <option value="">Seleccionar sector</option>
                {Object.values(EmployeeSector).map((sector) => (
                  <option key={sector} value={sector}>
                    {getEmployeeSectorLabel(sector)}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="sector"
                component="div"
                className="text-red-700 text-sm pt-1"
              />
            </div>

            {/* Estado */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Estado *
              </label>
              <Field
                as="select"
                name="status"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
              >
                <option value="">Seleccionar estado</option>
                {Object.values(EmployeeStatus).map((status) => (
                  <option key={status} value={status}>
                    {getEmployeeStatusLabel(status)}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="status"
                component="div"
                className="text-red-700 text-sm pt-1"
              />
            </div>
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
                "Registrar Empleado"
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterEmployeesForm;
