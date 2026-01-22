import * as Yup from "yup";

export const orderSatisfactionValidationSchema = Yup.object({
  score: Yup.number()
    .min(1)
    .max(5)
    .required("El puntaje es obligatorio"),

  comment: Yup.string()
    .max(500, "Máximo 500 caracteres")
});
