import { useNavigate } from "react-router-dom";
import RegisterEmployeesForm from "../components/RegisterEmployeesForm";
import { RegisterEmployeeRequest } from "../types/Employee";
import { registerEmployee } from "../services/EmployeeService";
import toast from "react-hot-toast";
import { FormikHelpers } from "formik";
import { useState } from "react";
import { handleFormikError } from "../../../components/ErrorHandler";
import BackButton from "../../../components/BackButton";

export default function RegisterEmployeesPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (
    values: RegisterEmployeeRequest,
    { resetForm }: FormikHelpers<RegisterEmployeeRequest>
  ) => {
    setIsSubmitting(true);
    try {
      await registerEmployee(values);
      toast.success("Empleado registrado con éxito!");
      resetForm();
      navigate("/admin/employees");
    } catch (error) {
      handleFormikError({
        error,
        customMessages: {
          409: "El empleado ya existe!",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/admin/employees"></BackButton>
        <h2 className="text-center text-4xl font-bold text-red-600 mb-12">
          Registrar Empleado
        </h2>
        <RegisterEmployeesForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
