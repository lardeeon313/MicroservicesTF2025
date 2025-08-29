import * as Yup from "yup";

export const loginValidationSchema = Yup.object({
    email: Yup.string()
    .email("Formato de correo inválido")
    .required("El correo es obligatorio"),
    password: Yup.string()
    .required("La contraseña es obligatoria")
    
});

