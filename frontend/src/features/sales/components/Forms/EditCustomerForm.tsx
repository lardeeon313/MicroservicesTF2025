import { Formik, Form, Field, ErrorMessage } from "formik";
import { updateCustomerSchema } from "../../validations/customerSchemas";
import { UpdateCustomerRequest } from "../../types/CustomerTypes";
import { Button } from "@headlessui/react";
interface Props {
  initialValues: UpdateCustomerRequest;
  onSubmit: (values: UpdateCustomerRequest) => void;
  isSubmitting?: boolean;
}

const EditCustomerForm = ({ initialValues, onSubmit, isSubmitting }: Props) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Editar Cliente</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={updateCustomerSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {() => (
          <Form className="space-y-6">
            <Field type="hidden" name="id" />

            <div>
              <label className="block font-medium text-gray-700">Nombre</label>
              <Field
                type="text"
                name="firstName"
                className="w-full p-2 border rounded"
                placeholder="Nombre del cliente"
              />
              <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block font-medium text-gray-700">Apellido</label>
              <Field
                type="text"
                name="lastName"
                className="w-full p-2 border rounded"
                placeholder="Apellido del cliente"
              />
              <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block font-medium text-gray-700">Email</label>
              <Field
                type="email"
                name="email"
                className="w-full p-2 border rounded"
                placeholder="ejemplo@email.com"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block font-medium text-gray-700">Teléfono</label>
              <Field
                type="text"
                name="phoneNumber"
                className="w-full p-2 border rounded"
                placeholder="Número de teléfono"
              />
              <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block font-medium text-gray-700">Dirección</label>
              <Field
                type="text"
                name="address"
                className="w-full p-2 border rounded"
                placeholder="Dirección del cliente"
              />
              <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditCustomerForm;
