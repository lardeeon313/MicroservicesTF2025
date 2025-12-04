import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EmployeeDto } from "../types/Employee";
import { getEmployeeById } from "../services/EmployeeService";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";
import BackButton from "../../../components/BackButton";
import EmptyState from "../../../components/EmptyState";
import { AlertCircle } from "lucide-react";
import EmployeesDetail from "../components/EmployeesDetail";

const EmployeesDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<EmployeeDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await getEmployeeById(Number(id!));
        setEmployee(data);
      } catch {
        toast.error("No se pudo cargar el empleado.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEmployee();
  }, [id]);

  if (loading)
    return <LoadingSpinner message="Cargando empleado..." height="h-screen" />;

  if (!employee)
    return (
      <EmptyState
        icon={AlertCircle}
        title="Empleado no encontrado"
        description="Ha ocurrido un error, no se encontró el empleado"
      />
    );

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/admin/employees" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-4xl font-bold text-red-600 mb-2">
            Detalles del Empleado
          </h2>
          <p className="text-center text-lg text-gray-700 mb-12">
            Aquí puedes ver los detalles completos del empleado
          </p>
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 space-y-10">
            <EmployeesDetail employee={employee} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeesDetailPage;
