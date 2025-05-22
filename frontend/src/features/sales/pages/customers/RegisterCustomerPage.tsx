import { Link, useNavigate } from "react-router-dom";
import RegisterCustomerForm from "../../components/Forms/RegisterCustomerForm";
import { RegisterCustomerRequest } from "../../types/CustomerTypes";
import { registerCustomer } from "../../services/CustomerService";
import toast from "react-hot-toast";
import { FormikHelpers } from "formik";
import { useState } from "react";
import { handleFormikError } from "../../../../components/ErrorHandler";

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
    <div className="container m-0 pt-10 min-w-full ">
      <div className="flex items-center justify-between mb-6">
        <Link to="/sales/customers" className="text-red-600 hover:underline pl-10">
          ← Volver atrás
        </Link>
      </div>
      <RegisterCustomerForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
    </div>
  );
}
