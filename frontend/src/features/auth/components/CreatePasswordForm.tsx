import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createNewPassword } from "../services/AuthService";
import toast from "react-hot-toast";
import logoVerona from "../../../assets/logo-verona.png";
import { createPasswordValidationSchema } from "../validations/forgotPassword";

const CreatePasswordForm = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const userId = params.get("userId");

  const initialValues = { newPassword: "" };

  const handleSubmit = async (values: { newPassword: string }) => {
    if (!userId) {
      toast.error("Falta el ID del usuario.");
      return;
    }

    console.log("UserId:", userId);
    console.log("New Password:", values.newPassword);
    try {
      await createNewPassword({
        userIdentityId: userId,
        newPassword: values.newPassword,
      });

      toast.success("Contraseña creada correctamente!");
      navigate("/login");
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Error inesperado.");
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img src={logoVerona} className="mx-auto h-48 w-auto" />

        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Crear nueva contraseña
        </h2>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={createPasswordValidationSchema}
        onSubmit={handleSubmit}
      >
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Form className="space-y-6">

            {/* NEW PASSWORD */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-900">
                Nueva contraseña
              </label>
              <div className="mt-2">
                <Field
                  name="newPassword"
                  type="password"
                  placeholder="Nueva contraseña"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base outline-1 outline-gray-300 
                    placeholder:text-gray-400 focus:outline-2 focus:outline-red-200 sm:text-sm"
                />
                <ErrorMessage name="newPassword" component="div" className="text-red-700 text-sm" />
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900">
                Confirmar contraseña
              </label>
              <div className="mt-2">
                <Field
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirmar contraseña"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base outline-1 outline-gray-300 
                    placeholder:text-gray-400 focus:outline-2 focus:outline-red-200 sm:text-sm"
                />
                <ErrorMessage name="confirmPassword" component="div" className="text-red-700 text-sm" />
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-red-700 px-3 py-1.5 
              text-sm font-semibold text-white shadow hover:bg-red-600"
            >
              Confirmar
            </button>

          </Form>
        </div>
      </Formik>
    </div>
  );
};

export default CreatePasswordForm;
