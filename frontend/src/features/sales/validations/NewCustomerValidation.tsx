import * as Yup from "yup"

export const clienteValidationSchema = Yup.object({
  nombre: Yup.string()
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre debe contener solo letras y espacios")
    .required("El nombre es obligatorio"),

  telefono: Yup.string()
    .matches(/^\+54\s?(\d{2,4})\s?\d{6,8}$/, "Debe ser un número de teléfono argentino válido (ej: +54 351 1234567)")
    .required("El teléfono es obligatorio"),

  correo: Yup.string()
    .email("Debe ser un correo electrónico válido")
    .matches(
      /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook|yahoo)\.(com|com\.ar)$/,
      "El correo debe ser de gmail, hotmail, outlook o yahoo"
    )
    .required("El correo es obligatorio"),

  direccion: Yup.string()
    .matches(
      /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,°#-]{5,}$/,
      "La dirección debe contener letras, números y puede incluir .,°#-"
    )
    .required("La dirección es obligatoria"),
})
