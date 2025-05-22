import {register} from "../services/AuthService"
import { Formik, Form, Field, ErrorMessage } from "formik";
import { registerValidationSchema } from "../validations/registerValidation";
import { RegisterRequest } from "../types/AuthTypes";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import logoVerona from "../../../assets/logo-verona.png";


const RegisterForm = () => {

  const handleSubmit = async (values: RegisterRequest) => {
    try {
      await register(values);
      toast.success("Registro exitoso! ahora puedes iniciar sesión.")
        // Redireccionar al Login
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Ocurrió un error inesperado");
      }
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img src={logoVerona} 
          alt="logo-verona" 
          className="mx-auto h-48 w-auto"/>
        <h2 
          className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Registrarse
        </h2>

        <Formik 
          initialValues={{userName: "", name: "", lastName: "", email: "", password: "", confirmPassword: ""}}
          validationSchema={registerValidationSchema}
          onSubmit={handleSubmit}
        >
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <Form className="space-y-5">
              <div>
                <label htmlFor="userName" className="block text-sm/6 font-medium text-gray-900">
                  Usuario
                </label>
                <div className="mt-2">
                  <Field
                    name="userName"
                    type="string"
                    required
                    placeholder="Tu usuario"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-red-200 sm:text-sm/6"
                  />
                  <ErrorMessage name="userName" component="div" className="text-red-700 text-sm"/>
                </div>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                  Nombre
                </label>
                <div className="mt-2">
                  <Field
                    name="name"
                    type="string"
                    required
                    placeholder="Tu nombre"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-red-200 sm:text-sm/6"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-700 text-sm"/>
                </div>
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm/6 font-medium text-gray-900">
                  Apellido
                </label>
                <div className="mt-2">
                  <Field
                    name="lastName"
                    type="string"
                    required
                    placeholder="Tu apellido"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-red-200 sm:text-sm/6"
                  />
                  <ErrorMessage name="lastName" component="div" className="text-red-700 text-sm"/>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                  Correo Electronico
                </label>
                <div className="mt-2">
                  <Field
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="tu-correo@gmail.com"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-red-200 sm:text-sm/6"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-700 text-sm"/>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                  Contraseña
                </label>
                <div className="mt-2">
                  <Field
                    name="password"
                    type="password"
                    required
                    placeholder="Contraseña"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-red-200 sm:text-sm/6"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-700 text-sm"/>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-gray-900">
                  Confirmar contraseña
                </label>
                <div className="mt-2">
                  <Field
                    name="confirmPassword"
                    type="password"
                    required
                    placeholder="Confirmar contraseña"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-red-200 sm:text-sm/6"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-700 text-sm"/>
                </div>
              </div>

              <div>
                <button type="submit" className= "flex w-full justify-center rounded-md bg-red-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                  Registrarse
                </button>
              </div>
            </Form>
          </div>
        </Formik>
        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Ya tenes cuenta? {' '}
          <Link to="/login" className="font-semibold text-red-700 hover:text-red-600">
            Iniciar Sesión
          </Link>
        </p>

      </div>
    </div>
  );
};

export default RegisterForm;
