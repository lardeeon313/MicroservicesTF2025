import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/AuthService";
import toast from "react-hot-toast";
import logoVerona from "../../../assets/logo-verona.png";
import { resetPasswordValidationSchema } from "../validations/forgotPassword";

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const email = params.get("email");
  const token = params.get("token");

  const initialValues = { newPassword: "" };

  const handleSubmit = async (values: { newPassword: string }) => {
    if (!email || !token) {
      toast.error("Datos inválidos en el enlace.");
      return;
    }

    try {
      await resetPassword({
        email,
        token,
        newPassword: values.newPassword,
      });

      toast.success("Contraseña actualizada correctamente.");
      navigate("/login");

    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Ocurrió un error inesperado.");
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12">

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img src={logoVerona} className="mx-auto h-48 w-auto" />

        <h2 className="mt-10 text-center text-2xl font-bold text-gray-900">
          Restablecer contraseña
        </h2>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={resetPasswordValidationSchema}
        onSubmit={handleSubmit}
      >
        <div className="mt-10 sm:mx-auto sm:max-w-sm">
          <Form className="space-y-6">

            {/* NEW PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Nueva contraseña
              </label>
              <div className="mt-2">
                <Field
                  name="newPassword"
                  type="password"
                  placeholder="Nueva contraseña"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base 
                    outline-1 outline-gray-300 focus:outline-red-200 sm:text-sm"
                />
                <ErrorMessage name="newPassword" component="div" className="text-red-700 text-sm" />
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Confirmar contraseña
              </label>
              <div className="mt-2">
                <Field
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirmar contraseña"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base 
                    outline-1 outline-gray-300 focus:outline-red-200 sm:text-sm"
                />
                <ErrorMessage name="confirmPassword" component="div" className="text-red-700 text-sm" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-red-700 px-3 py-1.5 text-white font-semibold hover:bg-red-600"
            >
              Guardar
            </button>

          </Form>
        </div>
      </Formik>
    </div>
  );
};

export default ResetPasswordForm;
