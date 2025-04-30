import * as Yup from "yup";

export const registerValidationSchema = Yup.object({
    userName: Yup.string()
        .required("El nombre de usuario es obligatorio."),
    name: Yup.string()
        .required("El nombre es obligatorio"),
    lastName: Yup.string()
        .required("El apellido es obligatorio"),
    email: Yup.string()
        .email("Formato de correo inválido")
        .required("El correo electrónico es obligatorio"),
    password: Yup.string()
        .required("La contraseña es obligatoria")
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .matches(/[A-Z]/, "La contraseña debe tener al menos 1 mayúscula") // 🔹 Cambiado
        .matches(/[a-z]/, "La contraseña debe tener al menos 1 minúscula")  // 🔹 Cambiado
        .matches(/[0-9]/, "La contraseña debe tener al menos 1 número")      // ✅ Extra para mayor seguridad
        .matches(/[@!?.*$]/, "La contraseña debe tener al menos un carácter especial"), // ✅ Extra opcional
    confirmPassword: Yup.string()
        .required("Debes confirmar tu contraseña")
        .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
});