import * as Yup from "yup"


export const registerOrderValidationSchema = Yup.object().shape({
  customerId: Yup.string().required("El cliente es requerido"),
  deliveryDate: Yup.date()
    .min(new Date(), "La fecha de entrega debe ser futura")
    .required("La fecha de entrega es requerida"),
  deliveryDetail: Yup.string()
    .max(220, "Máx. 220 caracteres")
    .nullable(),
  paymentType: Yup.string().required("El tipo de pago es requerido"),
  items: Yup.array()
    .of(
      Yup.object().shape({
        productName: Yup.string()
          .max(100, "Máx. 100 caracteres")
          .required("El nombre del producto es requerido"),
        productBrand: Yup.string()
          .max(100, "Máx. 100 caracteres")
          .required("La marca del producto es requerida"),
        quantity: Yup.number()
          .typeError("La cantidad debe ser un número")
          .min(1, "Debe ser al menos 1")
          .required("La cantidad es requerida"),
      })
    )
    .min(1, "Debe haber al menos un producto"),
  deliveryAddressId: Yup.number().nullable(),
  deliveryAddress: Yup.object().when("deliveryAddressId", {
    is: (val: number | undefined) => !val,
    then: (schema) =>
      schema.shape({
        street: Yup.string().required("La calle es requerida"),
        number: Yup.string().required("El número es requerido"),
        city: Yup.string().required("La ciudad es requerida"),
        province: Yup.string().required("La provincia es requerida"),
        country: Yup.string().required("El país es requerido"),
      }),
    otherwise: (schema) => schema.notRequired(),
  }),
});


export const EditOrderValidationSchema = Yup.object().shape({
  deliveryDetail: Yup.string().max(220, "Máx. 220 caracteres").nullable(),
  deliveryDate: Yup.date()
    .min(new Date(), "La fecha de entrega debe ser futura")
    .required("La fecha de entrega es requerida"),
  status: Yup.string().required("El estado es requerido"),
  paymentType: Yup.string().required("El tipo de pago es requerido"),
  items: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.number().notRequired(),
        productName: Yup.string().required("El nombre del producto es requerido"),
        productBrand: Yup.string().required("La marca del producto es requerida"),
        quantity: Yup.number()
          .typeError("La cantidad debe ser un número")
          .min(1, "Debe ser al menos 1")
          .required("La cantidad es requerida"),
      })
    )
    .min(1, "Debe haber al menos un producto"),

  deliveryAddressId: Yup.number().nullable(),

  // 👇 Siempre debe existir como objeto
  addressRequest: Yup.object({
    street: Yup.string(),
    number: Yup.string(),
    city: Yup.string(),
    province: Yup.string(),
    country: Yup.string(),
    postalCode: Yup.string().nullable(),
    apartment: Yup.string().nullable(),
  }).when("deliveryAddressId", {
    is: (val: number | null) => !val, // si no hay dirección guardada
    then: (schema) =>
      schema.shape({
        street: Yup.string().required("La calle es requerida"),
        number: Yup.string().required("El número es requerido"),
        city: Yup.string().required("La ciudad es requerida"),
        province: Yup.string().required("La provincia es requerida"),
        country: Yup.string().required("El país es requerido"),
      }),
  }),
});
