import { Formik, Form, Field, ErrorMessage } from "formik";
import { forgotPassword } from "../services/AuthService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import logoVerona from "../../../assets/logo-verona.png";
import { forgotPasswordValidationSchema } from "../validations/forgotPassword";

const ForgotPasswordForm = () => {
  const navigate = useNavigate();

  const initialValues = { email: "" };

  const handleSubmit = async (values: { email: string }) => {
    try {
      const response = await forgotPassword(values);

      if (response.requiresPasswordCreation) {
        toast("Este usuario debe crear su contraseña.");
        navigate(`/create-password?userId=${response.userId}`);
        return;
      }

      toast.success("Correo enviado. Revisa tu bandeja.");

    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Ocurrió un error inesperado.");
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img src={logoVerona} className="mx-auto h-48 w-auto" />

        <h2 className="mt-10 text-center text-2xl font-bold text-gray-900">
          Recuperar contraseña
        </h2>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={forgotPasswordValidationSchema}
        onSubmit={handleSubmit}
      >
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Form className="space-y-6">
            
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Correo electrónico
              </label>
              <div className="mt-2">
                <Field
                  name="email"
                  type="email"
                  placeholder="tu@mail.com"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base 
                     outline-1 outline-gray-300 focus:outline-2 
                    focus:outline-red-200 sm:text-sm"
                />
                <ErrorMessage name="email" component="div" className="text-red-700 text-sm" />
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-red-700 px-3 py-1.5 
              font-semibold text-white shadow hover:bg-red-600"
            >
              Enviar
            </button>

          </Form>
        </div>
      </Formik>

    </div>
  );
};

export default ForgotPasswordForm;
