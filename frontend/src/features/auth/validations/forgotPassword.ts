import * as Yup from "yup";

export const createPasswordValidationSchema = Yup.object({
    newPassword: Yup.string()
        .required("La contraseña es obligatoria")
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .matches(/[A-Z]/, "La contraseña debe tener al menos 1 mayúscula")
        .matches(/[a-z]/, "La contraseña debe tener al menos 1 minúscula")
        .matches(/[0-9]/, "La contraseña debe tener al menos 1 número")
        .matches(/[@!?.*$]/, "La contraseña debe tener al menos un carácter especial"),
    confirmPassword: Yup.string()
        .required("Debes confirmar tu contraseña")
        .oneOf([Yup.ref("newPassword")], "Las contraseñas no coinciden"),
});

export const forgotPasswordValidationSchema = Yup.object({
    email: Yup.string()
        .email("Formato de correo inválido")
        .required("El correo es obligatorio"),
});

export const resetPasswordValidationSchema = Yup.object({
    newPassword: Yup.string()
        .required("La contraseña es obligatoria")
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .matches(/[A-Z]/, "La contraseña debe tener al menos 1 mayúscula")
        .matches(/[a-z]/, "La contraseña debe tener al menos 1 minúscula")
        .matches(/[0-9]/, "La contraseña debe tener al menos 1 número")
        .matches(/[@!?.*$]/, "La contraseña debe tener al menos un carácter especial"),
    confirmPassword: Yup.string()
        .required("Debes confirmar tu contraseña")
        .oneOf([Yup.ref("newPassword")], "Las contraseñas no coinciden"),
});
