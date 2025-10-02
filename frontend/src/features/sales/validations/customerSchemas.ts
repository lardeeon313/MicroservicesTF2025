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

  // addresses en plural (array de objetos)
  addresses: Yup.array().of(
    Yup.object({
      street: Yup.string()
        .max(100, 'Máximo 100 caracteres')
        .required('La calle es obligatoria'),
      number: Yup.string()
        .max(10, 'Máximo 10 caracteres')
        .required('El número es obligatorio'),
      apartment: Yup.string().max(20, 'Máximo 20 caracteres').nullable(),
      city: Yup.string()
        .max(50, 'Máximo 50 caracteres')
        .required('La ciudad es obligatoria'),
      province: Yup.string()
        .max(50, 'Máximo 50 caracteres')
        .required('La provincia es obligatoria'),
      country: Yup.string()
        .max(50, 'Máximo 50 caracteres')
        .required('El país es obligatorio'),
      postalCode: Yup.string().max(20, 'Máximo 20 caracteres'),
    })
  ).min(1, 'Debe ingresar al menos una dirección'),
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