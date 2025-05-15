import * as Yup from 'yup';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const registerCustomerSchema = Yup.object({
  firstName: Yup.string()
    .max(50, 'Máximo 50 caracteres')
    .required('El nombre es obligatorio'),

  lastName: Yup.string()
    .max(50, 'Máximo 50 caracteres')
    .required('El apellido es obligatorio'),

  email: Yup.string()
    .matches(emailRegex, 'Formato de correo inválido')
    .email('Correo electrónico inválido')
    .required('El correo es obligatorio'),

  phoneNumber: Yup.string()
    .max(50, 'Máximo 50 caracteres')
    .required('El número de teléfono es obligatorio'),

  address: Yup.string()
    .max(50, 'Máximo 50 caracteres')
    .required('La dirección es obligatoria'),
});

export const updateCustomerSchema = Yup.object({
  id: Yup.string().required(),

  firstName: Yup.string()
    .max(50, 'Máximo 50 caracteres')
    .optional(),

  lastName: Yup.string()
    .max(50, 'Máximo 50 caracteres')
    .optional(),

  email: Yup.string()
    .matches(emailRegex, 'Formato de correo inválido')
    .email('Correo electrónico inválido')
    .optional(),

  phoneNumber: Yup.string()
    .max(50, 'Máximo 50 caracteres')
    .optional(),

  address: Yup.string()
    .max(50, 'Máximo 50 caracteres')
    .optional(),
});