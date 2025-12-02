import { Formik, Form, Field, ErrorMessage } from "formik";
import { updateEmployeeSchema } from "../validations/employeeSchemas";
import { UpdateEmployeeRequest, EmployeeRole, EmployeeSector, EmployeeStatus } from "../types/Employee";
import { getEmployeeRoleLabel, getEmployeeSectorLabel, getEmployeeStatusLabel } from "../constants/EmployeeLabels";

interface Props {
  initialValues: UpdateEmployeeRequest;
  onSubmit: (values: UpdateEmployeeRequest) => void;
  isSubmitting?: boolean;
}

const EditEmployeesForm = ({ initialValues, onSubmit, isSubmitting }: Props) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={updateEmployeeSchema}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {() => (
        <Form className="space-y-6 container mx-auto py-10 px-16 sm:max-w-6xl">
          <Field type="hidden" name="id" />

          {/* Datos básicos */}
          <h3 className="text-lg font-semibold mb-4">Datos Personales</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Nombre de Usuario *
            </label>
            <Field
              type="text"
              name="userName"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
            />
            <ErrorMessage name="userName" component="div" className="text-red-500 text-sm" />
          </div>

          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 mb-1">
              Nombre *
            </label>
            <Field
              type="text"
              name="firstName"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
            />
            <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 mb-1">
              Apellido *
            </label>
            <Field
              type="text"
              name="lastName"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
            />
            <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
              Email *
            </label>
            <Field
              type="email"
              name="email"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
            />
            <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-900 mb-1">
              Teléfono *
            </label>
            <Field
              type="tel"
              name="phoneNumber"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
            />
            <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm" />
          </div>

          {/* Información Laboral */}
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
                {Object.values(EmployeeRole).map((role) => (
                  <option key={role} value={role}>
                    {getEmployeeRoleLabel(role)}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="role" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Sector *
              </label>
              <Field
                as="select"
                name="sector"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
              >
                {Object.values(EmployeeSector).map((sector) => (
                  <option key={sector} value={sector}>
                    {getEmployeeSectorLabel(sector)}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="sector" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Estado *
              </label>
              <Field
                as="select"
                name="status"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-red-200"
              >
                {Object.values(EmployeeStatus).map((status) => (
                  <option key={status} value={status}>
                    {getEmployeeStatusLabel(status)}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="status" component="div" className="text-red-500 text-sm" />
            </div>
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

export default EditEmployeesForm;
