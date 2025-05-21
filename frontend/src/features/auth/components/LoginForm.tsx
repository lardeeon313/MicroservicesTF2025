import { Formik, Form, Field, ErrorMessage } from "formik";
import { login } from "../services/AuthService";
import { loginValidationSchema } from "../validations/loginValidation";
import { LoginRequest } from "../types/AuthTypes";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import logoVerona from "../../../assets/logo-verona.png";
import { getRoleFromToken, getTokenPayload } from "../../../utils/jwtUtils";


const LoginForm = () => {
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();

  const handleSubmit = async (values: LoginRequest) => {
  try {
    const result = await login(values);
    localStorage.setItem("token", result.token);
    loginContext(result.token);

    const role = getRoleFromToken(result.token); // << ya devuelve string | null

    const payload = getTokenPayload(result.token); // en lugar de getRoleFromToken
    console.log("Payload decodificado:", payload);

    if (!role) {
      toast.error("Rol no encontrado en el token");
      return navigate("/");
    }

    toast.success("Inicio de sesión exitoso!");
    console.log("ROL:", role);

    switch (role) {
      case "Admin":
        navigate("/admin/dashboard");
        break;
      case "SalesStaff":
        navigate("/sales/home");
        break;
      case "DepotManager":
        navigate("/depot");
        break;
      case "DepotOperator":
        navigate("/operator");
        break;
      case "Delivery":
        navigate("/delivery");
        break;
      case "VerificationStaff":
        navigate("/verification");
        break;
      default:
        navigate("/");
        break;
    }

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
        <img 
          src={logoVerona} 
          alt="logo-verona" 
          className="mx-auto h-48 w-auto" 
        />  
        
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Iniciar sesion
        </h2>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginValidationSchema}
          onSubmit={handleSubmit}
        >
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <Form className="space-y-6">
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
                    placeholder="Correo electrónico"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-red-200 sm:text-sm/6"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-700 text-sm" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                    Contraseña
                  </label>
                  <div>
                    <a href="" className=" text-red-700 text-sm/6 font-semibold hover:text-red-600">
                      Olvide mi contraseña
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <Field 
                    name="password"
                    type="password"
                    placeholder="Contraseña"
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-red-200 sm:text-sm/6 "
                  />
                  <ErrorMessage name="password" component="div" className="text-red-700 text-sm" />
                </div>
              </div>
              <div>
                <button type="submit" className= "flex w-full justify-center rounded-md bg-red-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                  Iniciar Sesión
                </button>
              </div>
            </Form>
          </div>
        </Formik>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Eres nuevo?{' '}
          <Link to="/register" className="font-semibold text-red-700 hover:text-red-600">
            Registrate ahora!
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginForm;










































/*
import { useState } from "react";
import { login } from "../services/AuthService";
import type { LoginRequest } from "../services/AuthService";

const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const credentials: LoginRequest = { email, password };
      const result = await login(credentials);
      localStorage.setItem("token", result.token);
      alert("Login exitoso");
    } catch {
      setError("Credenciales inválidas");
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4 p-4 max-w-sm mx-auto">
      <h2 className="text-xl font-bold">Iniciar Sesión</h2>

      <input
        type="email"
        placeholder="Correo Electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded"
        required
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded"
        required
      />

      {error && <p className="text-red-600">{error}</p>}

      <button type="submit" className="bg-blue-600 text-white p-2 rounded">
        Iniciar Sesión
      </button>
    </form>
  );
};

export default LoginForm;
*/