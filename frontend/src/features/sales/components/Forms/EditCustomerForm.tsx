import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import { User, Mail, Phone, MapPin, CreditCard, Plus, Trash2, FileText, AlertCircle } from "lucide-react";
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
      {({ values, setFieldValue, errors, touched }) => (
        <Form className="p-8 space-y-8">
          <Field type="hidden" name="id" />

          {/* Contact Information Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white font-bold" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Datos de Contacto</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Field
                    type="text"
                    name="firstName"
                    placeholder="Ingrese el nombre"
                    className={`block w-full rounded-lg border ${
                      errors.firstName && touched.firstName
                        ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                        : "border-gray-300 bg-white"
                    } pl-10 pr-4 py-2.5 text-gray-900 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors focus:outline-none`}
                  />
                </div>
                <ErrorMessage name="firstName" component="div" className="text-red-600 text-sm mt-2 flex items-center gap-1.5 font-medium bg-red-50 px-3 py-2 rounded-md">
                  {(msg) => (
                    <>
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{msg}</span>
                    </>
                  )}
                </ErrorMessage>
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Apellido <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Field
                    type="text"
                    name="lastName"
                    placeholder="Ingrese el apellido"
                    className={`block w-full rounded-lg border ${
                      errors.lastName && touched.lastName
                        ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                        : "border-gray-300 bg-white"
                    } pl-10 pr-4 py-2.5 text-gray-900 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors focus:outline-none`}
                  />
                </div>
                <ErrorMessage name="lastName" component="div" className="text-red-600 text-sm mt-2 flex items-center gap-1.5 font-medium bg-red-50 px-3 py-2 rounded-md">
                  {(msg) => (
                    <>
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{msg}</span>
                    </>
                  )}
                </ErrorMessage>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Field
                    type="email"
                    name="email"
                    placeholder="correo@ejemplo.com"
                    className={`block w-full rounded-lg border ${
                      errors.email && touched.email
                        ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                        : "border-gray-300 bg-white"
                    } pl-10 pr-4 py-2.5 text-gray-900 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors focus:outline-none`}
                  />
                </div>
                <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-2 flex items-center gap-1.5 font-medium bg-red-50 px-3 py-2 rounded-md">
                  {(msg) => (
                    <>
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{msg}</span>
                    </>
                  )}
                </ErrorMessage>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <Field
                    type="text"
                    name="phoneNumber"
                    placeholder="Ingrese el teléfono"
                    className={`block w-full rounded-lg border ${
                      errors.phoneNumber && touched.phoneNumber
                        ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                        : "border-gray-300 bg-white"
                    } pl-10 pr-4 py-2.5 text-gray-900 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors focus:outline-none`}
                  />
                </div>
                <ErrorMessage name="phoneNumber" component="div" className="text-red-600 text-sm mt-2 flex items-center gap-1.5 font-medium bg-red-50 px-3 py-2 rounded-md">
                  {(msg) => (
                    <>
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{msg}</span>
                    </>
                  )}
                </ErrorMessage>
              </div>
            </div>
          </div>

          {/* Addresses Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white font-bold" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Direcciones</h3>
            </div>

            <FieldArray name="addresses">
              {({ push, remove }) => (
                <div className="space-y-4">
                  {values.addresses.map((address: FormAddress, index: number) => {
                    const addressErrors = errors.addresses?.[index] as any;
                    const addressTouched = touched.addresses?.[index] as any;

                    return (
                      <div
                        key={address.tempId}
                        className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-semibold text-gray-700">
                            Dirección {index + 1}
                          </h4>
                          {values.addresses.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 transition-colors focus:outline-none"
                            >
                              <Trash2 className="w-3 h-3" />
                              Quitar
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Street */}
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                              Calle <span className="text-red-600">*</span>
                            </label>
                            <Field
                              name={`addresses[${index}].street`}
                              placeholder="Nombre de la calle"
                              className={`block w-full rounded-lg border ${
                                addressErrors?.street && addressTouched?.street
                                  ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                                  : "border-gray-300 bg-white"
                              } px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors focus:outline-none`}
                            />
                            <ErrorMessage
                              name={`addresses[${index}].street`}
                              component="div"
                              className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium"
                            >
                              {(msg) => (
                                <>
                                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                  <span>{msg}</span>
                                </>
                              )}
                            </ErrorMessage>
                          </div>

                          {/* Number */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                              Número <span className="text-red-600">*</span>
                            </label>
                            <Field
                              name={`addresses[${index}].number`}
                              placeholder="Nº"
                              className={`block w-full rounded-lg border ${
                                addressErrors?.number && addressTouched?.number
                                  ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                                  : "border-gray-300 bg-white"
                              } px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors focus:outline-none`}
                            />
                            <ErrorMessage
                              name={`addresses[${index}].number`}
                              component="div"
                              className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium"
                            >
                              {(msg) => (
                                <>
                                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                  <span>{msg}</span>
                                </>
                              )}
                            </ErrorMessage>
                          </div>

                          {/* Apartment */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                              Departamento
                            </label>
                            <Field
                              name={`addresses[${index}].apartment`}
                              placeholder="Piso/Dpto (opcional)"
                              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors focus:outline-none"
                            />
                          </div>

                          {/* City */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                              Ciudad <span className="text-red-600">*</span>
                            </label>
                            <Field
                              name={`addresses[${index}].city`}
                              placeholder="Ciudad"
                              className={`block w-full rounded-lg border ${
                                addressErrors?.city && addressTouched?.city
                                  ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                                  : "border-gray-300 bg-white"
                              } px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors focus:outline-none`}
                            />
                            <ErrorMessage
                              name={`addresses[${index}].city`}
                              component="div"
                              className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium"
                            >
                              {(msg) => (
                                <>
                                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                  <span>{msg}</span>
                                </>
                              )}
                            </ErrorMessage>
                          </div>

                          {/* Province */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                              Provincia <span className="text-red-600">*</span>
                            </label>
                            <Field
                              name={`addresses[${index}].province`}
                              placeholder="Provincia"
                              className={`block w-full rounded-lg border ${
                                addressErrors?.province && addressTouched?.province
                                  ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                                  : "border-gray-300 bg-white"
                              } px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors focus:outline-none`}
                            />
                            <ErrorMessage
                              name={`addresses[${index}].province`}
                              component="div"
                              className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium"
                            >
                              {(msg) => (
                                <>
                                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                  <span>{msg}</span>
                                </>
                              )}
                            </ErrorMessage>
                          </div>

                          {/* Country */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                              País <span className="text-red-600">*</span>
                            </label>
                            <Field
                              name={`addresses[${index}].country`}
                              placeholder="País"
                              className={`block w-full rounded-lg border ${
                                addressErrors?.country && addressTouched?.country
                                  ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                                  : "border-gray-300 bg-white"
                              } px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors focus:outline-none`}
                            />
                            <ErrorMessage
                              name={`addresses[${index}].country`}
                              component="div"
                              className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium"
                            >
                              {(msg) => (
                                <>
                                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                  <span>{msg}</span>
                                </>
                              )}
                            </ErrorMessage>
                          </div>

                          {/* Postal Code */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                              Código Postal <span className="text-red-600">*</span>
                            </label>
                            <Field
                              name={`addresses[${index}].postalCode`}
                              placeholder="CP"
                              className={`block w-full rounded-lg border ${
                                addressErrors?.postalCode && addressTouched?.postalCode
                                  ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                                  : "border-gray-300 bg-white"
                              } px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors focus:outline-none`}
                            />
                            <ErrorMessage
                              name={`addresses[${index}].postalCode`}
                              component="div"
                              className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium"
                            >
                              {(msg) => (
                                <>
                                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                  <span>{msg}</span>
                                </>
                              )}
                            </ErrorMessage>
                          </div>
                        </div>
                      </div>
                    );
                  })}

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
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors focus:outline-none"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Dirección
                  </button>
                </div>
              )}
            </FieldArray>
          </div>

          {/* Payment Types Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-white font-bold" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Formas de Pago</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Selecciona las formas de pago disponibles para el cliente
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.values(PaymentType).map((type) => {
                  const isOriginal = originalPaymentTypes.includes(type);
                  const isChecked = values.paymentTypes.includes(type);

                  return (
                    <label
                      key={type}
                      className={`relative flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isChecked
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                      } ${isOriginal ? "ring-2 ring-red-200" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFieldValue("paymentTypes", [...values.paymentTypes, type]);
                          } else {
                            // No permitir desmarcar los originales
                            if (!isOriginal) {
                              setFieldValue(
                                "paymentTypes",
                                values.paymentTypes.filter((t) => t !== type)
                              );
                            }
                          }
                        }}
                        disabled={isOriginal}
                        className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-gray-500" />
                          <span className={`text-sm font-medium ${isChecked ? "text-gray-800" : "text-gray-600"}`}>
                            {getPaymentTypeLabel(type)}
                          </span>
                        </div>
                        {isOriginal && (
                          <span className="text-xs text-red-600 font-medium mt-1 block">
                            Original
                          </span>
                        )}
                      </div>
                      {isChecked && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </label>
                  );
                })}
              </div>

              <p className="text-xs text-gray-500 mt-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  Los tipos de pago originales no pueden ser desmarcados. Puedes agregar nuevas opciones seleccionándolas.
                </span>
              </p>

              <ErrorMessage
                name="paymentTypes"
                component="div"
                className="text-red-600 text-sm mt-3 flex items-center gap-1.5 font-medium bg-red-50 px-3 py-2 rounded-md"
              >
                {(msg) => (
                  <>
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{msg}</span>
                  </>
                )}
              </ErrorMessage>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-red-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-red-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando cambios...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EditCustomerForm;