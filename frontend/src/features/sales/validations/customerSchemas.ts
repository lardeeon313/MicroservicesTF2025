import * as Yup from 'yup';
import { PaymentType } from '../types/OrderTypes';
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
  paymentTypes: Yup.array()
    .of(Yup.string().oneOf(Object.values(PaymentType)))
    .min(1, "Debe seleccionar al menos un tipo de pago"),
});

export const updateCustomerSchema = Yup.object({
  id: Yup.string().required('El ID del cliente es obligatorio'),

  firstName: Yup.string()
    .max(50, 'Máximo 50 caracteres')
    .nullable(),

  lastName: Yup.string()
    .max(50, 'Máximo 50 caracteres')
    .nullable(),

  email: Yup.string()
    .matches(emailRegex, 'Formato de correo inválido')
    .email('Correo electrónico inválido')
    .nullable(),

  phoneNumber: Yup.string()
    .max(50, 'Máximo 50 caracteres')
    .nullable(),

  addresses: Yup.array().of(
    Yup.object({
      id: Yup.string().nullable(), // por si se actualiza una dirección existente
      street: Yup.string().max(100, 'Máximo 100 caracteres').nullable(),
      number: Yup.string().max(10, 'Máximo 10 caracteres').nullable(),
      apartment: Yup.string().max(20, 'Máximo 20 caracteres').nullable(),
      city: Yup.string().max(50, 'Máximo 50 caracteres').nullable(),
      province: Yup.string().max(50, 'Máximo 50 caracteres').nullable(),
      country: Yup.string().max(50, 'Máximo 50 caracteres').nullable(),
      postalCode: Yup.string().max(20, 'Máximo 20 caracteres').nullable(),
    })
  ).nullable(),

  paymentTypes: Yup.array()
    .of(Yup.string().oneOf(Object.values(PaymentType)))
    .nullable(),
});