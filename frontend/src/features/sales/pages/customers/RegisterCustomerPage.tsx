import { useNavigate } from "react-router-dom";
import RegisterCustomerForm from "../../components/Forms/RegisterCustomerForm";
import { RegisterCustomerRequest } from "../../types/CustomerTypes";
import { registerCustomer } from "../../services/CustomerService";
import toast from "react-hot-toast";
import { FormikHelpers } from "formik";
import { useState } from "react";
import { handleFormikError } from "../../../../components/ErrorHandler";
import BackButton from "../../../../components/BackButton";
import { User } from "lucide-react";

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
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
        <BackButton to="/sales/home"></BackButton>

        {/* Header Section */}
        <div className="text-center mb-10 mt-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mb-4">
            <User className="w-7 h-7 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Registrar Nuevo Cliente
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <RegisterCustomerForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
