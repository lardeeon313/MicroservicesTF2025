import * as Yup from 'yup';
import { EmployeeRole, EmployeeSector, EmployeeStatus } from '../types/Employee';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const registerEmployeeSchema = Yup.object({
  userName: Yup.string()
    .max(50, 'Máximo 50 caracteres')
    .required('El nombre de usuario es obligatorio'),

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

  role: Yup.string()
    .oneOf(Object.values(EmployeeRole), 'Rol inválido')
    .required('El rol es obligatorio'),

  status: Yup.string()
    .oneOf(Object.values(EmployeeStatus), 'Estado inválido')
    .required('El estado es obligatorio'),

  sector: Yup.string()
    .oneOf(Object.values(EmployeeSector), 'Sector inválido')
    .required('El sector es obligatorio'),
});

export const updateEmployeeSchema = Yup.object({
  id: Yup.number().required('El ID del empleado es obligatorio'),

  userName: Yup.string()
    .max(50, 'Máximo 50 caracteres')
    .required('El nombre de usuario es obligatorio'),

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

  role: Yup.string()
    .oneOf(Object.values(EmployeeRole), 'Rol inválido')
    .required('El rol es obligatorio'),

  status: Yup.string()
    .oneOf(Object.values(EmployeeStatus), 'Estado inválido')
    .required('El estado es obligatorio'),

  sector: Yup.string()
    .oneOf(Object.values(EmployeeSector), 'Sector inválido')
    .required('El sector es obligatorio'),
});

