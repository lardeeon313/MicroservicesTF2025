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
        .matches(/[A-Z]/, "La contraseña debe tener al menos 1 mayúscula") 
        .matches(/[a-z]/, "La contraseña debe tener al menos 1 minúscula")  
        .matches(/[0-9]/, "La contraseña debe tener al menos 1 número")      
        .matches(/[@!?.*$]/, "La contraseña debe tener al menos un carácter especial"), 
    confirmPassword: Yup.string()
        .required("Debes confirmar tu contraseña")
        .oneOf([Yup.ref("password")], "Las contraseñas no coinciden"),
    role: Yup.string()
        .required("Seleccionar un rol es obligatorio.")
        .oneOf(["Admin", "SalesStaff", "BillingManager","DepotManager","DepotOperator", "Delivery", "VerificationStaff"], "Rol inválido")
});