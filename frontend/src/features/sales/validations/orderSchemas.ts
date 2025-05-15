import * as Yup from "yup"

export const registerOrderValidationSchema = Yup.object().shape({
    customerId: Yup.string().required("Customer is required"),
        deliveryDate: Yup.date().min(new Date(), "La fecha de entrega debe ser futura"),
        deliveryDetail: Yup.string().max(220, "Max 220 characters").nullable(),
        items: Yup.array()
          .of(
              Yup.object().shape({
              productName: Yup.string().max(100).required("Required"),
              productBrand: Yup.string().max(100).required("Required"),
              quantity: Yup.number().min(1).required("Required"),
            })
          )
          .min(1, "At least one item is required"),
})

export const EditOrderValidationSchema = Yup.object({
        deliveryDetail: Yup.string().required("Requerido"),
        deliveryDate: Yup.string().required("Requerido"),
        status: Yup.string().required("Requerido"),
        items: Yup.array().of(
            Yup.object().shape({
            id: Yup.number().required(),
            productName: Yup.string().required("Requerido"),
            productBrand: Yup.string().required("Requerido"),
            quantity: Yup.number().min(1).required("Requerido"),
            })
        ),
})