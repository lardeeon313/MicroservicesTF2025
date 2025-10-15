import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import { updateCustomerSchema } from "../../validations/customerSchemas";
import { UpdateCustomerRequest, AddressRequest } from "../../types/CustomerTypes";
import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

interface Props {
  initialValues: UpdateCustomerRequest;
  onSubmit: (values: UpdateCustomerRequest) => void;
  isSubmitting?: boolean;
}

// Tipo extendido solo para el formulario (frontend)
type FormAddress = AddressRequest & { tempId: string };

const EditCustomerForm = ({ initialValues, onSubmit, isSubmitting }: Props) => {
  const normalizedInitialValues = useMemo(() => {
    const addresses: FormAddress[] = initialValues.addresses?.length
      ? initialValues.addresses.map((addr) => ({
          ...addr,
          number: addr.number?.toString() || "",
          tempId: uuidv4(), // ID temporal solo para el frontend
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

    return { ...initialValues, addresses };
  }, [initialValues]);

  return (
    <Formik
      initialValues={normalizedInitialValues}
      validationSchema={updateCustomerSchema}
      enableReinitialize
      onSubmit={(values) => {
        // Remover los IDs temporales y convertir `number` a string si es necesario
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
      {({ values }) => (
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
                      key={address.tempId} // Usamos el ID temporal como key
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
