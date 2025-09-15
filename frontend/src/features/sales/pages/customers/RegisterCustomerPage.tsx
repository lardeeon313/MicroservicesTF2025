import { useNavigate } from "react-router-dom";
import RegisterCustomerForm from "../../components/Forms/RegisterCustomerForm";
import { RegisterCustomerRequest } from "../../types/CustomerTypes";
import { registerCustomer } from "../../services/CustomerService";
import toast from "react-hot-toast";
import { FormikHelpers } from "formik";
import { useState } from "react";
import { handleFormikError } from "../../../../components/ErrorHandler";
import BackButton from "../../../../components/BackButton";

export default function RegisterCustomerPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (
    values: RegisterCustomerRequest,
    { resetForm }: FormikHelpers<RegisterCustomerRequest>
  ) => {
    setIsSubmitting(true);
    try {
      await registerCustomer(values);
      toast.success("Cliente registrado con éxito!");
      resetForm();
      navigate("/sales/customers");
    } catch (error) {
      handleFormikError({
        error,
        customMessages: {
          409: "El cliente ya existe!",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/sales/home"></BackButton>
        <h2 className="text-center text-4xl font-bold text-red-600 mb-12">
          Registrar Cliente
        </h2>
        <RegisterCustomerForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
