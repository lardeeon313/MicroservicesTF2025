import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import { updateCustomerSchema } from "../../validations/customerSchemas";
import { UpdateCustomerRequest, AddressRequest } from "../../types/CustomerTypes";
import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid"; // Instala uuid con `npm install uuid`

interface Props {
  initialValues: UpdateCustomerRequest;
  onSubmit: (values: UpdateCustomerRequest) => void;
  isSubmitting?: boolean;
}

const EditCustomerForm = ({ initialValues, onSubmit, isSubmitting }: Props) => {
  const normalizedInitialValues = useMemo(() => {
    return {
      ...initialValues,
      addresses: initialValues.addresses?.length
        ? initialValues.addresses.map((addr) => ({
            id: uuidv4(), // ID temporal solo para el frontend
            street: addr.street || "",
            number: addr.number?.toString() || "", // Convertir a string para el formulario
            apartment: addr.apartment || "",
            city: addr.city || "",
            province: addr.province || "",
            country: addr.country || "",
            postalCode: addr.postalCode || "",
            latitude: addr.latitude,
            longitude: addr.longitude,
            formattedAddress: addr.formattedAddress,
          }))
        : [
            {
              id: uuidv4(),
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
  }, [initialValues.id]);

  return (
    <Formik
      initialValues={normalizedInitialValues}
      validationSchema={updateCustomerSchema}
      onSubmit={(values) => {
        // Remover los IDs temporales y convertir `number` a string si es necesario
        const valuesToSubmit = {
          ...values,
          addresses: values.addresses.map(({ id, ...rest }) => ({
            ...rest,
            number: rest.number.toString(), // Asegurar que `number` sea string
          })),
        };
        onSubmit(valuesToSubmit);
      }}
      enableReinitialize={true}
    >
      {({ values }) => (
        <Form className="space-y-6 container mx-auto py-10 px-16 sm:max-w-6xl">
          <Field type="hidden" name="id" />
          {/* Datos básicos */}
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
              <ErrorMessage
                name={field}
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
          ))}
          {/* Direcciones */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Direcciones</h3>
            <FieldArray name="addresses">
              {({ push, remove }) => (
                <div className="space-y-4">
                  {values.addresses.map((address: AddressRequest & { id: string }, index: number) => (
                    <div
                      key={address.id} // Usamos el ID único como key
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
                          className="text-red-600 hover:underline text-sm"
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
                        id: uuidv4(),
                        street: "",
                        number: "",
                        apartment: "",
                        city: "",
                        province: "",
                        country: "",
                        postalCode: "",
                      })
                    }
                    className="text-red-600 hover:underline text-sm mt-2"
                  >
                    + Agregar Dirección
                  </button>
                </div>
              )}
            </FieldArray>
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
