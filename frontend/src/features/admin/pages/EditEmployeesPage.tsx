import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getEmployeeById, updateEmployee } from "../services/EmployeeService";
import EditEmployeesForm from "../components/EditEmployeesForm";
import { UpdateEmployeeRequest } from "../types/Employee";
import { handleFormikError } from "../../../components/ErrorHandler";
import LoadingSpinner from "../../../components/LoadingSpinner";
import BackButton from "../../../components/BackButton";

const EditEmployeesPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<UpdateEmployeeRequest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const employee = await getEmployeeById(Number(id!));
        setInitialValues({
          id: employee.id!,
          userName: employee.userName || "",
          firstName: employee.firstName || "",
          lastName: employee.lastName || "",
          email: employee.email || "",
          phoneNumber: employee.phoneNumber || "",
          role: employee.role,
          status: employee.status,
          sector: employee.sector,
        });
      } catch (error) {
        handleFormikError({
          error,
          customMessages: {
            404: "El empleado no fue encontrado.",
          },
        });
        navigate("/admin/employees");
      }
    };
    if (id) fetchEmployee();
  }, [id, navigate]);

  const handleSubmit = async (values: UpdateEmployeeRequest) => {
    setIsSubmitting(true);
    try {
      await updateEmployee(values);
      toast.success("Empleado actualizado correctamente");
      navigate(`/admin/employees`);
    } catch (error) {
      handleFormikError({
        error,
        customMessages: {
          404: "El empleado no fue encontrado.",
          400: "Datos inválidos al actualizar el empleado.",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/admin/employees" />
        <h2 className="text-center text-4xl font-bold text-red-600 mb-12">
          Editar Empleado
        </h2>
        {initialValues ? (
          <EditEmployeesForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        ) : (
          <LoadingSpinner message="Cargando datos del empleado..." height="h-screen" />
        )}
      </div>
    </div>
  );
};

export default EditEmployeesPage;
