import * as Yup from "yup"

export const registerOrderValidationSchema = Yup.object().shape({
  customerId: Yup.string().required("Customer is required"),
  deliveryDate: Yup.date()
    .min(new Date(), "La fecha de entrega debe ser futura")
    .required("Delivery date is required"),
  deliveryDetail: Yup.string()
    .max(220, "Max 220 characters")
    .nullable(),
  items: Yup.array()
    .of(
      Yup.object().shape({
        productName: Yup.string().max(100).required("Required"),
        productBrand: Yup.string().max(100).required("Required"),
        quantity: Yup.number().min(1).required("Required"),
      })
    )
    .min(1, "At least one item is required"),
  deliveryAddressId: Yup.number().nullable(),
  deliveryAddress: Yup.object().when("deliveryAddressId", {
    is: (val: number | undefined) => !val,
    then: (schema) =>
      schema.shape({
        street: Yup.string().required("Street is required"),
        number: Yup.string().required("Number is required"),
        city: Yup.string().required("City is required"),
        province: Yup.string().required("Province is required"),
        country: Yup.string().required("Country is required"),
      }),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export const EditOrderValidationSchema = Yup.object({
        deliveryDetail: Yup.string(),
        deliveryDate: Yup.string(),
        status: Yup.string(),
        items: Yup.array().of(
            Yup.object().shape({
            id: Yup.number().notRequired(),
            productName: Yup.string().required("Requerido"),
            productBrand: Yup.string().required("Requerido"),
            quantity: Yup.number().min(1).required("Requerido"),
            })
        ),
})