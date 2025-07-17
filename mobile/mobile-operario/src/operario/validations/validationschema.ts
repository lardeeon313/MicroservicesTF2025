import * as Yup from 'yup';

export const registerValidationSchema = Yup.object().shape({
  userName: Yup.string().required('Requerido'),
  name: Yup.string().required('Requerido'),
  lastName: Yup.string().required('Requerido'),
  email: Yup.string().email('Email inválido').required('Requerido'),
  password: Yup.string().required('Requerido'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Requerido'),
  role: Yup.string().required('Selecciona un rol'),
});
